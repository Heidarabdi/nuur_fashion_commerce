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

## Known Issues & Fixes Needed

### 🔧 Database & Auth
- [ ] **User role enum migration** - Role column needs proper enum migration (user_role: 'user' | 'admin')
- [ ] **Admin seed data** - Need to create admin user for testing
- [ ] **Session refresh** - Verify sessions persist across page refreshes

### 🎨 UI/UX Fixes
- [ ] **Cart optimistic updates** - UI should reflect accurate state during add/update
- [ ] **Loading states** - Add loading spinners to all action buttons
- [ ] **Error boundaries** - Add React error boundaries for graceful error handling
- [ ] **Dark mode consistency** - Review all pages for proper dark mode styling

### � Missing/Incomplete Pages
- [ ] **Admin Dashboard** - Fix API errors preventing stats from loading
- [ ] **Order Checkout** - Complete Stripe/PayPal integration testing
- [ ] **Product variants** - Size/color selection not fully implemented
- [ ] **Search results page** - Needs styling improvements

### 🚀 Production Readiness
- [ ] **Environment variables** - Document all required env vars in `.env.example`
- [ ] **Rate limiting** - Add rate limiting to auth endpoints
- [ ] **Domain verification** - Verify Resend domain for production emails
- [ ] **Security headers** - Configure CORS, CSP headers
- [ ] **Error logging** - Integrate Sentry or similar

### 📱 Mobile App
- [ ] Setup React Native project structure
- [ ] Connect to shared API hooks

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
