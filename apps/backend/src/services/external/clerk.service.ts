import { createClerkClient, verifyToken } from "@clerk/backend";
import { env } from "../../config";

export const clerkClient = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
});

export const clerkService = {
    async verifyToken(token: string) {
        try {
            const payload = await verifyToken(token, {
                secretKey: env.CLERK_SECRET_KEY
            });
            return payload;
        } catch (error) {
            console.error("Clerk Token Verification Failed", error);
            return null;
        }
    },

    async getUser(userId: string) {
        return await clerkClient.users.getUser(userId);
    },
};
