# Complete Setup Guide for Tangle Community App

## 🚀 Quick Start (Windows)

### Prerequisites
1. **Java 17 or higher** - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://adoptium.net/)
2. **MySQL 8.0** - Download from [MySQL](https://dev.mysql.com/downloads/mysql/)
3. **Node.js 16 or higher** - Download from [Node.js](https://nodejs.org/)
4. **Maven** - Download from [Apache Maven](https://maven.apache.org/download.cgi/)

### Step 1: Database Setup

1. **Start MySQL Service**
   ```cmd
   net start mysql80
   ```

2. **Run Database Setup**
   ```cmd
   mysql -u root -p < database/complete_setup.sql
   ```
   When prompted, enter your MySQL root password.

3. **Verify Database**
   ```cmd
   mysql -u tangle_user -p
   ```
   Password: `tangle_password_2024`
   
   ```sql
   USE tangle_db;
   SHOW TABLES;
   SELECT * FROM communities;
   ```

### Step 2: Backend Setup

1. **Navigate to Backend Directory**
   ```cmd
   cd backend
   ```

2. **Build and Run Backend**
   ```cmd
   mvn clean install
   mvn spring-boot:run
   ```

3. **Verify Backend**
   - Open browser: `http://localhost:8080/api/health`
   - Should see: `{"status":"UP"}`

### Step 3: Frontend Setup

1. **Open New Terminal and Navigate to Frontend**
   ```cmd
   cd frontend
   ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```

3. **Start Frontend**
   ```cmd
   npm start
   ```

4. **Verify Frontend**
   - Open browser: `http://localhost:3000`
   - Should see the Tangle homepage

## 🔧 Detailed Setup Instructions

### Database Configuration

The application uses MySQL with the following configuration:
- **Database**: `tangle_db`
- **User**: `tangle_user`
- **Password**: `tangle_password_2024`
- **Port**: `3306`

### Backend Configuration

The Spring Boot application runs on:
- **Port**: `8080`
- **Context Path**: `/api`
- **JWT Secret**: `tangleSecretKey2024ForJWTTokenGenerationAndValidation`

### Frontend Configuration

The React application runs on:
- **Port**: `3000`
- **API Base URL**: `http://localhost:8080/api`

## 🧪 Testing the Application

### Test Users (Pre-loaded)

| Email | Password | Role | Community |
|-------|----------|------|-----------|
| admin@tangle.com | password123 | ADMIN | Anna Nagar |
| john@example.com | password123 | RESIDENT | Anna Nagar |
| jane@example.com | password123 | BUSINESS_OWNER | T Nagar |
| mike@example.com | password123 | SERVICE_PROVIDER | Adyar |
| sarah@example.com | password123 | RESIDENT | Mylapore |

### Test Communities (Pre-loaded)

| Code | Name | Location |
|------|------|----------|
| ANNA001 | Anna Nagar Community | Chennai |
| TNAGAR001 | T Nagar Residents | Chennai |
| ADYAR001 | Adyar Community | Chennai |
| MYLAPORE001 | Mylapore Heritage | Chennai |
| VELACHERY001 | Velachery Residents | Chennai |

## 🐛 Troubleshooting

### Common Issues

1. **Backend Won't Start**
   - Check if MySQL is running: `net start mysql80`
   - Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`
   - Check application.yml configuration

2. **Database Connection Error**
   - Verify MySQL service is running
   - Check credentials in `application.yml`
   - Ensure database and user exist

3. **Frontend Can't Connect to Backend**
   - Verify backend is running on port 8080
   - Check CORS configuration
   - Ensure axios base URL is correct

4. **Login Issues**
   - Use test credentials: `john@example.com` / `password123`
   - Check browser console for errors
   - Verify JWT token is being generated

### Debug Commands

```cmd
# Check if ports are in use
netstat -ano | findstr :8080
netstat -ano | findstr :3000

# Check MySQL status
sc query mysql80

# Check Java version
java -version

# Check Node version
node --version

# Check Maven version
mvn --version
```

## 📁 Project Structure

```
Tangle/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/com/tangle/
│   │   ├── controller/      # REST Controllers
│   │   ├── service/         # Business Logic
│   │   ├── repository/      # Data Access
│   │   ├── entity/          # JPA Entities
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── config/          # Configuration
│   │   └── TangleApplication.java
│   ├── src/main/resources/
│   │   └── application.yml  # Application Configuration
│   └── pom.xml             # Maven Dependencies
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable Components
│   │   ├── pages/          # Page Components
│   │   ├── contexts/       # React Contexts
│   │   ├── App.js          # Main App Component
│   │   └── index.js        # Entry Point
│   ├── public/
│   └── package.json        # Node Dependencies
├── database/               # Database Scripts
│   ├── complete_setup.sql  # Complete Database Setup
│   ├── create_db.sql       # Database Creation
│   └── setup.sql          # Schema Setup
└── README.md              # Project Documentation
```

## 🔒 Security Features

- **JWT Authentication**: Token-based authentication
- **Password Hashing**: BCrypt password encoding
- **CORS Configuration**: Cross-origin resource sharing
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: JPA/Hibernate protection

## 🚀 Deployment

### Production Setup

1. **Database**
   - Use production MySQL server
   - Update `application.yml` with production credentials
   - Enable SSL connections

2. **Backend**
   - Build JAR: `mvn clean package`
   - Run: `java -jar target/tangle-backend-1.0.0.jar`
   - Configure environment variables

3. **Frontend**
   - Build: `npm run build`
   - Serve static files with nginx or Apache
   - Update API base URL for production

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check console logs for error messages
4. Ensure all services are running on correct ports

## 🎉 Success!

Once everything is set up correctly, you should be able to:

1. ✅ Access the frontend at `http://localhost:3000`
2. ✅ Register new users or login with test accounts
3. ✅ Create and view community posts
4. ✅ Add comments to posts
5. ✅ Filter posts by category
6. ✅ Search for posts
7. ✅ View user profiles and statistics

The application is now ready for development and testing! 