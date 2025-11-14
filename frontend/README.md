# Frontend - Role-Based Authentication UI

Modern Next.js application with TypeScript, TailwindCSS, and role-based authentication.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Features

- 🔐 JWT Authentication
- 👥 Role-based access control
- 🎨 Beautiful UI with TailwindCSS
- ✅ Form validation with Zod
- 🔄 Loading states and error handling
- 📱 Fully responsive design
- 🎯 Protected routes
- 🚀 Next.js 14 App Router

## Pages

- `/` - Home/Landing page
- `/login` - Login page
- `/signup` - Signup page with role selection
- `/dashboard` - Protected dashboard (requires auth)

## Components

- `Button` - Reusable button with variants
- `Input` - Form input with validation
- `Select` - Dropdown select component
- `ProtectedRoute` - Authentication guard

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

### Netlify
1. Connect repository
2. Set base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy

## Project Structure

```
app/
├── (auth)/          # Auth routes group
│   ├── login/       # Login page
│   └── signup/      # Signup page
├── dashboard/       # Protected dashboard
├── layout.tsx       # Root layout
├── page.tsx         # Home page
└── globals.css      # Global styles

components/          # Reusable components
contexts/           # React contexts
lib/                # Utilities and services
types/              # TypeScript types
```

## Styling

- TailwindCSS for utility-first styling
- Custom color palette
- Responsive design
- Dark/light gradient backgrounds
- Lucide React icons

## State Management

- React Context API for auth state
- Local storage for token persistence
- Protected route HOC
