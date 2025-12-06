# 🎱 Snooker Club Management System

A modern, dark-themed Snooker Club Management System with neon green highlights and glassmorphism design. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

### 🔐 Admin Dashboard (Super Admin)
- **Dashboard Overview**: View statistics for total clubs, active/deactivated clubs, and payment status
- **Create Club Account**: Add new snooker clubs with auto-generated or manual passwords
- **Manage Clubs**: 
  - View all clubs in a sortable table
  - Activate/Deactivate clubs
  - Update expiry dates
  - Delete clubs
  - Auto-deactivation when payment expires
- **Payment Management**: Track paid/unpaid status and expiry dates

### 🎱 Club Owner Dashboard
- **Dashboard Overview**: 
  - View total tables, active games, and earnings
  - Weekly earnings chart
  - Peak hours analytics
  - Real-time table status monitoring
- **Table Management**:
  - Add/delete snooker tables
  - Real-time table status (Free/Occupied/Overtime)
  - Tables turn red after 30 minutes
- **Customer Management**:
  - Add temporary players
  - Track billed, paid, and remaining amounts
  - Auto-delete customers after 24 hours of inactivity
- **Start Game**:
  - 3-step workflow: Select table → Choose pricing → Assign players
  - Two pricing options: Per minute or fixed game price
  - Real-time game tracking with timer
  - Overtime alerts after 30 minutes
  - End game with loser selection and automatic billing
- **Ongoing Games** (NEW):
  - View all active games in real-time
  - Live timer and billing updates
  - Pause/Resume games functionality
  - Quick access to game details
  - End games directly from overview
  - Visual indicators for overtime and paused games

## 🎨 Design Features

- **Dark Mode UI**: Sleek dark background with #0a0a0a base
- **Neon Green Accents**: #00ff41 highlights throughout
- **Glassmorphism Cards**: Frosted glass effect with backdrop blur
- **Smooth Animations**: Transitions and hover effects
- **Responsive Design**: Works on desktop and tablet screens
- **Custom Scrollbar**: Themed scrollbar matching the design

## 🚀 Getting Started

### Default Credentials

**Admin Login:**
- Password: `Waiztahseen@2007`

**Club Owner Login:**
- Email: Any email
- Password: Any password (Demo mode)

### Navigation

- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard overview
- `/admin/create-club` - Create new club
- `/admin/manage-clubs` - Manage existing clubs
- `/club/login` - Club owner login
- `/club/dashboard` - Club owner dashboard
- `/club/tables` - Table management
- `/club/customers` - Customer management
- `/club/start-game` - Start a new game

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Charts and graphs
- **Lucide React** - Icons
- **shadcn/ui** - UI components

## 📋 Key Functionalities

### Admin Features
1. Create unlimited club accounts
2. Set and manage expiry dates
3. Auto-deactivate clubs when payment expires
4. Track last paid dates
5. View detailed club information
6. Search and filter clubs

### Club Owner Features
1. Manage multiple snooker tables
2. Add temporary players with billing
3. Start games with two pricing models
4. Real-time game tracking
5. Automatic overtime alerts
6. End game with automatic billing to loser
7. View earnings and analytics
8. Auto-cleanup of inactive customers

## 🎯 Business Logic

- **Payment Expiry**: When a club's expiry date passes, it automatically becomes "Unpaid" and "Deactivated"
- **Customer Lifecycle**: Customers are automatically deleted after 24 hours of inactivity
- **Game Overtime**: Tables show alerts when games exceed 30 minutes
- **Billing**: The loser of each game is automatically billed for the game cost
- **Pricing Models**: 
  - Per Minute: Calculated based on game duration
  - Fixed Price: One-time charge regardless of duration

## 🎨 Color Palette

- Primary Background: `#0a0a0a`
- Secondary Background: `#0d1117`
- Neon Green: `#00ff41`
- White Text: `#ffffff`
- Gray Text: `#9ca3af`
- Red Alert: `#ef4444`
- Blue Active: `#3b82f6`
- Orange Warning: `#f97316`

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px