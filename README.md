# Leevienna FS - Authentication, Chat & Quick-Order Setup Guide

## Overview

This guide will help you set up the authentication system, real-time chat, and quick-order functionality for Leevienna FS using Supabase.

## Prerequisites

- Supabase account and project
- Node.js 18+ installed
- Environment variables configured

## Step 1: Database Setup

Run the following SQL scripts in your Supabase SQL Editor in order:

1. **009_create_auth_and_orders_schema.sql** - Creates all necessary tables:
   - `user_profiles` - User profile information
   - `orders` - Order records
   - `order_items` - Individual items in orders
   - `chat_rooms` - Chat room/thread management
   - `chat_messages` - Real-time chat messages

2. **010_setup_storage_bucket.sql** - Sets up storage for chat images

## Step 2: Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Supabase Configuration

### Enable OAuth Providers

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Google** OAuth:
   - Add Google Client ID and Secret
   - Set redirect URL: `https://your-domain.com/auth/callback`
3. Enable **Facebook** OAuth:
   - Add Facebook App ID and Secret
   - Set redirect URL: `https://your-domain.com/auth/callback`
   - **Important**: See `FACEBOOK_OAUTH_SETUP.md` for detailed Facebook setup instructions including Privacy Policy and Data Deletion URLs

### Enable Real-time

1. Go to Database → Replication
2. Enable replication for:
   - `chat_messages`
   - `chat_rooms`
   - `orders`

### Set up Storage Bucket

1. Go to Storage
2. Create a bucket named `chat-images`
3. Make it public
4. Set policies (already in the SQL script)

## Step 4: Install Dependencies

```bash
pnpm install
# or
npm install
```

## Step 5: Run the Application

```bash
pnpm dev
# or
npm run dev
```

## Features Implemented

### ✅ Authentication
- Email/password signup and login
- Google OAuth integration
- Facebook OAuth integration
- Password reset functionality
- User profile management

### ✅ Quick-Order System
- "Buy Now" button on product cards
- "Add to Cart" functionality
- "Customize & Order" option
- Order confirmation modal
- Cart sidebar with item management

### ✅ Real-time Chat
- Floating chat widget (bottom right)
- Real-time messaging
- Order-specific chat rooms
- General inquiry chat
- Image attachment support
- Unread message indicators

### ✅ User Interface
- Updated header with cart and user menu
- Product cards with action buttons
- Order confirmation modals
- Cart management sidebar
- Mobile-responsive design

## Database Schema

### Tables Created

1. **user_profiles** - Extends auth.users with profile data
2. **orders** - Order records with status tracking
3. **order_items** - Individual items in each order
4. **chat_rooms** - Chat room management (general or order-specific)
5. **chat_messages** - Real-time chat messages

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- Users can view/manage their own data
- Admins can view/manage all data
- Public can view active products

## Order Flow

1. **Quick Order (Single Item)**:
   - User clicks "Buy Now" on product
   - If not logged in → Auth modal appears
   - Order confirmation modal opens
   - User selects quantity, customization, pickup location
   - Order created → Chat room auto-opens

2. **Cart Order (Multiple Items)**:
   - User adds items to cart
   - Clicks cart icon in header
   - Reviews items in sidebar
   - Clicks "Place Order"
   - Order confirmation modal opens
   - Order created → Chat room auto-opens

## Chat System

- **General Chat**: Created automatically when user first opens chat
- **Order Chat**: Created automatically when order is placed
- **Real-time Updates**: Messages appear instantly using Supabase real-time
- **Image Support**: Users can upload images (max 5MB)

## Admin Features

To make a user an admin, update the `user_profiles` table:

```sql
UPDATE user_profiles
SET is_admin = true
WHERE id = 'user-uuid-here';
```

Admin users can:
- View all orders
- View all chat rooms
- Update order status
- Reply to any chat

## Troubleshooting

### OAuth not working
- Check redirect URLs in Supabase dashboard
- Ensure OAuth credentials are correct
- Verify callback route is accessible

### Real-time not working
- Check replication is enabled in Supabase
- Verify RLS policies allow access
- Check browser console for errors

### Chat images not uploading
- Verify storage bucket exists
- Check storage policies
- Ensure bucket is public

### Orders not creating
- Check user is authenticated
- Verify RLS policies allow insert
- Check browser console for errors

## Next Steps

1. **Admin Dashboard** (Optional):
   - Create admin dashboard page
   - Add order management interface
   - Add chat management interface

2. **Email Notifications** (Optional):
   - Set up Supabase Edge Functions
   - Send email on new orders
   - Send email on new chat messages

3. **Order Tracking** (Optional):
   - Add order status updates
   - Email notifications on status change
   - Order history page

## Support

For issues or questions, check:
- Supabase documentation
- Next.js documentation
- Project README.md

