# Nuur Fashion Web

Complete frontend for Nuur Fashion e-commerce platform, built with TanStack Start (React) and deployed on Cloudflare Workers.

---

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Local development
bun run dev              # http://localhost:3000

# Build & Deploy
bun run build            # Build for production
bunx wrangler deploy     # Deploy to Cloudflare
```

---

## 📁 Complete Project Structure

```
apps/web/
├── src/
│   ├── router.tsx                  # TanStack Router config
│   ├── routeTree.gen.ts            # Auto-generated routes
│   ├── styles.css                  # Global Tailwind styles
│   │
│   ├── components/
│   │   ├── Header.tsx              # Navigation, search, auth
│   │   ├── Footer.tsx              # Site footer
│   │   ├── ThemeToggle.tsx         # Dark/light mode
│   │   ├── StarRating.tsx          # Star rating display
│   │   ├── ReviewsSection.tsx      # Product reviews
│   │   ├── AdminGuard.tsx          # Admin route protection
│   │   ├── AdminShell.tsx          # Admin layout/sidebar
│   │   │
│   │   ├── shop/                   # Shop components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   └── FeaturedProductCard.tsx
│   │   │
│   │   ├── admin/                  # Admin components
│   │   │   └── DataTable.tsx       # Reusable data table
│   │   │
│   │   ├── ImageUploader.tsx       # Multi-image upload to R2
│   │   ├── AvatarUploader.tsx      # User avatar upload
│   │   │
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── skeleton.tsx
│   │       └── confirmation-modal.tsx
│   │
│   ├── routes/                     # File-based routing (22 pages)
│   │   ├── __root.tsx              # Root layout
│   │   │
│   │   │   # Public Pages
│   │   ├── index.tsx               # Homepage
│   │   ├── shop.tsx                # Product listing
│   │   ├── product.$id.tsx         # Product detail
│   │   ├── category.$slug.tsx      # Category page
│   │   ├── collections.tsx         # Collections
│   │   ├── new-arrivals.tsx        # New products
│   │   ├── sale.tsx                # Sale items
│   │   ├── about.tsx               # About us
│   │   ├── contact.tsx             # Contact form
│   │   │
│   │   │   # Policy Pages
│   │   ├── shipping.tsx            # Shipping info
│   │   ├── returns.tsx             # Return policy
│   │   ├── privacy.tsx             # Privacy policy
│   │   ├── terms.tsx               # Terms of service
│   │   │
│   │   │   # User Pages (Auth Required)
│   │   ├── cart.tsx                # Shopping cart
│   │   ├── checkout.tsx            # Checkout flow
│   │   ├── orders.tsx              # Order history
│   │   ├── orders.$id.tsx          # Order detail
│   │   ├── profile.tsx             # User profile
│   │   ├── settings.tsx            # Account settings
│   │   ├── wishlist.tsx            # Wishlist
│   │   │
│   │   │   # Auth Pages
│   │   ├── auth/
│   │   │   ├── login.tsx           # Sign in
│   │   │   ├── signup.tsx          # Create account
│   │   │   ├── forgot-password.tsx # Password recovery
│   │   │   └── reset-password.tsx  # Reset password
│   │   │
│   │   │   # Admin Pages (Admin Role Required)
│   │   └── admin/
│   │       ├── index.tsx           # Dashboard/analytics
│   │       ├── products/
│   │       │   ├── index.tsx       # Product list
│   │       │   ├── new.tsx         # Create product
│   │       │   └── $id.tsx         # Edit product
│   │       ├── categories.tsx      # Category management
│   │       ├── brands.tsx          # Brand management
│   │       ├── orders/
│   │       │   ├── index.tsx       # Order list
│   │       │   └── $id.tsx         # Order detail
│   │       └── settings.tsx        # Admin settings
│   │
│   ├── lib/
│   │   └── auth-client.ts          # Better Auth client
│   │
│   └── data/
│       └── static-data.ts          # Static content
│
├── wrangler.jsonc                  # Cloudflare config
├── vite.config.ts                  # Vite + TanStack Start
├── tailwind.config.ts              # Tailwind config
└── tsconfig.json                   # TypeScript config
```

---

## 📱 Complete Page Reference

### Public Pages
| Route | File | Description |
|-------|------|-------------|
| `/` | `index.tsx` | Homepage with hero, featured products |
| `/shop` | `shop.tsx` | Product grid with filters |
| `/product/:id` | `product.$id.tsx` | Product details, variants, reviews |
| `/category/:slug` | `category.$slug.tsx` | Products by category |
| `/collections` | `collections.tsx` | Collection browsing |
| `/new-arrivals` | `new-arrivals.tsx` | Latest products |
| `/sale` | `sale.tsx` | Discounted products |
| `/about` | `about.tsx` | Company info |
| `/contact` | `contact.tsx` | Contact form |
| `/shipping` | `shipping.tsx` | Shipping policy |
| `/returns` | `returns.tsx` | Return policy |
| `/privacy` | `privacy.tsx` | Privacy policy |
| `/terms` | `terms.tsx` | Terms of service |

### Auth Pages
| Route | File | Description |
|-------|------|-------------|
| `/auth/login` | `auth/login.tsx` | Email/password sign in |
| `/auth/signup` | `auth/signup.tsx` | Account creation |
| `/auth/forgot-password` | `auth/forgot-password.tsx` | Request reset link |
| `/auth/reset-password` | `auth/reset-password.tsx` | Set new password |

### User Pages (Auth Required)
| Route | File | Description |
|-------|------|-------------|
| `/cart` | `cart.tsx` | Shopping cart management |
| `/checkout` | `checkout.tsx` | Address, payment, confirm |
| `/orders` | `orders.tsx` | Order history list |
| `/orders/:id` | `orders.$id.tsx` | Order details |
| `/profile` | `profile.tsx` | View/edit profile |
| `/settings` | `settings.tsx` | Account settings |
| `/wishlist` | `wishlist.tsx` | Saved items |

### Admin Pages (Admin Role Required)
| Route | File | Description |
|-------|------|-------------|
| `/admin` | `admin/index.tsx` | Dashboard with analytics |
| `/admin/products` | `admin/products/index.tsx` | Product list with actions |
| `/admin/products/new` | `admin/products/new.tsx` | Create product form |
| `/admin/products/:id` | `admin/products/$id.tsx` | Edit product |
| `/admin/categories` | `admin/categories.tsx` | CRUD categories |
| `/admin/brands` | `admin/brands.tsx` | CRUD brands |
| `/admin/orders` | `admin/orders/index.tsx` | All orders |
| `/admin/orders/:id` | `admin/orders/$id.tsx` | Order management |
| `/admin/settings` | `admin/settings.tsx` | Store settings |

---

## 🎨 Components

### Layout Components
| Component | Description |
|-----------|-------------|
| `Header.tsx` | Navigation, search, cart icon, user menu |
| `Footer.tsx` | Links, newsletter, social icons |
| `AdminShell.tsx` | Admin sidebar layout |
| `ThemeToggle.tsx` | Dark/light mode switch |

### Shop Components
| Component | Description |
|-----------|-------------|
| `ProductCard.tsx` | Product card with image, price |
| `ProductGrid.tsx` | Grid layout for products |
| `FilterSidebar.tsx` | Category, brand, price filters |
| `FeaturedProductCard.tsx` | Large featured product |

### UI Components (shadcn/ui)
| Component | Description |
|-----------|-------------|
| `button.tsx` | Button variants |
| `card.tsx` | Card container |
| `dialog.tsx` | Modal dialog |
| `dropdown-menu.tsx` | Dropdown menus |
| `input.tsx` | Form inputs |
| `label.tsx` | Form labels |
| `select.tsx` | Select dropdowns |
| `skeleton.tsx` | Loading skeletons |
| `confirmation-modal.tsx` | Confirm delete dialogs |

### Other Components
| Component | Description |
|-----------|-------------|
| `AdminGuard.tsx` | Protects admin routes |
| `ReviewsSection.tsx` | Product reviews display |
| `StarRating.tsx` | Star rating display |

---

## 🔗 API Integration

Uses `@nuur-fashion-commerce/api` package (Hono RPC + TanStack Query):

```tsx
// Fetch products
import { useProducts } from '@nuur-fashion-commerce/api';
const { data, isLoading } = useProducts();

