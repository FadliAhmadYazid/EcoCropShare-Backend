import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          return null;
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          return null;
        }

        // Return user data with optional fields
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          location: user.location,
          favoritePlants: user.favoritePlants || [],
          profileImage: user.profileImage || "",
          image: user.profileImage || "", // Standard NextAuth field
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.location = user.location;
        token.favoritePlants = user.favoritePlants || [];
        token.profileImage = user.profileImage || "";
      }

      // Handle session update
      if (trigger === "update" && session?.user) {
        // Update the token with new data from the session
        token.name = session.user.name || token.name;
        token.email = session.user.email || token.email;
        token.location = session.user.location || token.location;
        token.favoritePlants = session.user.favoritePlants || [];
        token.profileImage = session.user.profileImage || "";
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.location = token.location as string;
        session.user.favoritePlants = (token.favoritePlants as string[]) || [];
        session.user.profileImage = (token.profileImage as string) || "";
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}