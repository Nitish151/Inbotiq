# Backend - Role-Based Authentication API

RESTful API for role-based authentication built with Express, TypeScript, and MongoDB.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Configuration (use a strong secret in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS - Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### POST `/auth/signup`
Register a new user

#### POST `/auth/login`
Authenticate user

#### GET `/auth/me`
Get current user (requires authentication)

#### GET `/health`
Health check endpoint

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
└── index.ts        # Application entry point
```

## Security Features

- Bcrypt password hashing (12 salt rounds)
- JWT token authentication
- Helmet for HTTP headers security
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation and sanitization

## Deployment

### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

### Railway
1. New Project from GitHub
2. Add environment variables
3. Deploy

## MongoDB Setup

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string
6. Update MONGODB_URI in `.env`
