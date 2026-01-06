import { useState, useRef } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_URL = typeof window !== 'undefined'
    ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3002'
        : 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev')
    : 'https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev';

function useUploadAvatar() {
    return useMutation({
        mutationFn: async (file: File): Promise<{ key: string; url: string }> => {
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

interface AvatarUploaderProps {
    currentImage?: string | null;
    onImageChange?: (url: string) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
};

export function AvatarUploader({
    currentImage,
    onImageChange,
    size = 'lg',
    className = ''
}: AvatarUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadAvatar = useUploadAvatar();

    const displayImage = previewUrl || currentImage;

    const handleClick = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        setIsUploading(true);
        try {
            const result = await uploadAvatar.mutateAsync(file);
            setPreviewUrl(result.url);
            onImageChange?.(result.url);
            toast.success('Avatar updated');
        } catch (error) {
            // Revert preview on error
            setPreviewUrl(null);
            toast.error('Failed to upload avatar', {
                description: (error as Error).message
            });
        } finally {
            setIsUploading(false);
            URL.revokeObjectURL(objectUrl);
        }

        // Reset input
        e.target.value = '';
    };

    return (
        <div
            onClick={handleClick}
            className={`
                relative ${sizeClasses[size]} rounded-full cursor-pointer
                group overflow-hidden
                ${className}
            `}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Avatar Image or Placeholder */}
            {displayImage ? (
                <img
                    src={displayImage}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center rounded-full">
                    <User className="w-1/2 h-1/2 text-muted-foreground" />
                </div>
            )}

            {/* Overlay */}
            <div className={`
                absolute inset-0 bg-black/50 rounded-full
                flex items-center justify-center
                transition-opacity duration-200
                ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `}>
                {isUploading ? (
                    <Loader2 className="w-1/3 h-1/3 text-white animate-spin" />
                ) : (
                    <Camera className="w-1/3 h-1/3 text-white" />
                )}
            </div>
        </div>
    );
}
