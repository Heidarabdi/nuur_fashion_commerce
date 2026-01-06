import { useMutation } from '@tanstack/react-query';

const API_URL = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3002'
        : 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev')
    : 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev';

interface UploadResult {
    key: string;
    url: string;
}

interface MultiUploadResult {
    uploaded: UploadResult[];
    errors: Array<{ name: string; error: string }>;
}

/**
 * Upload a single product image (admin only)
 */
export function useUploadImage() {
    return useMutation({
        mutationFn: async (file: File): Promise<UploadResult> => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/api/upload/image`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to upload image');
            }

            return response.json();
        },
    });
}

/**
 * Upload multiple product images (admin only)
 */
export function useUploadImages() {
    return useMutation({
        mutationFn: async (files: File[]): Promise<MultiUploadResult> => {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));

            const response = await fetch(`${API_URL}/api/upload/images`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to upload images');
            }

            return response.json();
        },
    });
}

/**
 * Upload user avatar (authenticated users)
 */
export function useUploadAvatar() {
    return useMutation({
        mutationFn: async (file: File): Promise<UploadResult> => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/api/upload/avatar`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to upload avatar');
            }

            return response.json();
        },
    });
}
