"use client";

import { FC, startTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// LIBS
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";

// HOOKS
import { useCustomToasts } from "@/hooks/use-custom-toasts";

// COMPONENTS
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
	subredditId: string;
	subredditName: string;
	isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
	subredditId,
	subredditName,
	isSubscribed,
}) => {
	const { loginToast } = useCustomToasts();
	const { refresh } = useRouter();

	const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
		mutationKey: [`subscribe-leave-toggle-${subredditId}`],
		mutationFn: async (data: SubscribeToSubredditPayload) => {
			return await axios
				.post<string>(`/api/subreddit/subscribe`, data)
				.then((res) => res.data);
		},
		onSuccess: () => {
			startTransition(() => {
				refresh();
			});

			return toast({
				title: "Subscribed",
				description: `You are now subscribed to r/${subredditName}`,
			});
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
	const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
		mutationKey: [`subscribe-leave-toggle-${subredditId}`],
		mutationFn: async (data: SubscribeToSubredditPayload) => {
			return await axios
				.post<string>(`/api/subreddit/unsubscribe`, data)
				.then((res) => res.data);
		},
		onSuccess: () => {
			startTransition(() => {
				refresh();
			});

			return toast({
				title: "Unsubscribed",
				description: `You are now unsubscribed from r/${subredditName}`,
			});
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

	return isSubscribed ? (
		<Button
			onClick={() => unsubscribe({ subredditId })}
			isLoading={isUnsubLoading}
			className="w-full mt-1 mb-4"
		>
			Leave community
		</Button>
	) : (
		<Button
			onClick={() => subscribe({ subredditId })}
			isLoading={isSubLoading}
			className="w-full mt-1 mb-4"
		>
			Join to post
		</Button>
	);
};

export { SubscribeLeaveToggle };
