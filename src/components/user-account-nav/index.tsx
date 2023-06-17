"use client";

import { FC } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User } from "@prisma/client";

// COMPONENTS
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";

interface UserAccountNavProps {
	user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
	const handleSignOut = (e: Event) => {
		e.preventDefault();
		signOut({ callbackUrl: `${window.location.origin}/sign-in` });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:rounded-full">
				<UserAvatar
					className="w-9 h-9 sm:w-10 sm:h-10"
					user={{
						name: user.name || null,
						image: user.image || null,
					}}
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="bg-white" align="end">
				<div className="flex items-center justify-start gap-2 p-2">
					<div className="flex flex-col space-y-1 leading-none">
						{user.name && (
							<p className="font-medium">{user.name}</p>
						)}

						{user.email && (
							<p className="w-[200px] truncate text-sm text-zinc-700">
								{user.email}
							</p>
						)}
					</div>
				</div>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="cursor-pointer" asChild>
					<Link href="/">Feed</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className="cursor-pointer" asChild>
					<Link href="/r/create">Create Community</Link>
				</DropdownMenuItem>

				<DropdownMenuItem className="cursor-pointer" asChild>
					<Link href="/settings">Settings</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onSelect={handleSignOut}
					className="cursor-pointer"
				>
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { UserAccountNav };
