// CONFIG
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

// LIBS
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

// COMPONENTS
import { PostFeed } from "@/components/post-feed";

const CustomFeed = async () => {
	const session = await getAuthSession();

	const followedCommunities = await db.subscription.findMany({
		where: {
			userId: session?.user.id,
		},
		include: {
			subreddit: true,
		},
	});

	const posts = await db.post.findMany({
		where: {
			subreddit: {
				name: {
					in: followedCommunities.map(
						({ subreddit }) => subreddit.name
					),
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			votes: true,
			author: true,
			comments: true,
			subreddit: true,
		},
		take: INFINITE_SCROLLING_PAGINATION_RESULTS,
	});

	return <PostFeed initialProps={posts} />;
};

export { CustomFeed };
