/**
 * Format form errors for display
 * Handles strings, Zod issues, and Standard Schema issues
 */
export function getFieldError(error: unknown): string | null {
    if (!error) return null

    // If it's an array (field.state.meta.errors)
    if (Array.isArray(error)) {
        if (error.length === 0) return null
        return error.map(err => {
            if (typeof err === 'string') return err
            if (err && typeof err === 'object' && 'message' in err) return (err as any).message
            return String(err)
        }).join(', ')
    }

    // Legacy/fallback checks
    if (typeof error === 'string') return error
    if (typeof error === 'object' && error !== null) {
        if ('message' in error) return (error as any).message
    }

    return String(error)
}
