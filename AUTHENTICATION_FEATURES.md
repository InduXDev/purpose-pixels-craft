# Authentication Features

This document describes the authentication features implemented in the Purpose Pixels Craft application.

## Features Added

### 1. Forgot Password Page
- **Route**: `/forgot-password`
- **File**: `src/pages/ForgotPassword.tsx`
- **Features**:
  - Email input form
  - Password reset email sending
  - Success confirmation screen
  - Error handling
  - Navigation back to sign in

### 2. Reset Password Page
- **Route**: `/reset-password`
- **File**: `src/pages/ResetPassword.tsx`
- **Features**:
  - New password input with confirmation
  - Password visibility toggle
  - Password validation (minimum 6 characters)
  - Success confirmation
  - Automatic redirect after successful reset

### 3. Email Confirmation Page
- **Route**: `/email-confirmation`
- **File**: `src/pages/EmailConfirmation.tsx`
- **Features**:
  - Handles both signup and password reset confirmations
  - URL parameter parsing for tokens
  - Loading, success, and error states
  - Automatic email verification
  - User-friendly messaging

## Updated Features

### 1. Auth Page (`src/pages/Auth.tsx`)
- Added "Forgot password?" link in the login form
- Links to the new forgot password page

### 2. Authentication Hook (`src/hooks/useAuth.tsx`)
- Updated signup function to redirect to email confirmation page
- Uses proper URL configuration for development vs production

### 3. Environment Configuration (`src/config/env.ts`)
- Updated to handle development URLs properly
- Uses localhost:5173 for development
- Uses production URL for production

### 4. App Routing (`src/App.tsx`)
- Added routes for all new authentication pages
- Proper route ordering

## URL Configuration

The application now properly handles email confirmation URLs:

- **Development**: `http://localhost:5173/email-confirmation`
- **Production**: `https://purpose-pixels-craft.vercel.app/email-confirmation`

## User Flow

### Sign Up Flow
1. User fills out signup form
2. Account created with email verification required
3. User receives email with confirmation link
4. Clicking link takes user to `/email-confirmation`
5. Email is automatically verified
6. User can sign in with their new account

### Password Reset Flow
1. User clicks "Forgot password?" on login page
2. User enters email on `/forgot-password` page
3. User receives password reset email
4. Clicking link takes user to `/reset-password`
5. User sets new password
6. User can sign in with new password

## Styling

All new pages use the same design system as the existing application:
- Consistent color scheme (orange/amber theme)
- Dark mode support
- Responsive design
- Smooth animations
- Modern UI components from shadcn/ui

## Error Handling

- Comprehensive error messages for users
- Toast notifications for feedback
- Graceful fallbacks for invalid links
- Proper loading states

## Security

- Password validation (minimum 6 characters)
- Secure token handling
- Proper session management
- CSRF protection through Supabase 