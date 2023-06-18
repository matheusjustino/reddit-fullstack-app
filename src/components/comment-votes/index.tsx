"use client";

import { FC, useState } from "react";
import { CommentVote, VoteType } from "@prisma/client";
import { usePrevious } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import axios, { AxiosError } from "axios";

// LIBS
import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";

// HOOKS
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

// COMPONENTS
import { Button } from "@/components/ui/button";

type PartialVote = Pick<CommentVote, "type">;

interface CommentVotesProps {
	commentId: string;
	votesCount: number;
	currentVote?: PartialVote;
}

const CommentVotes: FC<CommentVotesProps> = ({
	commentId,
	votesCount: _votesCount,
	currentVote: _currentVote,
}) => {
	const { loginToast } = useCustomToasts();
	const [votesCount, setVotesCount] = useState<number>(_votesCount);
	const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
		_currentVote
	);
	const prevVote = usePrevious(currentVote);

	const { mutate: vote } = useMutation({
		mutationKey: [`comment-vote-${commentId}`],
		mutationFn: async (type: VoteType) => {
			const payload: CommentVoteRequest = {
				voteType: type,
				commentId,
			};

			await axios.patch("/api/subreddit/post/comment/vote", payload);
		},
		onMutate: (type: VoteType) => {
			if (currentVote?.type === type) {
				// User is voting the same way again, so remove their vote
				setCurrentVote(undefined);
				if (type === "UP") setVotesCount((prev) => prev - 1);
				else if (type === "DOWN") setVotesCount((prev) => prev + 1);
			} else {
				// User is voting in the opposite direction, so subtract 2
				setCurrentVote({ type });
				if (type === "UP")
					setVotesCount((prev) => prev + (currentVote ? 2 : 1));
				else if (type === "DOWN")
					setVotesCount((prev) => prev - (currentVote ? 2 : 1));
			}
		},
		onError: (error, voteType) => {
			if (voteType === "UP") setVotesCount((prev) => prev - 1);
			else setVotesCount((prev) => prev + 1);

			// reset current vote
			setCurrentVote(prevVote);

			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: "Something went wrong.",
				description: "Your vote was not registered. Please try again.",
				variant: "destructive",
			});
		},
	});

	return (
		<div className="flex gap-1">
			{/* upvote */}
			<Button
				onClick={() => vote("UP")}
				size="xs"
				variant="ghost"
				aria-label="upvote"
			>
				<ArrowBigUp
					className={cn("h-5 w-5 text-zinc-700", {
						"text-emerald-500 fill-emerald-500":
							currentVote?.type === "UP",
					})}
				/>
			</Button>

			{/* score */}
			<p className="text-center py-2 px-1 font-medium text-xs text-zinc-900">
				{votesCount}
			</p>

			{/* downvote */}
			<Button
				onClick={() => vote("DOWN")}
				size="xs"
				className={cn({
					"text-emerald-500": currentVote?.type === "DOWN",
				})}
				variant="ghost"
				aria-label="upvote"
			>
				<ArrowBigDown
					className={cn("h-5 w-5 text-zinc-700", {
						"text-red-500 fill-red-500":
							currentVote?.type === "DOWN",
					})}
				/>
			</Button>
		</div>
	);
};

export { CommentVotes };
