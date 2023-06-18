import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";

// TYPES
import { CachedPost } from "@/types/redis";

// LIBS
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";

// COMPONENTS
import { buttonVariants } from "@/components/ui/button";
import { EditorOutput } from "@/components/editor-output";
import { CommentsSection } from "@/components/comments-section";
import { PostVoteServer } from "@/components/post-vote/post-vote-server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PostDetailsPageProps {
	params: {
		postId: string;
	};
}

const PostDetailsPage = async ({
	params: { postId },
}: PostDetailsPageProps) => {
	const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;
	let post: (Post & { votes: Vote[]; author: User }) | null = null;
	if (!cachedPost) {
		post = await db.post.findFirst({
			where: {
				id: postId,
			},
			include: {
				votes: true,
				author: true,
			},
		});
	}

	if (!post && !cachedPost) return notFound();

	const getData = async () => {
		return await db.post.findUnique({
			where: {
				id: postId,
			},
			include: {
				votes: true,
			},
		});
	};

	return (
		<div>
			<div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
				<Suspense fallback={<PostVoteShell />}>
					{/** @ts-expect-error server component */}
					<PostVoteServer
						postId={post?.id ?? cachedPost.id}
						getData={getData}
					/>
				</Suspense>

				<div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
					<p className="max-h-40 mt-1 truncate text-sm text-gray-500">
						Posted by u/
						{post?.author.name ?? cachedPost.authorUsername}{" "}
						{formatTimeToNow(
							new Date(post?.createdAt ?? cachedPost.createdAt)
						)}
					</p>

					<h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
						{post?.title ?? cachedPost.title}
					</h1>

					<EditorOutput
						content={post?.content ?? cachedPost.content}
					/>

					<Suspense
						fallback={
							<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
						}
					>
						{/** @ts-expect-error server component */}
						<CommentsSection postId={post?.id ?? cachedPost.id} />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

function PostVoteShell() {
	return (
		<div className="flex items-center flex-col pr-6 w-20">
			{/** up vote */}
			<div
				className={buttonVariants({
					variant: "ghost",
				})}
			>
				<ArrowBigUp className="h-5 w-5 text-zinc-500" />
			</div>

			{/** score */}
			<div className="text-center py-2 font-medium text-sm text-zinc-900">
				<Loader2 className="h-3 w-3 animate-spin" />
			</div>

			{/** down vote */}
			<div
				className={buttonVariants({
					variant: "ghost",
				})}
			>
				<ArrowBigDown className="h-5 w-5 text-zinc-500" />
			</div>
		</div>
	);
}

export default PostDetailsPage;
