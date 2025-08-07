// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow sign-in if the user's email is the admin email
      if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        return true;
      } else {
        // Return false to deny sign-in
        console.log(`Unauthorized sign-in attempt by: ${user.email}`);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };

