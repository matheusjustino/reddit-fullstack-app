// LIBS
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

// COMPONENTS
import { PostComment } from "@/components/post-comment";
import { CreateComment } from "@/components/create-comment";

interface CommentsSectionProps {
	postId: string;
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
	const session = await getAuthSession();

	const comments = await db.comment.findMany({
		where: {
			postId,
			replyToId: null,
		},
		include: {
			author: true,
			votes: true,
			replies: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});

	return (
		<div className="flex flex-col gap-y-4 mt-4">
			<hr className="w-full h-px my-6" />

			{/** TODO: create comment */}
			<CreateComment postId={postId} />

			<div className="flex flex-col gap-y-6 mt-4">
				{comments
					.filter((comment) => !comment.replyToId)
					.map((topLevelComment) => {
						const topLevelCommentVotes =
							topLevelComment.votes.reduce((prev, curr) => {
								if (curr.type === "UP") return prev + 1;
								if (curr.type === "DOWN") return prev - 1;
								return prev;
							}, 0);
						const topLevelCommentVote = topLevelComment.votes.find(
							(tlc) => tlc.userId === session?.user.id
						);

						return (
							<div
								key={topLevelComment.id}
								className="flex flex-col"
							>
								<div className="mb-2">
									<PostComment
										comment={topLevelComment}
										votesCount={topLevelCommentVotes}
										currentVote={topLevelCommentVote}
									/>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export { CommentsSection };
