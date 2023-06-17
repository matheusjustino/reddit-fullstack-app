import { FC } from "react";
import Image from "next/image";
import { User } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";

// COMPONENTS
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";

interface UserAvatarProps extends AvatarProps {
	user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
	return (
		<Avatar {...props}>
			{user?.image ? (
				<div className="relative aspect-square h-full w-full">
					<Image
						src={user.image}
						alt="User Picture"
						referrerPolicy="no-referrer"
						fill
					/>
				</div>
			) : (
				<AvatarFallback>
					<span className="sr-only">{user?.name}</span>
					<Icons.user />
				</AvatarFallback>
			)}
		</Avatar>
	);
};

export { UserAvatar };
