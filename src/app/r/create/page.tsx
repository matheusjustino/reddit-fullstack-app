"use client";

import { NextPage } from "next";

// HOOKS
import { usePage } from "./usePage";

// COMPONENTS
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateCommunityPage: NextPage = () => {
	const { input, setInput, back, createCommunity, isLoading } = usePage();

	return (
		<div className="sm:max-w-3xl flex items-center h-full max-w-3xl mx-auto">
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
