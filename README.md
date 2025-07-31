# 🧱 Tangle - Local Community App

> **Tagline**: "Connect. Support. Grow – Together."

A vibrant, mobile-friendly web application designed for small towns, residential areas, and villages to empower residents, home-business owners, and service providers.

## 🚀 Features

### Core Features
- **User Registration & Login** - Phone/Email authentication with OTP
- **Help Requests & Offers** - Post and respond to community needs
- **Local Business Promotion** - Showcase home-based businesses and services
- **Community Bulletin Board** - Events, alerts, and announcements
- **Category-wise Feed** - Organized posts by type (Help, Business, Buy/Sell, etc.)
- **In-App Messaging** - Private communication between users
- **Report/Block System** - Maintain community safety and trust

### Optional Features (Future)
- Verified badges for trusted users
- Map view for location-based posts
- Push notifications
- Multi-language support
- Marketplace with cart functionality

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **CSS3** - Custom styling (no Tailwind)
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hook Form** - Form handling

### Backend
- **Spring Boot 3** - RESTful API
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database operations
- **MySQL** - Database
- **JWT** - Token-based authentication

## 📁 Project Structure

```
Tangle/
├── frontend/          # React application
├── backend/           # Spring Boot application
├── database/          # Database scripts
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- MySQL 8.0+

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🎨 UI Design Principles

- **Vibrant & Modern** - Not dull or boring
- **Mobile-First** - Responsive design
- **Community-Focused** - Easy to use for all ages
- **Trust-Building** - Clear user verification

## 🔐 Authentication Flow

1. **Sign-Up Options**:
   - Phone number + OTP
   - Email + Password
   - Google Sign-In (optional)

2. **Community Joining**:
   - Auto-detect location
   - Search for community
   - Enter community code
   - Create new community

3. **Profile Setup**:
   - Full name
   - Address/Locality
   - User role (Resident, Business Owner, Service Provider)

## 📱 User Flow

1. User opens app → Sees latest posts
2. Signs up → Enters area/locality
3. Clicks "Post Something" → Chooses category, adds description
4. Other users see post, connect via messaging
5. App builds trust through community moderation

## 🛡 Security Features

- Email/phone uniqueness validation
- Strong password requirements
- JWT token authentication
- Community-based access control
- Report/block system for safety

---

**Built with ❤️ for local communities** 