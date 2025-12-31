# Nuur Fashion

Elevate your style. Shop effortlessly, anywhere.

## Overview

Nuur Fashion is a scalable, full-featured clothing e-commerce platform for web, mobile, and admin. The project emphasizes code reuse, performance, accessibility, and a great developer experience, built with modern technologies across the stack.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend (Web/Admin) | Vite, React, TanStack Router/Query/Table, Zustand, Framer Motion, shadcn/ui, Better Auth |
| Mobile | React Native with TanStack Query and Zustand for state management |
| Backend | Hono (Bun runtime), Drizzle ORM, Zod validation |
| Database | PostgreSQL via Drizzle ORM |
| Authentication | Better Auth |
| CDN & Hosting | Cloudflare Workers, Pages, Images |
| Payments | Stripe, PayPal |
| Media | Cloudinary, Cloudflare Images |
| Email | Resend, Postmark, SendGrid |
| API Documentation | OpenAPI auto-generated from TypeScript types (backend) |

## Features

### Customer portal
- Social and email login (Better Auth)
- Full product catalog with filters: gender, category, brand, price
- Product detail pages with image galleries, size charts, and reviews
- Smart search with autocomplete; wishlist & favorites
- Shopping cart with multi-step checkout (Stripe / PayPal)
- Order management and tracking; returns and refunds
- Responsive design optimized for mobile and desktop, with PWA support
- Notifications and promotions

### Admin dashboard (Integrated in web app)
- Role-based access control with TanStack Router
- Unified authentication with customer portal
- Analytics for sales, traffic, and user behavior
- Full product CRUD and inventory management
- Order processing and fulfillment tools
- User account and role management
- Promotions, discounts, and CMS features
- Review moderation and reporting
- Exportable reports and data analysis
- Seamless switching between admin and shop views

### Mobile app
- React Native app sharing business logic with web via TanStack Query & Zustand
- Push notifications for orders and promotions
- Offline caching support and deep links

## Project Structure

```
/
├── apps
│   ├── web            # Vite + React + TanStack (unified shop + admin UI)
│   │   ├── routes/
│   │   │   ├── _shop/      # Customer-facing routes
│   │   │   ├── _admin/     # Admin dashboard routes (role-protected)
│   │   │   └── _auth/      # Authentication routes
│   ├── mobile         # React Native (mobile client)
├── packages           # Shared packages across apps
│   ├── shared         # Shared components, hooks, types, utilities, API
├── backend
│   ├── controllers     # Hono handlers
│   ├── middleware      # Validation (Zod), auth, logging
│   ├── models          # Drizzle ORM schema and migrations
│   ├── routes          # API routes
│   ├── services        # Payments, emails, business logic
│   ├── utils           # Helpers
│   └── server.ts       # Hono Bun server entrypoint
├── public              # Static assets
├── config              # Env and deployment configs
├── docs                # Setup guides, API docs, design links
├── README.md
├── package.json
├── turbo.json          # Monorepo config
└── tsconfig.json
```

## TODO - Development Roadmap

### ✅ Recently Completed
- [x] **Forgot Password Flow** - Request reset via email, token-based password update
- [x] **Reset Password Page** - `/auth/reset-password` with token validation
- [x] **Email Verification** - Better Auth + Resend integration for transactional emails
- [x] **Form Validation Display** - Fixed `[object Object]` error display across all forms
- [x] **Cart Duplicate Handling** - Same product with different variants creates separate items
- [x] **Wishlist & Cart UX** - Toast notifications and optimistic updates
- [x] **Product Reviews** - Display and submission with star ratings

### 🐛 Bugs to Fix
- [ ] **Cart optimistic update** - UI should reflect accurate state during add/update operations
- [ ] **Session persistence** - Verify session stays active across page refreshes

