import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    };
  }
}

// MongoDB connection
const client = new MongoClient(process.env.MONGODB_URI as string);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // OAuth Providers
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      issuer: "https://www.linkedin.com",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid_connect_jwks",
      profile(profile) {
        const defaultImage = "https://cdn.auth0.com/avatars/default.png";
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture ?? defaultImage,
        };
      },
    }),
    // Credentials Provider for email/password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = await clientPromise;
          const users = client.db().collection("users");

          const user = await users.findOne({ email: credentials.email });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password as string
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Store all user data in the token
        token.id = user.id;
        token.name = user.name; // Explicitly set name
        token.email = user.email; // Explicitly set email
        token.image = user.image; // Explicitly set image
      }
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        // Map all token data to session
        session.user.id = token.sub || (token.id as string);
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture || (token.image as string);
        session.user.provider = token.provider as string;
      }

      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      // For OAuth providers, ensure user exists in database
      try {
        const client = await clientPromise;
        const users = client.db().collection("users");

        const existingUser = await users.findOne({ email: user.email });

        if (!existingUser) {
          // Create user record for OAuth sign-in
          await users.insertOne({
            email: user.email,
            name: user.name,
            image: user.image,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
            emailVerified: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
  },
  events: {
    async createUser({ user }) {
      console.log("New user created:", user.email);
    },
    async signIn({ user, account }) {
      console.log("User signed in:", user.email, "via", account?.provider);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

// Helper function to verify passwords
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Helper function to get user by email
export async function getUserByEmail(email: string) {
  try {
    const client = await clientPromise;
    const users = client.db().collection("users");
    return await users.findOne({ email });
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

// Helper function to create user
export async function createUser({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) {
  try {
    const client = await clientPromise;
    const users = client.db().collection("users");

    const hashedPassword = await hashPassword(password);

    const result = await users.insertOne({
      email,
      name,
      password: hashedPassword,
      image: null,
      emailVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: result.insertedId.toString(),
      email,
      name,
      image: null,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
