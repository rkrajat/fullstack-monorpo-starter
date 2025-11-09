# Fullstack Monorepo Template

A production-ready monorepo template featuring Next.js, Express.js, and MongoDB with TypeScript, Turborepo, and pnpm workspaces.

## 📖 Documentation

- **[Frontend Documentation](docs/FRONTEND.md)** - Next.js, React, shadcn/ui, and TanStack Query
- **[Backend Documentation](docs/BACKEND.md)** - Express.js, MongoDB, authentication, and API design

## 🚀 Features

### Frontend (Next.js)
- **Next.js 16** with App Router
- **React 19** with TypeScript
- **TanStack Query** for data fetching
- **Tailwind CSS** + **shadcn/ui** for styling
- **ESLint** + **TypeScript** strict mode

### Backend (Express.js)
- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- **Winston** logger with structured logging
- **Zod** schema validation
- **JWT** authentication ready
- **Rate limiting** and security middleware
- Comprehensive error handling

### Monorepo Infrastructure
- **Turborepo** for fast builds and caching
- **pnpm** workspaces for efficient dependency management
- Shared TypeScript and ESLint configurations
- Shared types package for frontend/backend consistency

## 📋 Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **MongoDB** (local or Atlas)

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

#### Backend (apps/api/.env)
```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` and configure:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string (min 32 characters)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)

#### Frontend (apps/web/.env.local)
```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local` and configure:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:4000)

### 3. Start Development Servers

Run all services:
```bash
pnpm dev
```

Or run individually:
```bash
# Frontend only
pnpm dev:web

# Backend only
pnpm dev:api
```

The services will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **API Health**: http://localhost:4000/health

## 📁 Project Structure

```
.
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/                # App Router pages and layouts
│   │   ├── components/         # React components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   └── public/            # Static assets
│   └── api/                    # Express.js backend application
│       └── src/
│           ├── config/         # Configuration (env validation)
│           ├── middleware/     # Express middleware
│           ├── models/         # Mongoose models
│           ├── routes/         # API routes
│           ├── services/       # Business logic
│           ├── utils/          # Utility functions
│           └── validators/     # Zod schemas
├── packages/
│   ├── types/                  # Shared TypeScript types
│   ├── eslint-config/          # Shared ESLint configuration
│   └── typescript-config/      # Shared TypeScript configuration
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── package.json                # Root package.json
```

## 🔧 Available Scripts

### Root Level

```bash
pnpm dev          # Start all services in development mode
pnpm dev:web      # Start frontend only
pnpm dev:api      # Start backend only
pnpm build        # Build all packages and apps
pnpm lint         # Lint all packages and apps
pnpm typecheck    # Type check all TypeScript code
pnpm clean        # Clean build artifacts
```

### Frontend (apps/web)

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Lint frontend code
pnpm typecheck    # Type check frontend
```

### Backend (apps/api)

```bash
pnpm dev          # Start Express dev server with hot reload
pnpm build        # Build TypeScript to JavaScript
pnpm start        # Start production server
pnpm lint         # Lint backend code
pnpm typecheck    # Type check backend
```

## 📦 Adding Dependencies

### Workspace Root
```bash
pnpm add -w <package-name>
```

### Specific App/Package
```bash
pnpm add <package-name> --filter=web
pnpm add <package-name> --filter=api
```

### Dev Dependencies
```bash
pnpm add -D <package-name> --filter=web
```

## 🎨 Adding UI Components

This template uses shadcn/ui. To add components:

```bash
cd apps/web
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## 🗄️ Database Models

Create Mongoose models in `apps/api/src/models/`:

```typescript
// apps/api/src/models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
```

## 🛣️ API Routes

Create routes in `apps/api/src/routes/`:

```typescript
// apps/api/src/routes/users.ts
import { Router } from 'express';
import { sendSuccess } from '../utils/response';

export const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
  // Your logic here
  sendSuccess(res, { users: [] });
});
```

Register in `apps/api/src/index.ts`:
```typescript
import { usersRouter } from './routes/users';
app.use('/api/users', usersRouter);
```

## 🔐 Authentication

The template includes JWT setup. To implement authentication:

1. Create auth routes in `apps/api/src/routes/auth.ts`
2. Use the JWT utilities from `jsonwebtoken`
3. Add auth middleware in `apps/api/src/middleware/auth.ts`
4. Protect routes by applying the middleware

Example middleware structure exists in the template.

## ✅ Type Safety

Share types between frontend and backend using the `@fullstack-monorepo/types` package:

```typescript
// packages/types/src/user.ts
export type User = {
  id: string;
  email: string;
  name: string;
};

// packages/types/src/index.ts
export type { User } from './user';
```

Use in frontend:
```typescript
import type { User } from '@fullstack-monorepo/types';
```

Use in backend:
```typescript
import type { User } from '@fullstack-monorepo/types';
```

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set root directory to `apps/web`
3. Add environment variables
4. Deploy

### Backend (Render/Railway/Fly.io)
1. Create a new web service
2. Set root directory to `apps/api`
3. Build command: `pnpm build --filter=api`
4. Start command: `pnpm start --filter=api`
5. Add environment variables
6. Deploy

### Database (MongoDB Atlas)
1. Create a cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in backend environment

## 🧪 Testing

Add your testing setup:
- Jest for unit tests
- Playwright for E2E tests
- React Testing Library for component tests

## 📝 Code Style

The project enforces:
- **TypeScript strict mode**
- **ESLint** rules (no `any`, no default exports except Next.js pages)
- **Prettier** for code formatting
- Named exports only
- Arrow functions only

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm typecheck`
4. Commit with conventional commits
5. Create a pull request

## 📄 License

MIT

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Documentation](https://pnpm.io/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [MongoDB Documentation](https://docs.mongodb.com/)
