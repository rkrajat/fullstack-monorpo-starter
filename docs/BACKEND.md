# Backend Documentation (Express.js API)

This guide covers the backend application built with Express.js, MongoDB, and TypeScript.

## Features

- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- **Winston** logger with structured logging
- **Zod** schema validation
- **JWT** authentication ready
- **Rate limiting** and security middleware
- Comprehensive error handling

## Project Structure

```
apps/api/
└── src/
    ├── config/         # Configuration (env validation)
    ├── middleware/     # Express middleware
    ├── models/         # Mongoose models
    ├── routes/         # API routes
    ├── services/       # Business logic
    ├── utils/          # Utility functions
    └── validators/     # Zod schemas
```

## Environment Setup

### Environment Variables (apps/api/.env)

```bash
cp apps/api/.env.example apps/api/.env
```

Configure the following variables:

```bash
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/database
JWT_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000
```

**Important:**
- `MONGODB_URI` - Your MongoDB connection string (local or Atlas)
- `JWT_SECRET` - A secure random string (minimum 32 characters)
- `FRONTEND_URL` - Frontend URL for CORS configuration

## Running the Backend

### Development Mode

```bash
# From root directory
pnpm dev:api

# Or from apps/api
cd apps/api
pnpm dev
```

The server will start at http://localhost:4000 with hot reload enabled.

### Production Build

```bash
# Build TypeScript to JavaScript
pnpm build

# Start production server
pnpm start
```

### Other Commands

```bash
pnpm lint         # Lint backend code
pnpm typecheck    # Type check backend
```

## Database Models

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

### Best Practices

- Use TypeScript interfaces for model types
- Add indexes for frequently queried fields
- Use timestamps for createdAt/updatedAt
- Validate data at the schema level
- Keep models focused and modular

## API Routes

### Creating Routes

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

### Registering Routes

Register routes in `apps/api/src/index.ts`:

```typescript
import { usersRouter } from './routes/users';
app.use('/api/users', usersRouter);
```

### Response Utilities

Use the provided response utilities for consistent API responses:

```typescript
import { sendSuccess, sendError } from '../utils/response';

// Success response
sendSuccess(res, { data: result });

// Error response
sendError(res, 'Error message', 400);
```

## Validation with Zod

### Creating Validators

Create Zod schemas in `apps/api/src/validators/`:

```typescript
// apps/api/src/validators/user.validator.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
});
```

### Using Validators

Apply validation middleware to routes:

```typescript
import { validateBody } from '../middleware/validate';
import { createUserSchema } from '../validators/user.validator';

usersRouter.post('/', validateBody(createUserSchema), async (req, res) => {
  // req.body is now validated and typed
  const { email, name } = req.body;
  // Your logic here
});
```

## Authentication

The template includes JWT setup for authentication.

### Implementation Steps

1. **Create Auth Routes**
   - Create `apps/api/src/routes/auth.ts` for login/register endpoints

2. **JWT Utilities**
   - Use `jsonwebtoken` package for token generation/verification
   - Configure JWT_SECRET in environment variables

3. **Auth Middleware**
   - Create `apps/api/src/middleware/auth.ts` for protected routes
   - Verify JWT tokens and attach user to request

4. **Protect Routes**
   - Apply auth middleware to routes that require authentication

Example middleware structure:

```typescript
// apps/api/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Error Handling

The backend includes comprehensive error handling:

- Global error handler middleware
- Async error wrapper utilities
- Structured error responses
- Winston logger for error tracking

## Logging

Winston is configured for structured logging:

```typescript
import { logger } from './utils/logger';

logger.info('Info message');
logger.error('Error message', { error });
logger.warn('Warning message');
```

## Security

Built-in security features:

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **express-mongo-sanitize** - NoSQL injection protection
- **Environment validation** - Type-safe config

## Adding Dependencies

```bash
# Add to backend
pnpm add <package-name> --filter=api

# Add dev dependency
pnpm add -D <package-name> --filter=api
```

## Deployment

### Render/Railway/Fly.io

1. Create a new web service
2. Set root directory to `apps/api`
3. Build command: `pnpm build --filter=api`
4. Start command: `pnpm start --filter=api`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
6. Deploy

### MongoDB Atlas

1. Create a cluster on MongoDB Atlas
2. Whitelist your deployment IP or use 0.0.0.0/0 for all IPs
3. Create a database user
4. Get connection string
5. Update `MONGODB_URI` in backend environment

### Environment Variables

Ensure all required environment variables are set in your deployment platform:

- `PORT` (usually set automatically)
- `NODE_ENV=production`
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`

## API Health Check

The backend includes a health check endpoint:

```bash
GET http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Type Safety

Share types between frontend and backend using the `@fullstack-monorepo/types` package:

```typescript
// In backend
import type { User } from '@fullstack-monorepo/types';
```

See the main README for more information on shared types.

## Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running locally or Atlas connection string is correct
- Check network connectivity and firewall rules
- Ensure IP whitelist includes your deployment IP (for Atlas)

### Port Already in Use

```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>
```

### TypeScript Build Errors

```bash
# Clean and rebuild
pnpm clean
pnpm build
```

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Zod Documentation](https://zod.dev/)
- [Winston Logger](https://github.com/winstonjs/winston)
