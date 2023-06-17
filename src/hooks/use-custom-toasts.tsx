import Link from "next/link";

// HOOKS
import { toast } from "@/hooks/use-toast";

// COMPONENTS
import { buttonVariants } from "@/components/ui/button";

export const useCustomToasts = () => {
	const loginToast = () => {
		const { dismiss } = toast({
			title: "Login required.",
			description: "You need to be logged in to do that.",
			variant: "destructive",
			action: (
				<Link
					onClick={() => dismiss()}
					href="/sign-in"
					className={buttonVariants({ variant: "outline" })}
				>
					Login
				</Link>
			),
		});
	};

	return { loginToast };
};
