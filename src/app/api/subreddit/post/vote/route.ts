import { z } from "zod";

// TYPES
import type { CachedPost } from "@/types/redis";

// LIBS
import { PostVoteValidator } from "@/lib/validators/vote";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const { postId, voteType } = PostVoteValidator.parse(body);

		const existingVote = await db.vote.findFirst({
			where: {
				userId: session.user.id,
				postId,
			},
		});

		const post = await db.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				author: true,
				votes: true,
			},
		});

		if (!post) {
			return new Response("Post not found", { status: 404 });
		}

		if (existingVote) {
			if (existingVote.type === voteType) {
				await db.vote.delete({
					where: {
						userId_postId: {
							postId,
							userId: session.user.id,
						},
					},
				});

				return new Response("OK");
			} else {
				await db.vote.update({
					where: {
						userId_postId: {
							postId,
							userId: session.user.id,
						},
					},
					data: {
						type: voteType,
					},
				});

				// recount votes
				const votesCount = post.votes.reduce((prev, curr) => {
					if (curr.type === "UP") return prev + 1;
					if (curr.type === "DOWN") return prev - 1;
					return prev;
				}, 0);

				if (votesCount >= CACHE_AFTER_UPVOTES) {
					const cachePayload: CachedPost = {
						id: post.id,
						title: post.title,
						currentVote: voteType,
						content: JSON.stringify(post.content),
						authorUsername: post.author.username ?? "",
						createdAt: post.createdAt,
					};

					await redis.hset(`post:${post.id}`, cachePayload);
				}

				return new Response("OK");
			}
		}

		await db.vote.create({
			data: {
				type: voteType,
				userId: session.user.id,
				postId,
			},
		});

		// recount votes
		const votesCount = post.votes.reduce((prev, curr) => {
			if (curr.type === "UP") return prev + 1;
			if (curr.type === "DOWN") return prev - 1;
			return prev;
		}, 0);

		if (votesCount >= CACHE_AFTER_UPVOTES) {
			const cachePayload: CachedPost = {
				id: post.id,
				title: post.title,
				currentVote: voteType,
				content: JSON.stringify(post.content),
				authorUsername: post.author.username ?? "",
				createdAt: post.createdAt,
			};

			await redis.hset(`post:${post.id}`, cachePayload);
		}

		return new Response("OK");
	} catch (error: any) {
		console.error(error);

		if (error instanceof z.ZodError) {
			return new Response("Invalid request data passed", { status: 422 });
		}

		return new Response(
			"Could not register your vote at this time, please try again later.",
			{
				status: 500,
			}
		);
	}
}
