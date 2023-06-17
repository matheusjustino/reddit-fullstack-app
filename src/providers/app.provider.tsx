"use client";

import { FC, ReactNode, useState } from "react";
import { SessionProvider } from "next-auth/react";
import {
	QueryClientProvider,
	QueryClient,
	Hydrate,
} from "@tanstack/react-query";

interface LayoutProps {
	children: ReactNode;
	pageProps: any;
}

const AppProvider: FC<LayoutProps> = ({ children, pageProps }) => {
	const [QC] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnMount: false,
					refetchOnWindowFocus: false,
				},
			},
		})
	);

	return (
		<QueryClientProvider client={QC}>
			<Hydrate state={pageProps.dehydratedState}>
				<SessionProvider>{children}</SessionProvider>
			</Hydrate>
		</QueryClientProvider>
	);
};

export { AppProvider };
