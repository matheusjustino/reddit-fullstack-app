"use client";

import { FC, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

// CONFIG
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";

// TYPES
import { ExtendedPost } from "@/types/db";
import { Post } from "../post";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
	initialProps: ExtendedPost[];
	subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialProps, subredditName }) => {
	const { data: session } = useSession();
	const lastPostRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: lastPostRef.current,
		threshold: 1,
	});

	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
		[`infinite-post-feed-${subredditName}`],
		async ({ pageParam = 1 }) => {
			const query =
				`/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
				(subredditName ? `&subredditName=${subredditName}` : "");

			return await axios
				.get<ExtendedPost[]>(query)
				.then((res) => res.data);
		},
		{
			initialData: {
				pages: [initialProps],
				pageParams: [1],
			},
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
		}
	);

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage(); // Load more posts when the last post comes into view
		}
	}, [entry, fetchNextPage]);

	const posts = data?.pages.flatMap((page) => page) ?? initialProps;

	return (
		<ul className="flex flex-col col-span-2 space-y-6">
			{posts.map((post, index) => {
				const votesCount = post.votes.reduce((prev, curr) => {
					if (curr.type === "UP") return prev + 1;
					if (curr.type === "DOWN") return prev - 1;
					return prev;
				}, 0);
				const currentVote = post.votes.find(
					(vote) => vote.userId === session?.user.id
				);

				if (index === posts.length - 1) {
					return (
						<li key={post.id} ref={ref}>
							<Post
								subredditName={post.subreddit.name}
								post={post}
								commentsCount={post.comments.length}
								currentVote={currentVote}
								votesCount={votesCount}
							/>
						</li>
					);
				}

				return (
					<Post
						key={post.id}
						subredditName={post.subreddit.name}
						post={post}
						commentsCount={post.comments.length}
						currentVote={currentVote}
						votesCount={votesCount}
					/>
				);
			})}

			{isFetchingNextPage && (
				<li className="flex justify-center">
					<Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
				</li>
			)}
		</ul>
	);
};

export { PostFeed };
