import "@/styles/globals.css";

import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

// UTILS
import { cn } from "@/lib/utils";

// PROVIDERS
import { AppProvider } from "@/providers/app.provider";

// COMPONENTS
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
	title: "Reddit",
	description: "A Reddit clone built with Next.js and TypeScript.",
	icons: {
		icon: "/favicon.svg",
	},
};

const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
	authModal,
	...props
}: {
	children: React.ReactNode;
	authModal: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn(
				"bg-white text-slate-900 antialiased light",
				font.className
			)}
		>
			<AppProvider pageProps={props}>
				<body className="min-h-screen pt-12 bg-slate-50 antialiased">
					{/* @ts-expect-error server component */}
					<Navbar />

					{authModal}

					<div className="container max-w-7xl mx-auto h-full pt-12">
						{children}
					</div>

					<Toaster />
					<NextTopLoader
						showSpinner={false}
						speed={200}
						color="#ff4500"
					/>
				</body>
			</AppProvider>
		</html>
	);
}
