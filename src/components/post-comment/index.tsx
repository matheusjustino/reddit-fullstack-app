"use client";

import { FC, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Comment, CommentVote, User } from "@prisma/client";
import { MessageSquare } from "lucide-react";

// LIBS
import { formatTimeToNow } from "@/lib/utils";

// COMPONENTS
import { UserAvatar } from "@/components/user-avatar";
import { CommentVotes } from "@/components/comment-votes";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { CommentRequest } from "@/lib/validators/comment";

type ExtendedComment = Comment & {
	votes: CommentVote[];
	author: User;
};

type PartialVote = Pick<CommentVote, "type">;

interface PostCommentProps {
	postId: string;
	comment: ExtendedComment;
	votesCount: number;
	currentVote?: PartialVote;
}

const PostComment: FC<PostCommentProps> = ({
	postId,
	comment,
	votesCount,
	currentVote,
}) => {
	const { loginToast } = useCustomToasts();
	const { data: session } = useSession();
	const { push, refresh } = useRouter();
	const commentRef = useRef<HTMLDivElement>(null);
	const [isReplying, setIsReplying] = useState<boolean>(false);
	const [input, setInput] = useState<string>("");

	const { mutate: createPostComment, isLoading } = useMutation({
		mutationKey: [`create-reply-comment-${comment.id}`],
		mutationFn: async (data: CommentRequest) => {
			return await axios
				.patch(`/api/subreddit/post/comment`, data)
				.then((res) => res.data);
		},
		onSuccess: () => {
			refresh();
			setIsReplying(false);
			setInput("");
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: `There was an problem`,
				description: `Something went wrong, please try again.`,
				variant: "destructive",
			});
		},
	});

	const handleCreatePostComment = () => {
		if (!input.length) return;
		createPostComment({
			postId,
			replyToId: comment.replyToId ?? comment.id,
			text: input,
		});
	};

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

			<div className="flex gap-2 items-center flex-wrap">
				<CommentVotes
					commentId={comment.id}
					votesCount={votesCount}
					currentVote={currentVote}
				/>

				<Button
					onClick={() => {
						if (!session) return push("/sign-in");
						setIsReplying(true);
					}}
					variant="ghost"
					size="xs"
					aria-label="reply"
				>
					<MessageSquare className="h-4 w-4 mr-1.5" />
					Reply
				</Button>

				{/** comment reply section */}
				{isReplying ? (
					<div className="grid w-full gap-1.5">
						<Label>Your comment</Label>
						<div className="grid w-full gap-1.5">
							<Label htmlFor="comment"></Label>
							<div className="mt-2">
								<Textarea
									id="comment"
									value={input}
									onChange={(e) => setInput(e.target.value)}
									rows={1}
									placeholder="What are your thoughts?"
								/>

								<div className="mt-2 flex justify-end gap-2">
									<Button
										tabIndex={-1}
										variant="subtle"
										onClick={() => setIsReplying(false)}
									>
										Cancel
									</Button>
									<Button
										onClick={handleCreatePostComment}
										isLoading={isLoading}
										disabled={isLoading || !input.length}
									>
										Post
									</Button>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export { PostComment };
