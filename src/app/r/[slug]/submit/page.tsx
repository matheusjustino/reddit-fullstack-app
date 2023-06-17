interface SubmitPageProps {
	params: {
		slug: string;
	};
}

const SubmitPage = async ({ params: { slug } }: SubmitPageProps) => {
	return <div>SubmitPage - {slug}</div>;
};

export default SubmitPage;
