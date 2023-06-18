"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import type EditorJS from "@editorjs/editorjs";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// HOOKS
import { toast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

// LIBS
import { uploadFiles } from "@/lib/uploadthing";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";

interface EditorProps {
	subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
	const { loginToast } = useCustomToasts();
	const [isMounted, setIsMounted] = useState<boolean>(false);
	const editorRef = useRef<EditorJS>();
	const _titleRef = useRef<HTMLTextAreaElement>(null);
	const pathname = usePathname();
	const { push, refresh } = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PostCreationRequest>({
		resolver: zodResolver(PostValidator),
		defaultValues: {
			subredditId,
			title: "",
			content: null,
		},
	});
	const { mutate: createPost } = useMutation({
		mutationKey: [`create-post-subreddit-${subredditId}`],
		mutationFn: async (data: PostCreationRequest) => {
			return await axios
				.post("/api/subreddit/post/create", data)
				.then((res) => res.data);
		},
		onSuccess: (data) => {
			const newPathname = pathname.split("/").slice(0, -1).join("/");
			push(newPathname);
			refresh();

			return toast({
				description: "Your post has been published.",
			});
		},
		onError: (error: any) => {
			console.error(error);
			if (error instanceof AxiosError) {
				if (error.response?.status === 401) {
					return loginToast();
				}
			}
			return toast({
				title: "Something went wrong",
				description:
					"Your post was not published, please try again later.",
				variant: "destructive",
			});
		},
	});

	const initializeEditor = useCallback(async () => {
		const EditorJS = (await import("@editorjs/editorjs")).default;
		const Header = (await import("@editorjs/header")).default;
		const Embed = (await import("@editorjs/embed")).default;
		const Table = (await import("@editorjs/table")).default;
		const List = (await import("@editorjs/list")).default;
		const Code = (await import("@editorjs/code")).default;
		const LinkTool = (await import("@editorjs/link")).default;
		const InlineCode = (await import("@editorjs/inline-code")).default;
		const ImageTool = (await import("@editorjs/image")).default;

		if (!editorRef.current) {
			const editor = new EditorJS({
				holder: "editor",
				onReady: () => {
					editorRef.current = editor;
				},
				placeholder: "Type here to write your post...",
				inlineToolbar: true,
				data: {
					blocks: [],
				},
				tools: {
					header: Header,
					linkTool: {
						class: LinkTool,
						config: {
							endpoint: "/api/link",
						},
					},
					image: {
						class: ImageTool,
						config: {
							uploader: {
								uploadByFile: async (file: File) => {
									const [res] = await uploadFiles(
										[file],
										"imageUploader"
									);
									return {
										success: 1,
										file: {
											url: res.fileUrl,
										},
									};
								},
							},
						},
					},
					list: List,
					code: Code,
					inlineCode: InlineCode,
					table: Table,
					embed: Embed,
				},
			});
		}
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setIsMounted(true);
		}
	}, []);

	useEffect(() => {
		if (Object.keys(errors).length) {
			for (const [_key, value] of Object.entries(errors)) {
				toast({
					title: "Something went wrong",
					description: (value as { message: string }).message,
					variant: "destructive",
				});
			}
		}
	}, [errors]);

	useEffect(() => {
		const init = async () => {
			await initializeEditor();
			setTimeout(() => {
				// set focus to title
				_titleRef.current?.focus();
			}, 0);
		};

		if (isMounted) {
			init();

			return () => {
				editorRef.current?.destroy();
				editorRef.current = undefined;
			};
		}
	}, [isMounted, initializeEditor]);

	const onSubmit = async (data: PostCreationRequest) => {
		const blocks = await editorRef.current?.save();
		const payload: PostCreationRequest = {
			title: data.title,
			content: blocks,
			subredditId,
		};
		createPost(payload);
	};

	if (!isMounted) {
		return null;
	}

	const { ref: titleRef, ...rest } = register("title");

	return (
		<div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
			<form
				id="subreddit-post-form"
				className="w-fit"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="prose prose-stone dark:prose-invert">
					<TextareaAutosize
						ref={(e) => {
							titleRef(e);
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							_titleRef.current = e;
						}}
						{...rest}
						placeholder="Title"
						className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
					/>

					<div id="editor" className="min-h-[500px]" />
				</div>
			</form>
		</div>
	);
};

export { Editor };
