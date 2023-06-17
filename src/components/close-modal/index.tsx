"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

// COMPONENTS
import { Button } from "@/components/ui/button";

const CloseModal = () => {
	const { back } = useRouter();

	return (
		<Button
			onClick={back}
			variant="subtle"
			className="h-6 w-6 p-0 rounded-md"
			aria-label="close modal"
		>
			<X className="h-4 w-4" />
		</Button>
	);
};

export { CloseModal };
