import Link from "next/link";
import { Session } from "next-auth";
import { format } from "date-fns";
import { Post, Subreddit, User, Vote } from "@prisma/client";

// COMPONENTS
import { SubscribeLeaveToggle } from "@/components/subscribe-leave-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface AboutCommunityProps {
	slug: string;
	session?: Session | null;
	isSubscribed: boolean;
	membersCount: number;
	subreddit: Subreddit & {
		posts: (Post & {
			author: User;
			votes: Vote[];
		})[];
	};
}

const AboutCommunity = ({
	slug,
	session,
	isSubscribed,
	subreddit,
	membersCount,
}: AboutCommunityProps) => {
	return (
		<Accordion
			type="single"
			collapsible
			className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last"
			defaultValue="item-1"
		>
			<AccordionItem value="item-1">
				<AccordionTrigger className="px-6 py-4">
					<p className="font-semibold py-3">
						About r/{subreddit.name}
					</p>
				</AccordionTrigger>
				<AccordionContent>
					<dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
						<div className="flex justify-between gap-x-4 py-3">
							<dt className="text-gray-500">Created</dt>
							<dd className="text-gray-700">
								<time
									dateTime={subreddit.createdAt.toDateString()}
								>
									{format(
										subreddit.createdAt,
										"MMMM d, yyyy"
									)}
								</time>
							</dd>
						</div>

						<div className="flex justify-between gap-x-4 py-3">
							<dt className="text-gray-500">Members</dt>
							<dd className="text-gray-700">
								<div className="text-gray-900">
									{membersCount}
								</div>
							</dd>
						</div>

						{subreddit.creatorId === session?.user.id ? (
							<div className="flex justify-between gap-x-4 py-3">
								<p className="text-gray-500">
									You created this community
								</p>
							</div>
						) : null}

						{subreddit.creatorId !== session?.user.id ? (
							<SubscribeLeaveToggle
								subredditId={subreddit.id}
								subredditName={subreddit.name}
								isSubscribed={isSubscribed}
							/>
						) : null}

						<Link
							href={`r/${slug}/submit`}
							className={buttonVariants({
								variant: "outline",
								className: "w-full mb-6",
							})}
						>
							Create Post
						</Link>
					</dl>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};

export { AboutCommunity };
