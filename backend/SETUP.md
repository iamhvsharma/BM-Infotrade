# Backend Setup Guide

## Quick Fix for "Tons of Errors"

The main issues are likely:

1. Missing dependencies (already installed)
2. Missing `.env` file
3. Missing Prisma client generation
4. Missing database setup

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
pnpm install
```

### 2. Create Environment File

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/formcraft_db"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
```

### 3. Database Setup

#### Option A: Using PostgreSQL (Recommended)

1. Install PostgreSQL on your system
2. Create a database named `formcraft_db`
3. Update the `DATABASE_URL` in `.env` with your credentials

#### Option B: Using SQLite (For Development)

If you don't have PostgreSQL, you can use SQLite for development:

1. Update `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Update `.env`:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Generate Prisma Client

```bash
pnpm run db:generate
```

### 5. Push Database Schema

```bash
pnpm run db:push
```

### 6. Start the Server

```bash
pnpm run dev
```

## Common Issues and Solutions

### Issue 1: "Cannot find module" errors

**Solution**: Run `pnpm install` in the backend directory

### Issue 2: "Prisma client not generated"

**Solution**: Run `pnpm run db:generate`

### Issue 3: "Database connection failed"

**Solution**:

- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Create the database if it doesn't exist

### Issue 4: "JWT_SECRET not defined"

**Solution**: Add `JWT_SECRET` to your `.env` file

### Issue 5: TypeScript compilation errors

**Solution**: Run `pnpm run type-check` to see specific errors

## Testing the Setup

1. Start the server: `pnpm run dev`
2. Test the health endpoint: `http://localhost:3000/health`
3. You should see: `{"status":"OK","timestamp":"...","environment":"development"}`

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run db:generate` - Generate Prisma client
- `pnpm run db:push` - Push schema to database
- `pnpm run db:studio` - Open Prisma Studio
- `pnpm run type-check` - Check TypeScript types
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier

## API Endpoints

Once running, you can test these endpoints:

- `GET /health` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/forms` - Get user's forms (requires auth)
- `POST /api/forms` - Create new form (requires auth)

## Next Steps

1. Set up your database (PostgreSQL recommended)
2. Update the `DATABASE_URL` in `.env`
3. Run the setup commands above
4. Test the health endpoint
5. Start building your frontend integration!

## Troubleshooting

If you still get errors after following this guide:

1. Check the console output for specific error messages
2. Ensure all environment variables are set in `.env`
3. Verify database connection
4. Make sure all dependencies are installed
5. Try deleting `node_modules` and running `pnpm install` again
