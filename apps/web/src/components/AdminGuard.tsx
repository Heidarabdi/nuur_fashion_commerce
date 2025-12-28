import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { authClient } from '../lib/auth-client'
import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
    children: React.ReactNode
}

/**
 * AdminGuard component protects admin routes
 * Redirects non-admin users to the home page
 */
export function AdminGuard({ children }: AdminGuardProps) {
    const navigate = useNavigate()
    const { data: session, isPending } = authClient.useSession()

    useEffect(() => {
        if (!isPending) {
            if (!session?.user) {
                // Not logged in - redirect to login
                navigate({ to: '/auth/login' })
            } else if ((session.user as any).role !== 'admin') {
                // Logged in but not admin - redirect to home
                navigate({ to: '/' })
            }
        }
    }, [session, isPending, navigate])

    // Show loading while checking auth
    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // Not authenticated or not admin
    if (!session?.user || (session.user as any).role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    // User is admin - render children
    return <>{children}</>
}
