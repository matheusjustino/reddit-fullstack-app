import { FC } from "react";

// COMPONENTS
import { SignUp } from "@/components/sign-up";
import { CloseModal } from "@/components/close-modal";

const AuthModal: FC = () => {
	return (
		<div className="fixed inset-0 bg-zinc-900/20 z-10">
			<div className="container flex items-center h-full max-w-lg mx-auto">
				<div className="relative bg-white w-full h-fit py-20 px-2 rounded-lg">
					<div className="absolute top-4 right-4 cursor-pointer">
						<CloseModal />
					</div>

					<SignUp />
				</div>
			</div>
		</div>
	);
};

export default AuthModal;
