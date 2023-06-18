import Link from "next/link";

// AUTH
import { getAuthSession } from "@/lib/auth";

// COMPONENTS
import { Icons } from "@/components/icons";
import { SearchBar } from "@/components/search-bar";
import { buttonVariants } from "@/components/ui/button";
import { UserAccountNav } from "@/components/user-account-nav";

const Navbar = async () => {
	const session = await getAuthSession();

	return (
		<div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
			<div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
				{/** LOGO */}
				<Link href="/" className="flex gap-2 items-center">
					<Icons.logoFull className="hidden sm:block sm:w-25 sm:h-8" />
					<Icons.logo className="w-8 sm:hidden" />
					{/* <p className="hidden text-zinc-700 text-sm font-medium md:block">
						Reddit
					</p> */}
				</Link>

				{/** search bar */}
				<SearchBar />

				{/** sign-in button with button styles */}
				{session ? (
					<UserAccountNav
						user={{
							...session.user,
							name: session.user.name || null,
							email: session.user.email || null,
							image: session.user.image || null,
						}}
					/>
				) : (
					<Link
						href="/sign-in"
						className={buttonVariants({
							className: "whitespace-nowrap",
						})}
					>
						Sign In
					</Link>
				)}
			</div>
		</div>
	);
};

export { Navbar };
