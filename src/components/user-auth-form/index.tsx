"use client";

import { FC, HTMLAttributes, useState } from "react";
import { signIn } from "next-auth/react";

// LIBS
import { cn } from "@/lib/utils";

// HOOKS
import { useToast } from "@/hooks/use-toast";

// COMPONENTS
import { Button } from "../ui/button";
import { Icons } from "../icons";

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { toast } = useToast();

	const loginWithGoogle = async () => {
		setIsLoading(true);

		try {
			await signIn("google");
		} catch (error) {
			console.error(error);
			toast({
				title: "There was a problem",
				description: "There was an error logging in with Google",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex justify-center", className)} {...props}>
			<Button
				onClick={loginWithGoogle}
				isLoading={isLoading}
				size="sm"
				className="w-full"
			>
				{isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
				Google
			</Button>
		</div>
	);
};

export { UserAuthForm };
