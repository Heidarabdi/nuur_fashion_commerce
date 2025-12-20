import { createClerkClient } from "@clerk/backend";
import { env } from "../../config";

export const clerkClient = createClerkClient({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
});

export const clerkService = {
    async getUser(userId: string) {
        return await clerkClient.users.getUser(userId);
    },
};

