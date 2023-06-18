import { notFound } from "next/navigation";
import { Post, Vote, VoteType } from "@prisma/client";

// LIBS
import { getAuthSession } from "@/lib/auth";
import { PostVoteClient } from "./post-vote-client";

interface PostVoteServerProps {
	postId: string;
	initialVotesCount?: number;
	initialVote?: VoteType | null;
	getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
	hasBackButton?: boolean;
}

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PostVoteServer = async ({
	postId,
	initialVotesCount,
	initialVote,
	getData,
	hasBackButton,
}: PostVoteServerProps) => {
	const session = await getAuthSession();
	let _votesCount = 0;
	let _currentVote: VoteType | null | undefined = undefined;

	if (getData) {
		// await wait(2000);
		const post = await getData();
		if (!post) {
			return notFound();
		}

		_votesCount = post.votes.reduce((prev, curr) => {
			if (curr.type === "UP") return prev + 1;
			if (curr.type === "DOWN") return prev - 1;
			return prev;
		}, 0);
		_currentVote = post.votes.find(
			(vote) => vote.userId === session?.user.id
		)?.type;
	} else {
		_votesCount = initialVotesCount!;
		_currentVote = initialVote;
	}

	return (
		<PostVoteClient
			postId={postId}
			initialVotesCount={_votesCount}
			initialVote={_currentVote}
			hasBackButton={hasBackButton}
		/>
	);
};

export { PostVoteServer };
