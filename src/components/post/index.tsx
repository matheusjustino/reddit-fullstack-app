import { FC, useRef } from "react";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";

// LIBS
import { formatTimeToNow } from "@/lib/utils";

// COMPONENTS
import { EditorOutput } from "@/components/editor-output";
import { PostVoteClient } from "../post-vote/post-vote-client";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
	subredditName: string;
	commentsCount: number;
	votesCount: number;
	currentVote?: PartialVote;
	post: Post & {
		author: User;
		votes: Vote[];
	};
}

const Post: FC<PostProps> = ({
	subredditName,
	commentsCount,
	post,
	votesCount: _votesCount,
	currentVote,
}) => {
	const postRef = useRef<HTMLDivElement>(null);
	const linkHref =
		typeof window !== "undefined" &&
		window.location.pathname === `/r/${subredditName}`
			? subredditName
			: `r/${subredditName}`;

	return (
		<div className="rounded-md bg-white shadow">
			<div className="px-6 py-4 flex justify-between">
				<PostVoteClient
					postId={post.id}
					initialVote={currentVote?.type}
					initialVotesCount={_votesCount}
				/>

				<div className="w-0 flex-1">
					<div className="max-h-40 mt-1 text-gray-500">
						{subredditName ? (
							<>
								<a
									href={linkHref}
									className="underline text-zinc-900 text-sm underline-offset-2"
								>
									r/{subredditName}
								</a>
								<span className="px-1">•</span>
							</>
						) : null}
						<span>Posted by u/{post.author.name}</span>{" "}
						{formatTimeToNow(new Date(post.createdAt))}
					</div>

					<a href={`/r/${subredditName}/post/${post.id}`}>
						<h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
							{post.title}
						</h1>
					</a>

					<div
						className="relative text-sm max-h-40 w-full overflow-clip"
						ref={postRef}
					>
						<EditorOutput content={post.content} />

						{postRef.current?.clientHeight === 160 ? (
							<div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
						) : null}
					</div>
				</div>
			</div>

			<div className="bg-gray-50 z-20 text-sm py-4 px-2 sm:px-6">
				<a
					href={`/r/${subredditName}/post/${post.id}`}
					className="w-fit flex items-center gap-2"
				>
					<MessageSquare className="h-4 w-4" /> {commentsCount}{" "}
					comments
				</a>
			</div>
		</div>
	);
};

export { Post };
