"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VoteType } from "@prisma/client";
import { usePrevious } from "@mantine/hooks";
import { ArrowBigDown, ArrowBigUp, CornerUpLeft } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// HOOKS
import { useCustomToasts } from "@/hooks/use-custom-toasts";

// LIBS
import { cn } from "@/lib/utils";
import { PostVoteRequest } from "@/lib/validators/vote";

// COMPONENTS
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PostVoteClientProps {
	postId: string;
	initialVotesCount: number;
	initialVote?: VoteType | null;
	hasBackButton?: boolean;
}

const PostVoteClient: FC<PostVoteClientProps> = ({
	postId,
	initialVotesCount,
	initialVote,
	hasBackButton,
}) => {
	const { loginToast } = useCustomToasts();
	const { back } = useRouter();
	const [votesCount, setVotesCount] = useState<number>(initialVotesCount);
	const [currentVote, setCurrentVote] = useState(initialVote);
	const prevVote = usePrevious(currentVote);

	const { mutate: votePost } = useMutation({
		mutationKey: [`post-vote-client-${postId}`],
		mutationFn: async (voteType: VoteType) => {
			const payload: PostVoteRequest = {
				postId,
				voteType,
			};

			await axios.patch(`/api/subreddit/post/vote`, payload);
		},
		onMutate: (type: VoteType) => {
			if (currentVote === type) {
				setCurrentVote(undefined);
				if (type === "UP") setVotesCount((prev) => prev - 1);
				else if (type === "DOWN") setVotesCount((prev) => prev + 1);
			} else {
				setCurrentVote(type);
				if (type === "UP")
					setVotesCount((prev) => prev + (currentVote ? 2 : 1));
				else if (type === "DOWN")
					setVotesCount((prev) => prev - (currentVote ? 2 : 1));
			}
		},
		onError: (error: any, voteType) => {
			console.error(error);
			if (voteType === "UP") {
				setVotesCount((prev) => prev - 1);
			} else {
				setVotesCount((prev) => prev + 1);
			}

			setCurrentVote(prevVote);

			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: "Something went wrong",
				description: "Your vote was not registered, please try again.",
				variant: "destructive",
			});
		},
	});

	useEffect(() => {
		setCurrentVote(initialVote);
	}, [initialVote]);

	return (
		<div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 sm:pb-0">
			{hasBackButton && (
				<Button
					onClick={back}
					size="sm"
					variant="ghost"
					aria-label="upvote"
				>
					<CornerUpLeft className="w-5 h-5" />
				</Button>
			)}

			<Button
				onClick={() => votePost("UP")}
				size="sm"
				variant="ghost"
				aria-label="upvote"
			>
				<ArrowBigUp
					className={cn("h-5 w-5 text-zinc-700", {
						"text-emerald-500 fill-emerald-500":
							currentVote === "UP",
					})}
				/>
			</Button>

			<p className="text-center py-2 font-medium text-sm text-zinc-900">
				{votesCount}
			</p>

			<Button
				onClick={() => votePost("DOWN")}
				size="sm"
				variant="ghost"
				aria-label="upvote"
			>
				<ArrowBigDown
					className={cn("h-5 w-5 text-zinc-700", {
						"text-red-500 fill-red-500": currentVote === "DOWN",
					})}
				/>
			</Button>
		</div>
	);
};

export { PostVoteClient };
