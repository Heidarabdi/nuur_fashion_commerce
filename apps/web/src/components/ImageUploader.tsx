import { useState, useCallback, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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

function useUploadImages() {
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

interface ImageUploaderProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    className?: string;
}

export function ImageUploader({
    images,
    onImagesChange,
    maxImages = 10,
    className = ''
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadImages = useUploadImages();

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files);

        // Check max images limit
        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
        }

        const filesToUpload = fileArray.slice(0, remainingSlots);

        if (filesToUpload.length === 0) return;

        setIsUploading(true);
        try {
            const result = await uploadImages.mutateAsync(filesToUpload);

            if (result.uploaded.length > 0) {
                const newUrls = result.uploaded.map((r: { url: string }) => r.url);
                onImagesChange([...images, ...newUrls]);
                toast.success(`${result.uploaded.length} image(s) uploaded`);
            }

            if (result.errors.length > 0) {
                result.errors.forEach((err: { name: string; error: string }) => {
                    toast.error(`${err.name}: ${err.error}`);
                });
            }
        } catch (error) {
            toast.error('Failed to upload images', {
                description: (error as Error).message
            });
        } finally {
            setIsUploading(false);
        }
    }, [images, maxImages, onImagesChange, uploadImages]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const removeImage = (urlToRemove: string) => {
        onImagesChange(images.filter(url => url !== urlToRemove));
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Drop Zone */}
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-colors duration-200
                    ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                    ${isUploading ? 'pointer-events-none opacity-50' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="w-10 h-10 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                            Drop images here or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                            JPEG, PNG, WebP, GIF • Max 5MB each • Up to {maxImages} images
                        </p>
                    </div>
                )}
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div key={url} className="relative group aspect-square">
                            <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-border"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '';
                                    (e.target as HTMLImageElement).className = 'w-full h-full flex items-center justify-center bg-muted rounded-lg border border-border';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(url)}
                                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                                <X size={14} />
                            </button>
                            {index === 0 && (
                                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                                    Main
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Image count */}
            <p className="text-xs text-muted-foreground text-right">
                {images.length} / {maxImages} images
            </p>
        </div>
    );
}
