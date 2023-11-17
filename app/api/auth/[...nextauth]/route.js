import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/libs/db";
import User from "@/models/user.Schema";
import bcrypt from "bcrypt";
import GoogleUser from "@/models/googleUser.schema";

export const authOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials, req) {
        const { email, password } = credentials;

        try {
          await dbConnect();

          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("Invalid User");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Invalid Password");
          }
          return user;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },

    // storing Google oAuth account details in DB
    // async signIn({ user, account }) {
    //   const url = process.env.NEXT_PUBLIC_URL;
    //   const { name, email, image } = user;

    //   if (account.provider === "google") {
    //     try {
    //       await dbConnect();
    //       const userExist = await GoogleUser.findOne({ email });

    //       if (!userExist) {
    //         const result = await fetch(`${url}/api/googleUsers`, {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify({ name, email, image }),
    //         });
    //         if (result.ok) {
    //           return user;
    //         }
    //       }
    //     } catch (error) {
    //       console.log("error", error);
    //     }
    //   }
    //   return user;
    // },
  },
  session: {
    strtegy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
