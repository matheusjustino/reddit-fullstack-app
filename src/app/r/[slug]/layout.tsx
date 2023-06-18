import { notFound } from "next/navigation";

// LIBS
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

// COMPONENTS
import { AboutCommunity } from "@/components/about-community";

interface LayoutPageProps {
	children: React.ReactNode;
	params: {
		slug: string;
	};
}

const LayoutPage = async ({ children, params: { slug } }: LayoutPageProps) => {
	const session = await getAuthSession();
	const subreddit = await db.subreddit.findFirst({
		where: {
			name: slug,
		},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				},
			},
		},
	});
	const subscription = !session?.user
		? undefined
		: await db.subscription.findFirst({
				where: {
					subreddit: {
						name: slug,
					},
					user: {
						id: session.user.id,
					},
				},
		  });
	const isSubscribed = !!subscription;

	if (!subreddit) {
		return notFound();
	}

	const membersCount = await db.subscription.count({
		where: {
			subreddit: {
				name: slug,
			},
		},
	});

	return (
		<div className="sm:container max-w-7xl mx-auto h-full pt-12">
			<div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-7">
					<div className="flex flex-col col-span-2 space-y-8">
						{children}
					</div>

					{/** info sidebar */}
					<AboutCommunity
						slug={slug}
						session={session}
						isSubscribed={isSubscribed}
						membersCount={membersCount}
						subreddit={subreddit}
					/>
				</div>
			</div>
		</div>
	);
};

export default LayoutPage;
