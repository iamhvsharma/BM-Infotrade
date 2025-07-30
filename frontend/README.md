# FormCraft Frontend

A modern, drag-and-drop form builder with real-time preview and comprehensive form management.

## Features

- 🎨 **Drag & Drop Form Builder** - Intuitive interface for creating forms
- 👀 **Real-time Preview** - See your form as you build it
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Authentication System** - Login/Signup with secure token management
- 📊 **Form Responses** - View and export form submissions
- 🎯 **Field Types** - Text, textarea, radio, checkbox, select, multi-select, date
- 🎨 **Customizable Themes** - Customize form appearance
- 📤 **CSV Export** - Export responses to CSV format
- 🔄 **Form Duplication** - Clone existing forms
- 📋 **Form Management** - Create, edit, delete, and organize forms

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Backend API server (see backend setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:

   ```env
   # Backend API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api

   # Optional: Development settings
   VITE_DEV_MODE=true
   VITE_ENABLE_MOCK_DATA=true
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Backend Integration

The frontend is designed to work with a Node.js/Express backend. The API endpoints expected are:

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

### Forms

- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get specific form
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Form Responses

- `GET /api/forms/:id/responses` - Get form responses
- `POST /api/forms/:id/responses` - Submit form response

### User Profile

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Project Structure

```
src/
├── components/
│   ├── form-builder/     # Form builder components
│   ├── layout/           # Layout components
│   └── ui/              # Reusable UI components
├── contexts/             # React contexts
├── hooks/               # Custom hooks
├── lib/                 # Utility functions and API
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   └── ...              # Other pages
└── types/               # TypeScript type definitions
```

## Key Features

### Drag & Drop Form Builder

- Drag field types from sidebar to form area
- Reorder fields by dragging them
- Real-time preview of form changes
- Field configuration with validation

### Authentication System

- Secure login/signup pages
- Token-based authentication
- Protected admin routes
- User session management

### Form Management

- Create, edit, and delete forms
- Duplicate existing forms
- Form templates and themes
- Form sharing and embedding

### Response Management

- View all form submissions
- Search and filter responses
- Export responses to CSV
- Detailed response analytics

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

This project uses:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling
- **React DnD** for drag and drop
- **React Router** for routing

### Adding New Features

1. **New Field Types**: Add to `FormField` type and create corresponding components
2. **New Pages**: Add routes in `App.tsx` and create page components
3. **API Integration**: Use the `api` utility from `lib/api.ts`
4. **Styling**: Use Tailwind CSS classes and shadcn/ui components

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_DEV_MODE=false
VITE_ENABLE_MOCK_DATA=false
```

## Troubleshooting

### Common Issues

1. **Drag and Drop Not Working**

   - Ensure `react-dnd` and `react-dnd-html5-backend` are installed
   - Check that `DndProvider` wraps your app

2. **API Calls Failing**

   - Verify backend server is running
   - Check `VITE_API_BASE_URL` in environment variables
   - Ensure CORS is configured on backend

3. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check token expiration
   - Verify API endpoints are correct

### Debug Mode

Enable debug mode by setting `VITE_DEV_MODE=true` in your `.env` file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
