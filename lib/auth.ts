import NextAuth from "next-auth";
import type { Session, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  trustHost: true,
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account?.providerAccountId) {
        token.id = account.providerAccountId;
      }
      return token;
    },
    session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.id != null) {
        session.user.id = String(token.id).trim();
      }
      return session;
    },
  },
});

export function isAuthorizedAdmin(session: Session | null): boolean {
  const configuredAdminId = (process.env.CV_ADMIN_ID ?? "").trim();
  if (!configuredAdminId) return false;
  if (!session?.user?.id) return false;
  const sessionUserId = String(session.user.id).trim();
  if (!sessionUserId) return false;
  return sessionUserId === configuredAdminId;
}