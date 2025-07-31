# 🧱 Tangle Community App - Setup Guide

This guide will help you set up the complete Tangle community app with both backend and frontend components.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Java 17+** (for Spring Boot backend)
- **Node.js 18+** (for React frontend)
- **MySQL 8.0+** (for database)
- **Maven** (for building the backend)

## 🚀 Quick Setup

### 1. Database Setup

1. **Start MySQL server**
2. **Create the database:**
   ```bash
   mysql -u root -p < database/setup.sql
   ```

### 2. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Update database configuration:**
   Edit `src/main/resources/application.yml` and update:
   - Database username/password
   - Email configuration (if using email features)

3. **Build and run the backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   
   The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   
   The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/tangle_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: your_mysql_username
    password: your_mysql_password
  
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
```

### Frontend Configuration

The frontend is configured to proxy requests to the backend at `http://localhost:8080`. If you change the backend port, update the proxy in `frontend/package.json`.

## 🧪 Testing the Setup

### Demo Account

Use these credentials to test the app:

- **Email:** demo@tangle.com
- **Password:** demo123

### API Endpoints

Test the backend API:

```bash
# Health check
curl http://localhost:8080/api/health

# Get communities
curl http://localhost:8080/api/communities

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"demo@tangle.com","password":"demo123"}'
```

## 📁 Project Structure

```
Tangle/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/tangle/
│   │       ├── config/     # Security and configuration
│   │       ├── controller/ # REST API controllers
│   │       ├── dto/        # Data Transfer Objects
│   │       ├── entity/     # JPA entities
│   │       ├── repository/ # Data access layer
│   │       └── service/    # Business logic
│   └── src/main/resources/
│       └── application.yml # Configuration
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── public/            # Static assets
├── database/              # Database scripts
│   └── setup.sql         # Database schema and sample data
└── docs/                 # Documentation
```

## 🎨 Features Implemented

### ✅ Core Features
- [x] User registration and authentication
- [x] Community-based user management
- [x] Post creation and management
- [x] Category-based post filtering
- [x] Responsive design
- [x] JWT-based authentication
- [x] User profiles and settings

### ✅ UI/UX Features
- [x] Vibrant, modern design
- [x] Mobile-responsive layout
- [x] Smooth animations and transitions
- [x] Intuitive navigation
- [x] Loading states and error handling

### ✅ Backend Features
- [x] RESTful API design
- [x] Spring Security with JWT
- [x] Database relationships and constraints
- [x] Input validation and error handling
- [x] CORS configuration

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Encryption:** BCrypt password hashing
- **Input Validation:** Server-side validation for all inputs
- **CORS Protection:** Configured for frontend-backend communication
- **SQL Injection Protection:** JPA/Hibernate parameterized queries

## 🚀 Deployment

### Backend Deployment

1. **Build the JAR file:**
   ```bash
   cd backend
   ./mvnw clean package
   ```

2. **Run the JAR:**
   ```bash
   java -jar target/tangle-backend-1.0.0.jar
   ```

### Frontend Deployment

1. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `build` folder to your web server**

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify MySQL is running
   - Check database credentials in `application.yml`
   - Ensure database exists: `CREATE DATABASE tangle_db;`

2. **Frontend Build Errors:**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version`

3. **CORS Errors:**
   - Verify backend is running on port 8080
   - Check CORS configuration in `SecurityConfig.java`

4. **Authentication Issues:**
   - Clear browser localStorage
   - Check JWT secret in `application.yml`

### Logs

- **Backend logs:** Check console output or `logs/` directory
- **Frontend logs:** Check browser console (F12)

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure all services are running (MySQL, Backend, Frontend)
4. Check the console logs for error messages

## 🎉 Success!

Once everything is set up, you should be able to:

1. Visit `http://localhost:3000`
2. Register a new account or login with demo credentials
3. Create posts and interact with the community
4. Explore all the features of the Tangle community app

---

**Happy coding! 🚀** 