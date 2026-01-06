import type { Context } from 'hono';

export interface Env {
    IMAGES: R2Bucket;
    R2_PUBLIC_URL: string; // e.g., https://images.nuur-fashion.com
}

export const r2Service = {
    async uploadImage(env: Env, file: File, folder = 'products') {
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${folder}/${timestamp}-${sanitizedName}`;

        await env.IMAGES.put(key, await file.arrayBuffer(), {
            httpMetadata: {
                contentType: file.type,
                cacheControl: 'public, max-age=31536000', // 1 year cache
            },
        });

        // Use env variable for the public URL
        const baseUrl = env.R2_PUBLIC_URL || '';
        return {
            key,
            url: baseUrl ? `${baseUrl}/${key}` : key,
        };
    },

    async deleteImage(env: Env, key: string) {
        await env.IMAGES.delete(key);
    },

    async getImage(env: Env, key: string) {
        return env.IMAGES.get(key);
    },
};
