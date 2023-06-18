"use client";

import { FC, useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Prisma, Subreddit } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import axios from "axios";

// HOOKS
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

// COMPONENTS
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

type QueryResult = (Subreddit & { _count: Prisma.SubredditCountOutputType })[];

const SearchBar: FC = () => {
	const { push, refresh } = useRouter();
	const commandRef = useRef<HTMLDivElement>(null);
	const [input, setInput] = useState<string>("");
	const {
		data: queryResults,
		refetch,
		isFetched,
	} = useQuery({
		queryKey: [`search-communities`],
		queryFn: async () => {
			if (!input?.length) return;
			return await axios
				.get<QueryResult>(`/api/search?q=${input}`)
				.then((res) => res.data);
		},
		enabled: false,
	});

	useOnClickOutside(commandRef, () => {
		setInput("");
	});

	const request = debounce(() => {
		refetch();
	}, 500);
	const debouncedRequest = useCallback(() => {
		request();
	}, []);

	return (
		<Command
			ref={commandRef}
			className="relative rounded-lg border max-w-lg z-50 overflow-visible"
		>
			<CommandInput
				value={input}
				onValueChange={(text: string) => {
					setInput(text);
					debouncedRequest();
				}}
				className="outline-none border-none focus:border-none focus:outline-none ring-0"
				placeholder="Search communities..."
			/>

			{input.length > 0 ? (
				<CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
					{isFetched && (
						<CommandEmpty>No results found.</CommandEmpty>
					)}
					{queryResults?.length ?? 0 > 0 ? (
						<CommandGroup heading="Communities">
							{queryResults?.map((subreddit) => {
								return (
									<CommandItem
										key={subreddit.id}
										value={subreddit.name}
										onSelect={(e) => {
											push(`/r/${e}`);
											refresh();
										}}
									>
										<Users className="mr-2 h-4 w-4" />
										<a href={`/r/${subreddit.name}`}>
											{subreddit.name}
										</a>
									</CommandItem>
								);
							})}
						</CommandGroup>
					) : null}
				</CommandList>
			) : null}
		</Command>
	);
};

export { SearchBar };