// Cart operations
import { useCart, useAddToCart } from '@nuur-fashion-commerce/api';
const { data: cart } = useCart();
const addToCart = useAddToCart();
addToCart.mutate({ productId, quantity });
```

---

## 🔐 Authentication

Uses Better Auth client:

```tsx
import { authClient } from '~/lib/auth-client';

// Check session
const { data: session } = authClient.useSession();

// Sign in
await authClient.signIn.email({ email, password });

// Sign out
await authClient.signOut();
```

---

## 🔧 Environment Variables

### Local Development (`.env`)
```env
VITE_API_URL=http://localhost:3002
```

### Cloudflare Workers (wrangler.jsonc vars)
```jsonc
"vars": {
  "VITE_API_URL": "https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev"
}
```

---

## 🎨 Styling

- **CSS Framework**: Tailwind CSS 4.x
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: Dark/light mode with CSS variables

---

## 🚀 Deployment

### Live URL
```
https://nuur-fashion.hono-waitlist-template-cloudflare.workers.dev
```

### Deploy Commands
```bash
bun run build          # Build production bundle
bunx wrangler deploy   # Deploy to Cloudflare
```

### Key Config Files
- `wrangler.jsonc` - Cloudflare Workers config
- `vite.config.ts` - Vite + TanStack Start + Cloudflare plugin

---

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-start` | latest | Full-stack React framework |
| `@tanstack/react-router` | latest | Type-safe file routing |
| `@tanstack/react-query` | latest | Data fetching & caching |
| `@nuur-fashion-commerce/api` | workspace | Shared API hooks |
| `better-auth/react` | latest | Auth client |
| `tailwindcss` | 4.x | CSS framework |
| `lucide-react` | latest | Icons |
