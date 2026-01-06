# Nuur Fashion Backend API

Complete API server for Nuur Fashion e-commerce platform, built with Hono and deployed on Cloudflare Workers.

---

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Local development
bun run dev              # http://localhost:3002

# Database
bunx drizzle-kit generate  # Generate migrations
bunx drizzle-kit push      # Apply migrations

# Deploy to Cloudflare
bun run deploy
```

---

## 📁 Complete Project Structure

```
apps/backend/
├── src/
│   ├── index.ts                    # Server entry point
│   ├── app.ts                      # Hono app with middleware
│   │
│   ├── config/
│   │   ├── index.ts                # Config exports
│   │   └── env.ts                  # Zod-validated environment
│   │
│   ├── db/
│   │   ├── index.ts                # Drizzle client (lazy init)
│   │   ├── schema/                 # 18 table definitions
│   │   └── migrations/             # SQL migrations
│   │
│   ├── routes/                     # 11 route files
│   │   ├── index.ts                # Route aggregator
│   │   ├── products.routes.ts
│   │   ├── categories.routes.ts
│   │   ├── brands.routes.ts
│   │   ├── carts.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── reviews.routes.ts
│   │   ├── wishlists.routes.ts
│   │   ├── addresses.routes.ts
│   │   ├── users.routes.ts
│   │   ├── upload.routes.ts
│   │   └── admin/                  # Admin-only routes
│   │
│   ├── controllers/                # 10 controllers
│   │   ├── products.controller.ts
│   │   ├── categories.controller.ts
│   │   ├── brands.controller.ts
│   │   ├── carts.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── reviews.controller.ts
│   │   ├── wishlists.controller.ts
│   │   ├── addresses.controller.ts
│   │   ├── users.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── services/                   # 11 services
│   │   ├── products.service.ts
│   │   ├── categories.service.ts
│   │   ├── brands.service.ts
│   │   ├── carts.service.ts
│   │   ├── orders.service.ts
│   │   ├── reviews.service.ts
│   │   ├── wishlists.service.ts
│   │   ├── addresses.service.ts
│   │   ├── users.service.ts
│   │   ├── admin.service.ts
│   │   └── external/
│   │       ├── email.service.ts    # Resend emails
│   │       └── r2.service.ts       # Cloudflare R2
│   │
│   ├── middleware/
│   │   ├── index.ts
│   │   ├── auth.middleware.ts      # Session validation
│   │   ├── admin.middleware.ts     # Admin role check
│   │   ├── error.middleware.ts     # Global error handler
│   │   └── logger.middleware.ts    # Request logging
│   │
│   ├── lib/
│   │   └── auth.ts                 # Better Auth config
│   │
│   └── utils/
│       └── helpers
│
├── wrangler.jsonc                  # Cloudflare config
├── .dev.vars.example               # Example env vars
└── drizzle.config.ts               # Drizzle config
```

---

## 🗄️ Database Schema (18 tables)

### Core Tables
| Table | Description |
|-------|-------------|
| `users` | User accounts (Better Auth) |
| `sessions` | Auth sessions |
| `accounts` | OAuth accounts |
| `verifications` | Email verification tokens |

### Products
| Table | Description |
|-------|-------------|
| `products` | Product catalog |
| `product_images` | Product image URLs |
| `product_variants` | Size/color variants |
| `product_categories` | Many-to-many junction |
| `categories` | Product categories |
| `brands` | Product brands |

### Commerce
| Table | Description |
|-------|-------------|
| `carts` | Shopping carts |
| `cart_items` | Cart line items |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `wishlists` | User wishlists |
| `wishlist_items` | Wishlist items |
| `reviews` | Product reviews |
| `addresses` | User addresses |

---

## 📡 Complete API Reference

### Products `/api/products`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | - | List all products |
| GET | `/:id` | - | Get single product |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Categories `/api/categories`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | - | List categories |
| GET | `/:id` | - | Get category with products |
| POST | `/` | Admin | Create category |
| PUT | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Delete category |

### Brands `/api/brands`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | - | List brands |
| GET | `/:id` | - | Get brand with products |
| POST | `/` | Admin | Create brand |
| PUT | `/:id` | Admin | Update brand |
| DELETE | `/:id` | Admin | Delete brand |

### Cart `/api/carts`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | User | Get user's cart |
| POST | `/items` | User | Add item to cart |
| PUT | `/items/:id` | User | Update item quantity |
| DELETE | `/items/:id` | User | Remove item from cart |
| DELETE | `/` | User | Clear cart |

### Orders `/api/orders`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | User | List user's orders |
| GET | `/:id` | User | Get order details |
| POST | `/` | User | Create order from cart |
| PATCH | `/:id/status` | Admin | Update order status |

### Reviews `/api/reviews`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/product/:id` | - | Get product reviews |
| POST | `/` | User | Create review |
| DELETE | `/:id` | User | Delete own review |

### Wishlists `/api/wishlists`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | User | Get wishlist |
| POST | `/items` | User | Add to wishlist |
| DELETE | `/items/:id` | User | Remove from wishlist |

### Addresses `/api/addresses`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | User | List addresses |
| POST | `/` | User | Create address |
| PUT | `/:id` | User | Update address |
| DELETE | `/:id` | User | Delete address |

### Users `/api/users`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/me` | User | Get current user |
| PUT | `/me` | User | Update profile |

### Upload `/api/upload`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/image` | Admin | Upload image to R2 |
| DELETE | `/image/:key` | Admin | Delete image |

### Admin `/api/admin`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats` | Admin | Dashboard stats |
| GET | `/orders` | Admin | All orders |
| GET | `/users` | Admin | All users |

### Auth `/api/auth/*`
Handled by Better Auth - see [docs](https://www.better-auth.com/docs)

---

## 🔐 Middleware

### `auth.middleware.ts`
Validates session from Better Auth cookie. Attaches `user` to context.

### `admin.middleware.ts`
Checks `user.role === 'admin'`. Returns 403 if not admin.

### `error.middleware.ts`
Global error handler. Returns structured JSON errors.

### `logger.middleware.ts`
Logs request method, path, and response time.

---

## 🔧 Environment Variables

### Local Development (`.env`)
```env
PORT=3002
DATABASE_URL=postgresql://user:password@host:5432/nuur_fashion
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3002
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_EMAIL=noreply@yourdomain.com
```

### Cloudflare Secrets
```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_EMAIL
```

---

## 📤 External Services

### Resend (Email)
- Welcome emails
- Email verification
- Password reset
- Order confirmation

### Cloudflare R2 (Storage)
- Product images
- Max 5MB, JPEG/PNG/WebP/GIF
- 1 year cache headers

---

## 🚀 Deployment

### Live URL
```
https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev
```

### Deploy Commands
```bash
bunx wrangler login    # First time
bunx wrangler deploy   # Deploy
```

### R2 Bucket
```bash
npx wrangler r2 bucket create nuur-fashion-images
```
