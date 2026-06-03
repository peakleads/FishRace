# FishRace - Social Fishing Competition Platform

A modern, production-ready web app where users can upload fish catches, compete with friends, track records, and climb leaderboards.

## Features

### Authentication
- User registration and login
- Secure password-based authentication via Supabase
- User profiles with avatars and statistics

### Fish Catch Management
- Upload fish photos with metadata (species, weight, length, location)
- Instagram-style feed showing catches from the community
- Like and comment on catches
- Location privacy settings (private, friends only, public)

### Leaderboards
- Biggest fish overall
- Longest fish overall
- Most catches
- Real-time rankings

### Competitions (Race System)
- Create fishing competitions
- Invite friends to join
- Set rules and scoring methods (by weight, length, or count)
- Live competition leaderboards
- Automatic winner calculation

### User Profiles
- Personal catch history
- Statistics (total catches, biggest fish, longest fish, favorite species)
- Public profile viewing
- Profile avatars

### Achievements
- Badge-based achievement system
- Unlock milestones like first catch, 5kg pike, 10kg pike, 1 meter fish, 100 catches, etc.

### Map System
- Display catches on an interactive map
- Location privacy controls
- Coming soon: enhanced map features

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Build**: Vite

## Database Schema

- `users` - User profiles and statistics
- `catches` - Fish catch records with images and metadata
- `competitions` - Fishing competition events
- `competition_members` - Competition participation tracking
- `likes` - Catch likes (many-to-many)
- `comments` - Catch comments
- `achievements` - Achievement definitions
- `achievement_logs` - User achievement tracking

All tables have Row Level Security (RLS) enabled for data protection.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Architecture

### Component Structure
- `Layout` - Main page wrapper with navigation
- `Navigation` - Mobile-responsive bottom nav / sidebar
- `CatchCard` - Reusable catch display component

### Pages
- `Feed` - Instagram-style social feed
- `Login` / `SignUp` - Authentication
- `Profile` - User profile with catch history
- `UploadCatch` - Catch upload form
- `Leaderboard` - Global rankings
- `Competitions` - Race system hub
- `Map` - Catch map visualization
- `Achievements` - Badge showcase

### Hooks
- `useAuth` - Authentication state management
- `useProtectedRoute` - Route protection utility

## Design

- **Dark Theme**: Slate-900/950 backgrounds with cyan/blue accents
- **Mobile-First**: Responsive design from mobile to desktop
- **Premium Feel**: Smooth animations, cards, gradients inspired by Strava, Instagram, and Discord
- **Fishing Colors**: Dark green, black, and blue color scheme
- **Micro-interactions**: Hover states, transitions, smooth animations

## Security

- Row Level Security (RLS) on all database tables
- User data isolation - users can only access/modify their own data
- Secure authentication via Supabase
- Image uploads to secure storage

## Future Enhancements

- Advanced map with catch location heatmaps
- Social following system
- Direct messaging between users
- Advanced analytics and fishing trends
- Mobile app (React Native)
- Live competition notifications
- Video catch uploads
