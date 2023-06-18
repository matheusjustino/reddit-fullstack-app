import { Suspense } from "react";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";

// LIBS
import { formatTimeToNow } from "@/lib/utils";

// HOOKS
import { usePage } from "./usePage";

// COMPONENTS
import { buttonVariants } from "@/components/ui/button";
import { EditorOutput } from "@/components/editor-output";
import { CommentsSection } from "@/components/comments-section";
import { PostVoteServer } from "@/components/post-vote/post-vote-server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PostDetailsPageProps {
	params: {
		postId: string;
	};
}

const PostDetailsPage = async ({
	params: { postId },
}: PostDetailsPageProps) => {
	const { cachedPost, post, getData } = await usePage({ postId });

	return (
		<div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
			<div className="flex items-center sm:flex-col">
				<Suspense fallback={<PostVoteShell />}>
					{/** @ts-expect-error server component */}
					<PostVoteServer
						postId={post?.id ?? cachedPost.id}
						getData={getData}
						hasBackButton
					/>
				</Suspense>
			</div>

			<div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
				<p className="flex items-center gap-2 max-h-40 mt-1 truncate text-sm text-gray-500">
					Posted by u/
					{post?.author.name ?? cachedPost.authorUsername}{" "}
					{formatTimeToNow(
						new Date(post?.createdAt ?? cachedPost.createdAt)
					)}
				</p>

				<h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
					{post?.title ?? cachedPost.title}
				</h1>

				<EditorOutput content={post?.content ?? cachedPost.content} />

				<Suspense
					fallback={
						<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
					}
				>
					{/** @ts-expect-error server component */}
					<CommentsSection postId={post?.id ?? cachedPost.id} />
				</Suspense>
			</div>
		</div>
	);
};

function PostVoteShell() {
	return (
		<div className="flex items-center flex-col pr-6 w-20">
			{/** up vote */}
			<div
				className={buttonVariants({
					variant: "ghost",
				})}
			>
				<ArrowBigUp className="h-5 w-5 text-zinc-500" />
			</div>

			{/** score */}
			<div className="text-center py-2 font-medium text-sm text-zinc-900">
				<Loader2 className="h-3 w-3 animate-spin" />
			</div>

			{/** down vote */}
			<div
				className={buttonVariants({
					variant: "ghost",
				})}
			>
				<ArrowBigDown className="h-5 w-5 text-zinc-500" />
			</div>
		</div>
	);
}

export default PostDetailsPage;
