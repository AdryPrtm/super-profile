import { nextCookies } from 'better-auth/next-js';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@super-profile-dry/db";

export const auth = betterAuth<BetterAuthOptions>({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	trustedOrigins: process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : [],
	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
	},
	session: { expiresIn: 8 * 60 * 60 },
  plugins: [nextCookies()]
});
