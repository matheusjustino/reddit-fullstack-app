"use client";

import { FC } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "next-auth";
import { ImageIcon, Link2 } from "lucide-react";

// COMPONENTS
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";

interface MiniCreatePostProps {
	session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
	const { push } = useRouter();
	const pathname = usePathname();

	return (
		<li className="overflow-hidden rounded-md bg-white shadow list-none">
			<div className="h-full px-6 py-4 flex justify-between gap-6">
				<div className="relative">
					<UserAvatar
						user={{
							name: session?.user.name || null,
							image: session?.user.image || null,
						}}
					/>

					<span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
				</div>

				<Input
					readOnly
					onClick={() => push(`${pathname}/submit`)}
					placeholder="Create post"
				/>

				<Button
					className="hidden xs:block"
					onClick={() => push(`${pathname}/submit`)}
					variant="ghost"
				>
					<ImageIcon className="text-zinc-600" />
				</Button>

				<Button
					className="hidden xs:block"
					onClick={() => push(`${pathname}/submit`)}
					variant="ghost"
				>
					<Link2 className="text-zinc-600" />
				</Button>
			</div>
		</li>
	);
};

export { MiniCreatePost };
