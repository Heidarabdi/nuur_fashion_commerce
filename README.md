# Nuur Fashion

Elevate your style. Shop effortlessly, anywhere.

## Overview

Nuur Fashion is a scalable, full-featured clothing e-commerce platform for web, mobile, and admin. Built with modern technologies emphasizing code reuse, performance, accessibility, and developer experience.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend (Web/Admin) | TanStack Start (Vite + React), TanStack Router/Query/Form, Tailwind CSS 4 |
| Mobile | React Native with TanStack Query |
| Backend | Hono, Drizzle ORM, Zod validation |
| Database | PostgreSQL |
| Authentication | Better Auth |
| Storage | Cloudflare R2 |
| Hosting | Cloudflare Workers |
| Email | Resend |

## Features

### Customer Portal
- Email/password authentication (Better Auth)
- Product catalog with filters: category, brand, price, search
- Product detail pages with image galleries and reviews
- Wishlist & favorites
- Shopping cart and checkout
- Order management and tracking
- Dark/light theme toggle
- Responsive design (mobile-first)

### Admin Dashboard
- Role-based access control
- Analytics overview (orders, revenue, customers)
- Full product CRUD with image uploads to R2
- Category and brand management
- Order management and status updates
- User management

## Project Structure

```
/
├── apps/
│   ├── web/              # TanStack Start frontend (shop + admin)
│   ├── backend/          # Hono API server
│   └── mobile/           # React Native (planned)
├── packages/
│   ├── api/              # Shared API client & hooks
│   └── shared/           # Shared schemas & types
├── turbo.json            # Turborepo config
└── package.json          # Root package.json
```

## 📱 Mobile App (Planned)

- [ ] Setup React Native project structure
- [ ] Connect to shared API hooks
- [ ] Push notifications for orders and promotions
- [ ] Offline caching support

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) runtime
- PostgreSQL database
- Cloudflare account (for deployment)

### Installation

```bash
# Clone and install
git clone <repo-url>
cd nuur-fashion-commerce
bun install
```

### Environment Setup

Create `.env` files in each app directory. See `.env.example` files for required variables.

**Backend (`apps/backend/.env`):**
```env
DATABASE_URL=postgresql://user:password@host:5432/nuur_fashion
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3002
FRONTEND_URL=http://localhost:3000
RESEND_API_KEY=re_xxxx
RESEND_EMAIL=noreply@yourdomain.com
```

**Frontend (`apps/web/.env`):**
```env
VITE_API_URL=http://localhost:3002
```

### Database Setup

```bash
cd apps/backend
bunx drizzle-kit generate   # Generate migrations
bunx drizzle-kit push       # Apply migrations
```

### Development

```bash
# Run backend (port 3002)
cd apps/backend && bun run dev

# Run frontend (port 3000)
cd apps/web && bun run dev
```

## Deployment

Both apps deploy to Cloudflare Workers:

```bash
# Deploy backend
cd apps/backend && bun run deploy

# Deploy frontend
cd apps/web && bun run build && bunx wrangler deploy
```

### Live URLs
- **Frontend:** https://nuur-fashion.hono-waitlist-template-cloudflare.workers.dev
- **Backend:** https://nuur-fashion-api.hono-waitlist-template-cloudflare.workers.dev

## Integrations

| Integration | Purpose |
| --- | --- |
| Better Auth | Authentication & sessions |
| Cloudflare R2 | Image storage |
| Cloudflare Workers | Hosting |
| Drizzle ORM | Database access |
| Zod | Validation |
| Resend | Transactional emails |

## Contributing

- TypeScript-first codebase with ESLint
- Work on feature branches with PRs
- Shared logic lives in `/packages` for cross-platform reuse

## License

This project is licensed under the MIT License.

---

**Nuur Fashion** — Elevate your style. Shop effortlessly, anywhere.
