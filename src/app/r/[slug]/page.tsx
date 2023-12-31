import { notFound } from "next/navigation";

// CONFIG
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

// LIBS
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

// COMPONENTS
import { PostFeed } from "@/components/post-feed";
import { MiniCreatePost } from "@/components/mini-create-post";

interface SubredditPageProps {
	params: {
		slug: string;
	};
}

const SubredditPage = async ({ params: { slug } }: SubredditPageProps) => {
	const session = await getAuthSession();
	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
					comments: true,
					subreddit: true,
				},
				take: INFINITE_SCROLLING_PAGINATION_RESULTS,
			},
		},
	});

	if (!subreddit) {
		return notFound();
	}

	return (
		<>
			<h1 className="font-bold text-3xl md:text-4xl h-14">
				r/{subreddit.name}
			</h1>

			<MiniCreatePost session={session} />

			<PostFeed
				initialProps={subreddit.posts}
				subredditName={subreddit.name}
			/>
		</>
	);
};

export default SubredditPage;
