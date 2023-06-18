"use client";

import { FC } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const Output = dynamic(
	async () => (await import("editorjs-react-renderer")).default,
	{
		ssr: false,
	}
);

const style = {
	paragraph: {
		fontSize: "0.875rem",
		lineHeight: "1.25rem",
	},
};

const renderers = {
	image: CustomImageRenderer,
	code: CustomCodeRenderer,
};

interface EditorOutputProps {
	content: any;
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
	return (
		<Output
			className="text-sm"
			data={content}
			style={style}
			renderers={renderers}
		/>
	);
};

function CustomImageRenderer({ data }: any) {
	const src = data.file.url;

	return (
		<div className="relative w-full min-h-[15rem]">
			<Image src={src} alt="Post Image" className="object-contain" fill />
		</div>
	);
}

function CustomCodeRenderer({ data }: any) {
	return (
		<pre className="bg-gray-800 rounded-md p-4">
			<code className="text-gray-100 text-sm">{data.code}</code>
		</pre>
	);
}

export { EditorOutput };
