# FormCraft Backend API

A robust, type-safe Node.js backend API for the FormCraft no-code form builder application. Built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## 🚀 Features

- **Type-Safe API**: Full TypeScript support with Zod validation
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Form Management**: Complete CRUD operations for forms and form fields
- **Form Responses**: Collect, view, and export form submissions
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Validation**: Comprehensive input validation using Zod schemas
- **Error Handling**: Centralized error handling with custom error classes
- **Security**: Helmet, CORS, rate limiting, and input sanitization
- **Documentation**: Auto-generated API documentation

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

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
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # (Optional) Run migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Users

- `id`: Unique identifier
- `email`: User email (unique)
- `name`: User's full name
- `password`: Hashed password
- `role`: User role (USER/ADMIN)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Forms

- `id`: Unique identifier
- `title`: Form title
- `description`: Form description
- `submitButtonText`: Custom submit button text
- `successMessage`: Custom success message
- `isPublished`: Publication status
- `isActive`: Active status
- `theme`: JSON theme configuration
- `userId`: Owner reference
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Form Fields

- `id`: Unique identifier
- `type`: Field type (TEXT, TEXTAREA, RADIO, etc.)
- `label`: Field label
- `placeholder`: Field placeholder
- `required`: Required field flag
- `options`: Array of options (for select/radio/checkbox)
- `order`: Field order
- `section`: Field section grouping
- `formId`: Form reference
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Form Responses

- `id`: Unique identifier
- `data`: JSON response data
- `submittedAt`: Submission timestamp
- `userAgent`: Client user agent
- `ipAddress`: Client IP address
- `formId`: Form reference
- `userId`: Optional user reference

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Endpoints

#### POST `/api/auth/signup`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

#### POST `/api/auth/login`

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### POST `/api/auth/logout`

Logout user (token invalidation).

#### GET `/api/auth/profile`

Get current user profile.

#### PUT `/api/auth/profile`

Update user profile.

#### PUT `/api/auth/change-password`

Change user password.

## 📝 Form Management

### Endpoints

#### POST `/api/forms`

Create a new form.

**Request Body:**

```json
{
  "title": "Contact Form",
  "description": "Get in touch with us",
  "submitButtonText": "Send Message",
  "successMessage": "Thank you for your message!",
  "theme": {
    "backgroundColor": "#ffffff",
    "inputColor": "#f8fafc",
    "labelColor": "#1e293b",
    "fontSize": "16px",
    "alignment": "left"
  },
  "fields": [
    {
      "type": "TEXT",
      "label": "Name",
      "placeholder": "Enter your name",
      "required": true,
      "order": 0
    },
    {
      "type": "EMAIL",
      "label": "Email",
      "placeholder": "Enter your email",
      "required": true,
      "order": 1
    }
  ]
}
```

#### GET `/api/forms`

Get all forms for the authenticated user.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `status`: Filter by status (all, published, draft, active, inactive)

#### GET `/api/forms/:formId`

Get a specific form.

#### PUT `/api/forms/:formId`

Update a form.

#### DELETE `/api/forms/:formId`

Delete a form.

#### POST `/api/forms/:formId/duplicate`

Duplicate a form.

#### GET `/api/forms/:formId/responses`

Get form responses with pagination.

#### GET `/api/forms/:formId/statistics`

Get form statistics.

#### POST `/api/forms/:formId/export`

Export form responses (CSV/JSON).

## 🌐 Public API

### Endpoints

#### GET `/api/public/form/:formId`

Get a published form for public access.

#### POST `/api/public/form/:formId/submit`

Submit a form response.

**Request Body:**

```json
{
  "data": {
    "field_id_1": "John Doe",
    "field_id_2": "john@example.com"
  },
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configurable CORS settings
- **Rate Limiting**: Request rate limiting
- **Helmet**: Security headers
- **SQL Injection Protection**: Prisma ORM protection
- **XSS Protection**: Input sanitization

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "error": "Error message (if success: false)"
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript type checking

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
```

### Project Structure

```
src/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Express middleware
├── routes/            # Route definitions
├── services/          # Business logic
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── validators/        # Zod validation schemas
└── index.ts           # Application entry point
```

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production database URL
   - Set appropriate CORS origins

2. **Database**
   - Run migrations: `npm run db:migrate`
   - Ensure database is properly configured

3. **Security**
   - Enable HTTPS
   - Configure proper CORS settings
   - Set up rate limiting
   - Use environment variables for secrets

4. **Monitoring**
   - Set up logging
   - Configure error tracking
   - Monitor database performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the API examples

---

**FormCraft Backend** - Building the future of no-code form creation! 🚀
