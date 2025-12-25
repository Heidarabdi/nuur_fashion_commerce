import { createFileRoute } from '@tanstack/react-router'
import { AdminShell } from '../../components/AdminShell'

export const Route = createFileRoute('/admin/products')({
  component: ProductsPage,
})

function ProductsPage() {
  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl lg:text-4xl font-serif font-bold text-foreground">Products</h1>
          <button className="bg-accent text-accent-foreground px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-sm lg:text-base font-medium hover:bg-accent/90 transition-colors">
            Add Product
          </button>
        </div>

        <div className="bg-card p-4 lg:p-6 rounded-lg border border-border shadow-sm">
          <div className="overflow-x-auto -mx-4 lg:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Product Name</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">SKU</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Price</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Stock</th>
                    <th className="text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <ProductRow name="Silk Evening Gown" sku="SEG-001" price="$1,250" stock="45 units" badgeClass="bg-emerald-100 text-emerald-700" />
                  <ProductRow name="Tailored Blazer" sku="TB-002" price="$850" stock="32 units" badgeClass="bg-emerald-100 text-emerald-700" />
                  <ProductRow name="Designer Handbag" sku="DH-003" price="$2,100" stock="12 units" badgeClass="bg-amber-100 text-amber-700" />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

function ProductRow({ name, sku, price, stock, badgeClass }: { name: string; sku: string; price: string; stock: string; badgeClass: string }) {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">{name}</td>
      <td className="py-3 px-4 text-sm lg:text-base text-foreground whitespace-nowrap">{sku}</td>
      <td className="py-3 px-4 text-sm lg:text-base font-serif font-semibold text-foreground whitespace-nowrap">{price}</td>
      <td className="py-3 px-4 whitespace-nowrap">
        <span className={`${badgeClass} dark:bg-opacity-30 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium`}>{stock}</span>
      </td>
      <td className="py-3 px-4">
        <button className="text-accent hover:underline text-sm lg:text-base font-medium whitespace-nowrap">Edit</button>
      </td>
    </tr>
  )
}
