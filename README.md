# Purpose Pixels Craft 🎨

A modern web application for artisans to share their craft stories, showcase handmade products, and connect with a community of creators. Built with React, TypeScript, and Supabase.

## 🌟 Features

### ✨ Core Functionality
- **Story Sharing**: Create and share craft stories with the community
- **Product Marketplace**: List and sell handmade products
- **User Profiles**: Personalized artisan profiles with bio and statistics
- **Real-time Updates**: Live updates for posts and interactions
- **Image Management**: Drag & drop image uploads with Supabase storage

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme switching with system preference support
- **Multi-language Support**: English, Spanish, French, and more
- **Settings Persistence**: User preferences saved locally and synced to database
- **Modern UI**: Beautiful interface built with shadcn/ui components

### 🔐 Authentication & Security
- **Supabase Auth**: Secure user authentication and authorization
- **Row Level Security**: Database-level security policies
- **Protected Routes**: Secure access to user-specific features
- **Image Upload Security**: Authenticated file uploads with user-specific folders

### 🛍️ E-commerce Features
- **Product Catalog**: Browse handmade products by category
- **Shopping Cart**: Add products to cart and manage quantities
- **Wishlist**: Save favorite products for later
- **Checkout Process**: Streamlined purchase flow
- **Product Management**: Upload multiple images per product

### 💬 Community Features
- **Posts Feed**: Discover stories from fellow artisans
- **User Profiles**: View artisan profiles and their work
- **Messaging System**: Connect with other users
- **Impact Metrics**: Track community engagement and growth

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Query** - Server state management

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Storage for image uploads
  - Authentication

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd purpose-pixels-craft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - Set up storage bucket for image uploads
   - Configure environment variables

4. **Environment Variables**
   Create a `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SITE_URL=https://your-production-domain.com
   ```

   **Important**: Set `VITE_SITE_URL` to your production domain (e.g., `https://purpose-pixels-craft.vercel.app`) to ensure email confirmations work properly. This prevents users from being redirected to localhost after email verification.

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ImageUpload.tsx # Image upload component
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── Auth.tsx        # Authentication
│   ├── CreatePost.tsx  # Create post form
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   ├── useSettings.tsx # Settings management
│   └── ...
├── contexts/           # React contexts
│   └── SettingsContext.tsx
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── lib/                # Utility functions
```

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profiles and information
- **posts** - Community posts and stories
- **products** - Product listings
- **product_images** - Multiple images per product
- **user_settings** - User preferences
- **cart_items** - Shopping cart
- **wishlist_items** - User wishlists

### Key Features
- **Row Level Security** - Users can only access their own data
- **Real-time subscriptions** - Live updates for posts and messages
- **Automatic timestamps** - Created/updated timestamps
- **Cascade deletes** - Proper data cleanup

## 🎯 Key Features Implementation

### Image Upload System
- Drag & drop interface
- File validation (type, size)
- Supabase storage integration
- User-specific folders
- Public URL generation

### Settings Management
- Local storage persistence
- Database synchronization
- Theme switching (light/dark/system)
- Language preferences
- Real-time application

### Authentication Flow
- Supabase Auth integration
- Protected routes
- User profile management
- Session persistence

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables

### Manual Deployment
1. Build the project: `npm run build`
2. Upload `dist` folder to your hosting provider
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team AIMS

**Purpose Pixels Craft** is proudly developed by **Team AIMS**:

### Team Members
1. **Ameena Khatoon** - Frontend Development & UI/UX
2. **M. Indu Reddy** - Backend Development & Database Design
3. **P. Samhitha** - Full-stack Development & Features
4. **Masraddh** - Project Management & Testing

### Project Overview
This project was created as a comprehensive web application for artisans to showcase their work, share their stories, and connect with a community of creators. The team focused on creating a modern, user-friendly platform that combines e-commerce functionality with social features.

## 🎨 Design Philosophy

- **User-Centric**: Every feature is designed with the artisan community in mind
- **Accessibility**: WCAG compliant components and keyboard navigation
- **Performance**: Optimized for fast loading and smooth interactions
- **Scalability**: Built to handle growth and additional features

## 🔮 Future Enhancements

- Advanced search and filtering
- Payment gateway integration
- Social media sharing
- Analytics dashboard
- Mobile app development
- AI-powered product recommendations

---

**Built with ❤️ by Team AIMS**
