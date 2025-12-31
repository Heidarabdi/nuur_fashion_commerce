import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FilterSectionProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}

export function FilterSection({
    title,
    children,
    defaultOpen = true
}: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="border-b border-border pb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-2 font-semibold text-sm hover:text-accent transition-colors"
            >
                {title}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && <div className="mt-3">{children}</div>}
        </div>
    )
}
