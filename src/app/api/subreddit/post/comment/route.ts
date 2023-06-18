import { z } from "zod";

// LIBS
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { CommentValidator } from "@/lib/validators/comment";

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const { postId, text, replyToId } = CommentValidator.parse(body);

		// if no existing vote, create a new vote
		await db.comment.create({
			data: {
				text,
				postId,
				authorId: session.user.id,
				replyToId,
			},
		});

		return new Response("OK");
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 400 });
		}

		return new Response(
			"Could not post to subreddit at this time. Please try later",
			{ status: 500 }
		);
	}
}
