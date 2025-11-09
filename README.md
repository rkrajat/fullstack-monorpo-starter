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

```bash
# Development
pnpm dev          # Start all services (frontend + backend)
pnpm dev:web      # Start frontend only
pnpm dev:api      # Start backend only

# Production
pnpm build        # Build all packages and apps
pnpm start        # Start production servers

# Code Quality
pnpm lint         # Lint all packages
pnpm typecheck    # Type check all TypeScript code
pnpm clean        # Clean build artifacts
```

## 📦 Adding Dependencies

```bash
# Workspace root
pnpm add -w <package-name>

# Specific app/package
pnpm add <package-name> --filter=web
pnpm add <package-name> --filter=api

# Dev dependencies
pnpm add -D <package-name> --filter=web
```

## 📚 Next Steps

Once your development servers are running, check out the detailed documentation:

- **Frontend Development**: See [docs/FRONTEND.md](docs/FRONTEND.md) for:
  - Creating pages and components
  - Adding UI components with shadcn/ui
  - Data fetching with TanStack Query
  - Styling with Tailwind CSS
  - Deployment to Vercel

- **Backend Development**: See [docs/BACKEND.md](docs/BACKEND.md) for:
  - Creating API routes and models
  - Database setup with MongoDB
  - Authentication with JWT
  - Validation with Zod
  - Deployment options

## 📝 Code Style

The project enforces:
- TypeScript strict mode
- ESLint rules (no `any`, no default exports except Next.js pages)
- Named exports and arrow functions only
- Consistent import ordering

Run `pnpm lint` and `pnpm typecheck` to validate your code.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm typecheck`
4. Commit with conventional commits
5. Create a pull request

## 📄 License

MIT
