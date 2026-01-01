import { createFileRoute, Link } from '@tanstack/react-router'
import { useCategories } from '@nuur-fashion-commerce/api'
import { ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/collections')({
    component: CollectionsPage,
})

function CollectionsPage() {
    const { data: categoriesData, isLoading } = useCategories()
    const categories = categoriesData || []

    if (isLoading) {
        return (
            <div className="min-h-screen pt-10">
                <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-10 bg-secondary rounded w-64 mb-8" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-4/5 bg-secondary rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-10">
            <div className="pt-14 pb-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="font-serif text-4xl font-bold mb-4">Collections</h1>
                    <p className="text-foreground/60 mb-12">Explore our curated collections</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.length > 0 ? (
                            categories.map((category: any) => (
                                <Link
                                    key={category.id}
                                    to="/shop"
                                    search={{ category: category.slug }}
                                    className="group block"
                                >
                                    <div className="relative aspect-4/5 bg-secondary rounded-xl overflow-hidden mb-4">
                                        {category.imageUrl ? (
                                            <img
                                                src={category.imageUrl}
                                                alt={category.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                                                <span className="font-serif text-4xl text-primary/50">
                                                    {category.name?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="font-serif text-xl font-bold text-white">{category.name}</h3>
                                            <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                                                Shop collection <ChevronRight className="w-4 h-4" />
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-foreground/60">No collections available yet.</p>
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                                >
                                    Browse all products <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
