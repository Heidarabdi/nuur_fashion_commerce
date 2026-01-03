import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/products')({
    component: ProductsLayout,
})

// Layout route - renders child routes via Outlet
// The products list is in products/index.tsx
function ProductsLayout() {
    return <Outlet />
}
