import { Hono } from 'hono';
import { r2Service, type Env } from '../services/external/r2.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const uploadRoutes = new Hono<{ Bindings: Env }>();

// POST /api/upload/image - Upload single image (admin only)
uploadRoutes.post('/image', authMiddleware, adminMiddleware, async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body['file'] as File;

        if (!file) {
            return c.json({ error: 'No file provided' }, 400);
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return c.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, 400);
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return c.json({ error: 'File too large. Maximum size: 5MB' }, 400);
        }

        const result = await r2Service.uploadImage(c.env, file);
        return c.json(result);
    } catch (error) {
        console.error('Upload error:', error);
        return c.json({ error: 'Failed to upload image' }, 500);
    }
});

// POST /api/upload/images - Upload multiple images (admin only)
uploadRoutes.post('/images', authMiddleware, adminMiddleware, async (c) => {
    try {
        const body = await c.req.parseBody({ all: true });

        // Handle both array and single file cases
        let files: File[] = [];
        const filesData = body['files'];

        if (Array.isArray(filesData)) {
            files = filesData.filter((f): f is File => f instanceof File);
        } else if (filesData instanceof File) {
            files = [filesData];
        }

        if (files.length === 0) {
            return c.json({ error: 'No files provided' }, 400);
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const maxSize = 5 * 1024 * 1024;
        const results: Array<{ key: string; url: string }> = [];
        const errors: Array<{ name: string; error: string }> = [];

        for (const file of files) {
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                errors.push({ name: file.name, error: 'Invalid file type' });
                continue;
            }

            // Validate file size
            if (file.size > maxSize) {
                errors.push({ name: file.name, error: 'File too large (max 5MB)' });
                continue;
            }

            try {
                const result = await r2Service.uploadImage(c.env, file);
                results.push(result);
            } catch (err: any) {
                errors.push({ name: file.name, error: 'Upload failed' });
            }
        }

        return c.json({ uploaded: results, errors });
    } catch (error: any) {
        console.error('Multiple upload error:', error?.message || error);
        return c.json({ error: 'Failed to upload images' }, 500);
    }
});

// POST /api/upload/avatar - Upload user avatar (authenticated users)
uploadRoutes.post('/avatar', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const body = await c.req.parseBody();
        const file = body['file'] as File;

        if (!file) {
            return c.json({ error: 'No file provided' }, 400);
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return c.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP' }, 400);
        }

        // Validate file size (max 2MB for avatars)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return c.json({ error: 'File too large. Maximum size: 2MB' }, 400);
        }

        // Upload to avatars folder
        const result = await r2Service.uploadImage(c.env, file, 'avatars');

        // Update user's image in database
        await db.update(users)
            .set({ image: result.url })
            .where(eq(users.id, user.id));

        return c.json(result);
    } catch (error) {
        console.error('Avatar upload error:', error);
        return c.json({ error: 'Failed to upload avatar' }, 500);
    }
});

// DELETE /api/upload/image/:key - Delete image (admin only)
uploadRoutes.delete('/image/:key', authMiddleware, adminMiddleware, async (c) => {
    try {
        const key = c.req.param('key');
        await r2Service.deleteImage(c.env, key);
        return c.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return c.json({ error: 'Failed to delete image' }, 500);
    }
});

export default uploadRoutes;
