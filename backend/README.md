# Tangle Backend - Node.js Express API

A robust Node.js Express backend for the Tangle local community application.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Posts Management**: CRUD operations for community posts
- **Comments System**: Full comment functionality for posts
- **Community Management**: Create and manage local communities
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: MySQL with connection pooling
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=8080
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=tangle_user
   DB_PASSWORD=tangle_password_2024
   DB_NAME=tangle_db
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Set up the database:**
   - Make sure MySQL is running
   - Create the database and user (use the `database/complete_setup.sql` script)
   - The backend will automatically test the connection on startup

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:8080`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/posts/my-posts` - Get user's posts
- `GET /api/posts/stats` - Get post statistics

### Comments
- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments/:postId` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Communities
- `GET /api/communities` - Get all communities
- `GET /api/communities/:id` - Get single community
- `POST /api/communities` - Create community
- `PUT /api/communities/:id` - Update community
- `DELETE /api/communities/:id` - Delete community
- `GET /api/communities/search?q=query` - Search communities
- `GET /api/communities/code/:code` - Get community by code

### Health Check
- `GET /health` - Server health status
- `GET /` - API documentation

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

The backend works with the existing MySQL database schema from the Spring Boot version. Make sure to run the `database/complete_setup.sql` script to set up the database.

## 🛡 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Express-validator for request validation
- **SQL Injection Protection**: Parameterized queries with mysql2
- **Password Hashing**: bcrypt for secure password storage

## 🐛 Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401, 403)
- Not found errors (404)
- Server errors (500)

All errors return consistent JSON responses with error messages.

## 📝 Logging

The application logs:
- Server startup information
- Database connection status
- API errors
- Request processing

## 🔧 Development

### Project Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── postController.js    # Post management
│   ├── commentController.js # Comment management
│   └── communityController.js # Community management
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── posts.js            # Post routes
│   ├── comments.js         # Comment routes
│   └── communities.js      # Community routes
├── utils/
│   └── jwt.js              # JWT utilities
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

### Adding New Features

1. Create controller in `controllers/` directory
2. Create routes in `routes/` directory
3. Add middleware if needed
4. Update `server.js` to include new routes

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure proper CORS origins
4. Set up a reverse proxy (nginx)
5. Use PM2 or similar process manager
6. Set up proper logging
7. Configure SSL/TLS

## 📞 Support

For issues or questions, check the logs and ensure:
- Database is running and accessible
- Environment variables are correctly set
- All dependencies are installed
- Port 8080 is available 