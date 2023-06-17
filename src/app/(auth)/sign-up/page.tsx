import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

// UTILS
import { cn } from "@/lib/utils";

// COMPONENTS
import { buttonVariants } from "@/components/ui/button";
import { SignUp } from "@/components/sign-up";

const SignUpPage = () => {
	return (
		<div className="absolute inset-0">
			<div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
				<Link
					href="/"
					className={cn(
						buttonVariants({ variant: "ghost" }),
						"self-start -mt-20"
					)}
				>
					<ChevronLeftIcon className="mr-2 h-4 w-4" /> Home
				</Link>

				<SignUp />
			</div>
		</div>
	);
};

export default SignUpPage;
