"use client";

import { FC, useRef } from "react";
import { Comment, CommentVote, User } from "@prisma/client";

// LIBS
import { formatTimeToNow } from "@/lib/utils";

// COMPONENTS
import { UserAvatar } from "@/components/user-avatar";
import { CommentVotes } from "../comment-votes";

type ExtendedComment = Comment & {
	votes: CommentVote[];
	author: User;
};

type PartialVote = Pick<CommentVote, "type">;

interface PostCommentProps {
	comment: ExtendedComment;
	votesCount: number;
	currentVote?: PartialVote;
}

const PostComment: FC<PostCommentProps> = ({
	comment,
	votesCount,
	currentVote,
}) => {
	const commentRef = useRef<HTMLDivElement>(null);

	return (
		<div ref={commentRef} className="flex flex-col">
			<div className="flex items-center">
				<UserAvatar
					user={{
						name: comment.author.name || null,
						image: comment.author.image || null,
					}}
					className="h-6 w-6"
				/>

				<div className="ml-2 flex items-center gap-x-2">
					<p className="text-sm font-medium text-gray-900">
						u/{comment.author.username}
					</p>
					<p className="max-h-40 truncate text-xs text-zinc-500">
						{formatTimeToNow(new Date(comment.createdAt))}
					</p>
				</div>
			</div>

			<p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

			<div className="flex gap-2 items-center">
				<CommentVotes
					commentId={comment.id}
					votesCount={votesCount}
					currentVote={currentVote}
				/>
			</div>
		</div>
	);
};

export { PostComment };
