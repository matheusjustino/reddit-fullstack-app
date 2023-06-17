"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// HOOKS
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

// TYPES
import { CreateSubredditPayload } from "@/lib/validators/subreddit";

// COMPONENTS
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateCommunityPage: NextPage = () => {
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

	return (
		<div className="container flex items-center h-full max-w-3xl mx-auto">
			<div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-semibold">
						Create a community
					</h1>
				</div>

				<hr className="bg-zinc-500 h-px" />

				<div>
					<p className="text-lg font-medium">Name</p>
					<p className="text-xs pb-2">
						Community names including capitalization cannot be
						changed.
					</p>

					<div className="relative">
						<p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
							r/
						</p>

						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="pl-6"
						/>
					</div>
				</div>

				<div className="flex justify-end gap-4">
					<Button variant="subtle" onClick={back}>
						Cancel
					</Button>

					<Button
						onClick={() =>
							createCommunity({
								name: input,
							})
						}
						isLoading={isLoading}
						disabled={isLoading || !input.length}
					>
						Create Community
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CreateCommunityPage;
