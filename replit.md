# ICTasks - Task Management Application

## Overview

ICTasks is a comprehensive task management application built with a modern full-stack architecture. The application provides task creation, management, recurring task templates, voice command functionality, and data import/export capabilities. It's designed to be a progressive web app with mobile-first considerations and supports both light and dark themes.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (@tanstack/react-query) for server state, React hooks for local state
- **Routing**: React Router for client-side navigation
- **Form Management**: React Hook Form with Zod validation
- **Styling**: Custom CSS variables with corporate color scheme and glass morphism effects

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Development**: Hot module replacement via Vite middleware

### Key Components

#### Task Management System
- **Task Model**: Comprehensive task structure with status tracking, assignee management, due dates, and labels
- **Recurring Tasks**: Template-based system supporting weekly, monthly, and yearly recurrence patterns
- **Status Workflow**: Three-state system (assigned → in-progress → closed)
- **Voice Commands**: Speech recognition for task creation with natural language parsing

#### Data Storage
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Development Storage**: In-memory storage class for testing
- **Schema Management**: Type-safe database schema with automatic TypeScript inference
- **Migration Support**: Drizzle Kit for database schema migrations

#### User Interface
- **Component Library**: Custom-built components using Radix UI primitives
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme System**: Light/dark mode with system preference detection
- **Accessibility**: ARIA-compliant components with keyboard navigation

## Data Flow

1. **Client-Server Communication**: RESTful API endpoints under `/api` prefix
2. **State Management**: React Query handles server state caching and synchronization
3. **Form Validation**: Client-side validation with Zod schemas before API calls
4. **Real-time Updates**: Component re-rendering based on state changes
5. **Data Persistence**: Automatic saving to PostgreSQL via Drizzle ORM

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, React DOM, React Router)
- Vite build toolchain with TypeScript support
- Express.js for server-side routing

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI for accessible component primitives
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Database and Validation
- Drizzle ORM with PostgreSQL adapter
- Neon Database serverless PostgreSQL
- Zod for runtime type validation
- React Hook Form for form state management

### Development Tools
- TSX for TypeScript execution
- ESBuild for production bundling
- PostCSS with Autoprefixer

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with hot module replacement
- **Database**: PostgreSQL 16 via Replit modules
- **Port Configuration**: Development server on port 5000
- **Build Process**: Concurrent client and server development

### Production Deployment
- **Platform**: Replit autoscale deployment
- **Build Command**: `npm run build` (Vite + ESBuild)
- **Start Command**: `npm run start` (Node.js production server)
- **Static Assets**: Client build output served from `/dist/public`
- **Environment**: NODE_ENV=production with optimized bundle

### Database Configuration
- **Connection**: Environment variable `DATABASE_URL` for PostgreSQL connection
- **Schema**: Centralized in `shared/schema.ts` for type sharing
- **Migrations**: Manual push via `npm run db:push`

## Changelog

- June 27, 2025. Initial setup and migration from Lovable to Replit
  - Migrated from React Router to Wouter for routing compatibility
  - Fixed CSS and dependency issues for Replit environment
  - Successfully deployed task management application

- June 27, 2025. Major recurring task system overhaul
  - Completely removed old recurring task implementation
  - Implemented new recurring template system with separate data model
  - Added intelligent task scheduler that generates tasks 5 days before due dates
  - Created dedicated recurring template management interface
  - Added support for weekly, monthly, and yearly scheduling patterns
  - Implemented active/inactive template status with soft delete functionality
  - Added automatic task generation based on template schedules

- June 27, 2025. Fixed recurring template display issues
  - Resolved module import conflicts in recurring template components
  - Consolidated RecurringTab component to inline filters and template list
  - Fixed template display in "Recurring" tab
  - Created GitHub integration setup guide
  - Templates now properly display with status toggle, edit, and delete functionality

## User Preferences

Preferred communication style: Simple, everyday language.