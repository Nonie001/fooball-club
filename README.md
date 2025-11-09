# ⚽ Brotherhood FC - Football League Management System

A comprehensive web application for managing football league tournaments with modern features and real-time capabilities.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E)

## ✨ Features

### 🏆 Tournament Management
- **Round Robin Algorithm**: Fair match generation ensuring every team plays against every other team
- **Smart Scheduling**: Prevents team conflicts in the same round
- **Venue Management**: Automatic alternating field assignment (1-2-1-2 pattern)
- **Real-time Updates**: Live match scoring and standings updates

### 👨‍💼 Admin Dashboard
- **Team Management**: Add, edit, and remove teams with custom logos
- **Match Generation**: Intelligent tournament bracket creation
- **Score Management**: Direct score input from fixtures page when logged in as admin
- **League Controls**: Open/close league seasons with data archival
- **IP-based Authentication**: Remember trusted devices for 7 days

### 📊 User Interface
- **Live Standings**: Real-time league table with detailed statistics
- **Match Fixtures**: Complete tournament schedule with filtering options
- **History Tracking**: Archive of completed seasons and matches
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode Support**: Toggle between light and dark themes

### 🔧 Technical Features
- **Database Integration**: Supabase PostgreSQL with Row Level Security
- **Real-time Sync**: Automatic data synchronization across all pages
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Next.js 16 with Turbopack for fast development

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nonie001/fooball-club.git
   cd fooball-club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup database**
   Run the SQL schema in your Supabase dashboard:
   ```bash
   # Copy contents from lib/database/schema.sql to Supabase SQL Editor
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

### Admin Access
1. Go to `/admin/login`
2. Use credentials: `admin` / `admin123` (demo)
3. Access admin dashboard for full management capabilities

### Creating a Tournament
1. **Setup Teams**: Add teams in the admin dashboard
2. **Generate Matches**: Use the smart match generation algorithm
3. **Input Scores**: Enter results directly from the fixtures page
4. **Monitor Progress**: Track standings and statistics in real-time

### Managing Seasons
- **Active Season**: Teams and matches can be modified
- **Closed Season**: Data is archived and new season can begin
- **History**: View complete records of past tournaments

## 🏗️ Architecture

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon system

### Backend
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Row Level Security**: Secure data access patterns
- **Edge Functions**: Serverless API endpoints

### Algorithm Highlights
- **Round Robin Tournament**: Ensures fair play for all teams
- **Conflict Prevention**: No team plays multiple matches per round  
- **Venue Distribution**: Balanced field usage with alternating assignment
- **Score Tracking**: Comprehensive statistics calculation

## 🎯 Core Components

### Database Schema
```sql
-- Teams table with basic information
CREATE TABLE teams (...)

-- Matches table with comprehensive match data  
CREATE TABLE matches (...)
```

### Key Algorithms
- **Match Generation**: Smart pairing with conflict detection
- **Standings Calculation**: Points, goal difference, and rankings
- **Venue Assignment**: Alternating field distribution
- **Authentication**: IP-based trusted device management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Supabase for the powerful backend infrastructure  
- Tailwind CSS for the utility-first styling approach
- All contributors who help improve this project

---

**Built with ❤️ for football communities everywhere**
