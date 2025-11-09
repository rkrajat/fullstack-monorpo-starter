# Frontend Documentation (Next.js)

This guide covers the frontend application built with Next.js, React, and TypeScript.

## Features

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **ESLint** + **TypeScript** strict mode
- **Type-safe** API integration

## Project Structure

```
apps/web/
├── app/                    # App Router pages and layouts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── ...                # Other pages/routes
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
```

## Environment Setup

### Environment Variables (apps/web/.env.local)

```bash
cp apps/web/.env.example apps/web/.env.local
```

Configure the following variable:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Important:**
- Use `NEXT_PUBLIC_` prefix for variables accessible in the browser
- Update `NEXT_PUBLIC_API_URL` to point to your backend API

## Running the Frontend

### Development Mode

```bash
# From root directory
pnpm dev:web

# Or from apps/web
cd apps/web
pnpm dev
```

The application will start at http://localhost:3000 with hot reload enabled.

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Other Commands

```bash
pnpm lint         # Lint frontend code
pnpm typecheck    # Type check frontend
```

## Adding UI Components

This template uses **shadcn/ui** for components. Always use shadcn/ui components before creating custom ones.

### Installing Components

```bash
cd apps/web
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form
npx shadcn@latest add input
```

### Using Components

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MyPage() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

### Available Components

Browse all available components at [shadcn/ui](https://ui.shadcn.com/docs/components).

## Creating Pages

Next.js uses file-based routing with the App Router.

### Basic Page

```typescript
// apps/web/app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our application</p>
    </div>
  );
}
```

### Page with Metadata

```typescript
// apps/web/app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our application',
};

export default function AboutPage() {
  return <div>About Us</div>;
}
```

### Dynamic Routes

```typescript
// apps/web/app/users/[id]/page.tsx
type Props = {
  params: { id: string };
};

export default function UserPage({ params }: Props) {
  return <div>User ID: {params.id}</div>;
}
```

## Data Fetching with TanStack Query

Use TanStack Query for all API data fetching. Create custom hooks for reusable queries.

### Creating Query Hooks

```typescript
// apps/web/hooks/use-users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ky from 'ky';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id: string;
  name: string;
  email: string;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await ky.get(`${apiUrl}/api/users`).json<User[]>();
      return response;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      return await ky.post(`${apiUrl}/api/users`, { json: data }).json<User>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

### Using Query Hooks

```typescript
// apps/web/app/users/page.tsx
'use client';

import { useUsers } from '@/hooks/use-users';

export default function UsersPage() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Best Practices

- Create custom hooks for all API operations
- Use proper error handling and loading states
- Implement optimistic updates for mutations
- Leverage query invalidation for data consistency
- Use suspense boundaries for better UX

## Styling

### Tailwind CSS

Use Tailwind utility classes for styling:

```typescript
<div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
  <h1 className="text-2xl font-bold text-gray-800">Hello World</h1>
</div>
```

### CSS Variables

The project uses CSS variables for theming:

```typescript
// Defined in app/globals.css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  // ...
}
```

### Dark Mode

shadcn/ui components support dark mode out of the box:

```typescript
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">This adapts to theme</p>
</div>
```

## Creating Components

### Component Structure

```typescript
// apps/web/components/user-card/UserCard.tsx
type UserCardProps = {
  name: string;
  email: string;
  onEdit: () => void;
};

export const UserCard = ({ name, email, onEdit }: UserCardProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold">{name}</h3>
      <p className="text-sm text-gray-600">{email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};
```

### Component Index File

```typescript
// apps/web/components/user-card/index.ts
export { UserCard } from './UserCard';
export type { UserCardProps } from './UserCard';
```

### Best Practices

- Use functional components with hooks only
- Define prop types with TypeScript
- Use named exports (no default exports)
- Use arrow functions exclusively
- Keep components focused and small
- Extract reusable logic into custom hooks

## Custom Hooks

Create reusable hooks for shared logic:

```typescript
// apps/web/hooks/use-local-storage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
```

## Type Safety

### Shared Types

Use the `@fullstack-monorepo/types` package for shared types:

```typescript
// In frontend
import type { User } from '@fullstack-monorepo/types';

const user: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
};
```

### Type Imports

Use `type` keyword for type-only imports:

```typescript
import type { ReactNode } from 'react';
import type { User } from '@fullstack-monorepo/types';
```

## Adding Dependencies

```bash
# Add to frontend
pnpm add <package-name> --filter=web

# Add dev dependency
pnpm add -D <package-name> --filter=web
```

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Sign in to [Vercel](https://vercel.com)
   - Import your GitHub repository

2. **Configure Project**
   - Root directory: `apps/web`
   - Framework preset: Next.js
   - Build command: `pnpm build --filter=web`
   - Install command: `pnpm install`

3. **Environment Variables**
   - Add `NEXT_PUBLIC_API_URL` with your production API URL

4. **Deploy**
   - Vercel will automatically deploy on every push to main

### Alternative Platforms

The same deployment process works for:
- **Netlify**
- **Railway**
- **AWS Amplify**

## Client vs Server Components

### Server Components (Default)

```typescript
// No 'use client' directive = Server Component
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}
```

### Client Components

Use `'use client'` directive when you need:
- State management (useState, useReducer)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)
- React hooks

```typescript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Performance Optimization

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority
/>
```

### Code Splitting

Next.js automatically code-splits by route. For dynamic imports:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});
```

### Caching

TanStack Query provides built-in caching:

```typescript
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

## Troubleshooting

### Environment Variables Not Working

- Ensure variables are prefixed with `NEXT_PUBLIC_`
- Restart the dev server after adding new variables
- Check `.env.local` is in `.gitignore`

### Build Errors

```bash
# Clean Next.js cache
rm -rf .next

# Rebuild
pnpm build
```

### Type Errors

```bash
# Run type check
pnpm typecheck

# Check specific file
pnpm tsc --noEmit apps/web/app/page.tsx
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
