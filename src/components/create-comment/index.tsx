"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// LIBS
import { CommentRequest } from "@/lib/validators/comment";

// HOOKS
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

// COMPONENTS
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CreateCommentProps {
	postId: string;
	replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
	const { loginToast } = useCustomToasts();
	const { refresh } = useRouter();
	const [input, setInput] = useState<string>("");

	const { mutate: createComment, isLoading } = useMutation({
		mutationKey: [`create-comment-post-${postId}`],
		mutationFn: async (data: CommentRequest) => {
			return await axios
				.patch(`/api/subreddit/post/comment`, data)
				.then((res) => res.data);
		},
		onSuccess: () => {
			refresh();
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

	return (
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

				<div className="mt-2 flex justify-end">
					<Button
						onClick={() =>
							createComment({
								postId,
								replyToId,
								text: input,
							})
						}
						isLoading={isLoading}
						disabled={isLoading}
					>
						Post
					</Button>
				</div>
			</div>
		</div>
	);
};

export { CreateComment };
