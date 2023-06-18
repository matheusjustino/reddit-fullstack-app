import { notFound } from "next/navigation";
import { Post, User, Vote } from "@prisma/client";

// TYPES
import { CachedPost } from "@/types/redis";

// LIBS
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";

interface UsePageProps {
	postId: string;
}

const usePage = async ({ postId }: UsePageProps) => {
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

	return {
		cachedPost,
		post,
		getData,
	};
};

export { usePage };
