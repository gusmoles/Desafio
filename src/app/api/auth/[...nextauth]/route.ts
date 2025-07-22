import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                console.log("[Auth] Authorize called with:", credentials);
                if (!credentials?.email || !credentials?.password) {
                    console.warn("[Auth] Missing email or password");
                    return null;
                }

                let user;
                try {
                    user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });
                    console.log("[Auth] Usuário encontrado:", user);
                } catch (err) {
                    console.error("[Auth] Error fetching user:", err);
                    return null;
                }

                if (!user) {
                    console.warn("[Auth] No user found for email:", credentials.email);
                    return null;
                }

                let isValid;
                try {
                    isValid = await compare(credentials.password, user.password);
                    console.log("[Auth] Senha válida?", isValid);
                } catch (err) {
                    console.error("[Auth] Error comparing password:", err);
                    return null;
                }

                if (!isValid) {
                    console.warn("[Auth] Invalid password for user:", credentials.email);
                    return null;
                }

                console.log("[Auth] Authentication successful for:", user.email);
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // Disable redirects completely
        redirect: async ({ url, baseUrl }) => {
            console.log("[Auth] Redirect callback called with:", { url, baseUrl });
            return baseUrl; // Always return base URL to prevent redirects
        },
    },
    pages: {
        signIn: "/",
        // Completely removed error page
    },
});

export { handler as GET, handler as POST }; 