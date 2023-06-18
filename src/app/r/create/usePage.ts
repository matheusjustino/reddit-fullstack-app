import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// HOOKS
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

// TYPES
import { CreateSubredditPayload } from "@/lib/validators/subreddit";

const usePage = () => {
	const [input, setInput] = useState<string>("");
	const { back, push } = useRouter();
	const { loginToast } = useCustomToasts();

	const { mutate: createCommunity, isLoading } = useMutation({
		mutationKey: ["create-community"],
		mutationFn: async (data: CreateSubredditPayload) => {
			return await axios
				.post<string>(`/api/subreddit`, data)
				.then((res) => res.data);
		},
		onSuccess: (data) => {
			toast({
				title: "Community created successfully!",
				variant: "destructive",
				style: {
					backgroundColor: "#10B981",
					borderColor: "#10B981",
				},
			});

			setTimeout(() => push(`/r/${data}`), 750);
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				if (error.response?.status === 409) {
					return toast({
						title: "Subreddit already exists",
						description:
							"Please choose a different subreddit name.",
						variant: "destructive",
					});
				}

				if (error.response?.status === 422) {
					return toast({
						title: "Invalid subreddit name",
						description:
							"Please choose a name between 3 and 21 characters.",
						variant: "destructive",
					});
				}

				if (error.response?.status === 401) {
					return loginToast();
				}
			}

			toast({
				title: "There was an error",
				description: "Could not create subreddit.",
				variant: "destructive",
			});
		},
	});

	return {
		input,
		setInput,
		back,
		createCommunity,
		isLoading,
	};
};

export { usePage };
