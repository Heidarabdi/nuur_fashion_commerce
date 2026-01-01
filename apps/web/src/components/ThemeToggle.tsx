import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggleTheme = () => {
        const newIsDark = !isDark
        setIsDark(newIsDark)

        if (newIsDark) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )
}
