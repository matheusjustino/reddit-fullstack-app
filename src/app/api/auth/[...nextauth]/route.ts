import NextAuth, { getServerSession } from "next-auth";

// AUTH
import { authOptions } from "@/lib/auth";

export const getAuthSession = () => getServerSession(authOptions);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
