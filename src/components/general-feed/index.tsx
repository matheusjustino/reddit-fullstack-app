// CONFIG
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

// LIBS
import { db } from "@/lib/db";

// COMPONENTS
import { PostFeed } from "@/components/post-feed";

const GeneralFeed = async () => {
	const posts = await db.post.findMany({
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

export { GeneralFeed };
