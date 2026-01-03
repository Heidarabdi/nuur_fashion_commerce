import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/orders')({
    component: OrdersLayout,
})

// Layout route - renders child routes via Outlet
// The orders list is in orders/index.tsx
function OrdersLayout() {
    return <Outlet />
}
