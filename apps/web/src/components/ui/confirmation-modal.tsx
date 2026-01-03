import { X, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
    isLoading?: boolean
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false
}: ConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isVisible) return null

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose()
        }
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleBackdropClick}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors disabled:opacity-50"
                >
                    <X size={20} />
                </button>

                <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center sm:text-left sm:items-start sm:flex-row gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${variant === 'danger' ? 'bg-destructive/10 text-destructive' :
                                variant === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-primary/10 text-primary'
                            }`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                                {title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full sm:w-1/2 px-4 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`w-full sm:w-1/2 px-4 py-3 rounded-lg font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${variant === 'danger' ? 'bg-destructive hover:bg-destructive/90' :
                                    variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                                        'bg-primary hover:bg-primary/90'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