### 🧪 Testing Required
- [ ] **Auth Flow E2E** - Signup → Email verification → Login → Forgot password → Reset
- [ ] **Admin Pages** - Test all admin dashboard functionality (stats, products, orders, customers)
- [ ] **Shop Page Filtering** - Verify category, brand, price, and gender filters work correctly
- [x] **Profile Page** - User profile display and update functionality
- [x] **Settings Page** - Address management (add, edit, delete)
- [ ] **Order Flow** - Test complete checkout flow with Stripe/PayPal
- [x] **Wishlist** - Add, remove, and add-to-cart-from-wishlist

### 🗄️ Database & Schema Review
- [x] **Auth Schema** - Better Auth uses `text` IDs, foreign keys aligned
- [x] **Users Table** - Columns: `id`, `name`, `email`, `image` configured correctly
- [x] **Cart Items** - `variantId` nullable handling for products without variants
- [x] **Modular Seed System** - Created separate seed files for users, products, categories, etc.
- [x] **Orders** - Proper cascade on user/address deletion configured
- [x] **Reviews** - Schema with rating, title, content, and user association

### ✨ Feature Improvements
- [ ] **Loading States** - All action buttons must show loading + disabled state
- [x] **Toast Notifications** - Using sonner toasts across the app
- [x] **Wishlist State** - Product page shows if item is already wishlisted (heart icon)
- [ ] **Error Boundaries** - Add error boundaries for graceful error handling
- [ ] **Image Optimization** - Implement lazy loading and proper sizing
- [ ] **Password Strength Indicator** - Visual feedback on password requirements

### 📱 Mobile App
- [ ] Setup React Native project structure
- [ ] Connect to shared API hooks
- [ ] Implement navigation and core screens

### 🚀 Production Readiness
- [ ] **Environment Variables** - Document all required env vars
- [ ] **Rate Limiting** - Add rate limiting to auth endpoints
- [ ] **Domain Verification** - Verify custom domain on Resend for production emails
- [ ] **Security Headers** - Configure CORS, CSP, and other security headers
- [ ] **Error Logging** - Integrate error tracking (Sentry or similar)

## Getting Started

Clone the repo and install dependencies:

```bash
bun install
```

Note about the shared package
Before running builds or starting apps that depend on the workspace `shared` package, produce the compiled output and type declarations for it. This ensures non-TypeScript-aware runtimes and build steps (for example Bun build or other CI steps) will resolve the package correctly.

Build the shared package:

```bash
cd packages/shared
bun run build
```

(There is also a root-level `prepare`/`build:shared` helper that runs the shared build automatically when running the main `build` script.)

**Set up environment**  
Add Better Auth, Stripe, Cloudflare, and database credentials to a .env file.

**Database setup:**

```bash
cd backend
bun drizzle generate
bun drizzle migrate dev
```

**Run backend server:**

```bash
bun run server.ts
```

**Run frontend:**

```bash
cd apps/web && bun run dev
```

**Run mobile app:**

```bash
cd apps/mobile && expo start
```

View API docs: Access /openapi in the backend for auto-generated documentation.

## Design System

- UI powered by shadcn/ui for consistent, accessible components
- Animations and transitions with Framer Motion for a polished UX
- Brand colors: deep blue/green primary, coral/magenta accents, light backgrounds
- Figma design and style guide linked in /docs/design.md

## Integrations

| Integration | Purpose |
| --- | --- |
| Better Auth | Authentication & user sessions |
| Stripe / PayPal | Payments & checkout |
| Cloudflare | Hosting, CDN, image delivery |
| Drizzle ORM | Database access & migrations |
| Zod | Validation and API schema |
| Cloudinary | Media management |
| Resend / Postmark / SendGrid | Transactional emails |
| Google / Cloudflare | Analytics |
| OpenAI / OpenRouter | AI-driven product recommendations (future) |

## Contributing

- Code is TypeScript-first, with linting (ESLint + Prettier)
- API requests and validation use Zod schemas
- Shared UI and business logic live in /shared for cross-platform reuse
- Work on feature branches with PRs; maintain test coverage
- CI/CD setup with Cloudflare Pages and GitHub Actions

## License

This project is licensed under the MIT License.

Nuur Fashion — Elevate your style. Shop effortlessly, anywhere.

This README provides a clear, practical base for development and collaboration, aligned with a modern, high-performance stack.
