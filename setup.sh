#!/bin/bash

# Tangle Community App - Complete Setup Script
# This script will set up the entire application including database, backend, and frontend

echo "🧱 Tangle Community App - Complete Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if MySQL is installed
check_mysql() {
    print_status "Checking MySQL installation..."
    if command -v mysql &> /dev/null; then
        print_success "MySQL is installed"
        return 0
    else
        print_error "MySQL is not installed. Please install MySQL first."
        echo "Visit: https://dev.mysql.com/downloads/installer/"
        return 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if MySQL is running
    if ! mysqladmin ping -h localhost -u root --silent; then
        print_error "MySQL is not running. Please start MySQL service first."
        echo "On Windows: Start MySQL from Services"
        echo "On macOS: brew services start mysql"
        echo "On Linux: sudo systemctl start mysql"
        return 1
    fi
    
    # Create database and user
    print_status "Creating database and user..."
    mysql -u root -p < database/create_db.sql
    
    if [ $? -eq 0 ]; then
        print_success "Database created successfully"
    else
        print_error "Failed to create database"
        return 1
    fi
    
    # Load schema and sample data
    print_status "Loading schema and sample data..."
    mysql -u tangle_user -p'tangle_password_2024' tangle_db < database/setup.sql
    
    if [ $? -eq 0 ]; then
        print_success "Schema and sample data loaded successfully"
    else
        print_error "Failed to load schema"
        return 1
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up Spring Boot backend..."
    
    cd backend
    
    # Check if Maven is installed
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed. Please install Maven first."
        echo "Visit: https://maven.apache.org/download.cgi"
        cd ..
        return 1
    fi
    
    # Download dependencies
    print_status "Downloading Maven dependencies..."
    mvn dependency:resolve
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies downloaded successfully"
    else
        print_error "Failed to download dependencies"
        cd ..
        return 1
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up React frontend..."
    
    cd frontend
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        echo "Visit: https://nodejs.org/"
        cd ..
        return 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        cd ..
        return 1
    fi
    
    # Install dependencies
    print_status "Installing npm dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        cd ..
        return 1
    fi
    
    cd ..
}

# Test the application
test_application() {
    print_status "Testing application setup..."
    
    # Test database connection
    print_status "Testing database connection..."
    if mysql -u tangle_user -p'tangle_password_2024' tangle_db -e "SELECT COUNT(*) FROM users;" &> /dev/null; then
        print_success "Database connection successful"
    else
        print_error "Database connection failed"
        return 1
    fi
    
    # Test backend compilation
    print_status "Testing backend compilation..."
    cd backend
    if mvn compile -q; then
        print_success "Backend compilation successful"
    else
        print_error "Backend compilation failed"
        cd ..
        return 1
    fi
    cd ..
    
    # Test frontend build
    print_status "Testing frontend build..."
    cd frontend
    if npm run build &> /dev/null; then
        print_success "Frontend build successful"
    else
        print_error "Frontend build failed"
        cd ..
        return 1
    fi
    cd ..
}

# Start the application
start_application() {
    print_status "Starting the application..."
    
    echo ""
    echo "🚀 To start the application, run these commands in separate terminals:"
    echo ""
    echo "Terminal 1 - Backend:"
    echo "  cd backend"
    echo "  mvn spring-boot:run"
    echo ""
    echo "Terminal 2 - Frontend:"
    echo "  cd frontend"
    echo "  npm start"
    echo ""
    echo "🌐 The application will be available at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:8080/api"
    echo ""
    echo "📝 Demo Account:"
    echo "  Email: demo@tangle.com"
    echo "  Password: demo123"
    echo ""
    echo "🔑 Community Code: DEMO001"
}

# Main setup function
main() {
    echo ""
    print_status "Starting complete setup..."
    
    # Check prerequisites
    if ! check_mysql; then
        exit 1
    fi
    
    # Setup database
    if ! setup_database; then
        exit 1
    fi
    
    # Setup backend
    if ! setup_backend; then
        exit 1
    fi
    
    # Setup frontend
    if ! setup_frontend; then
        exit 1
    fi
    
    # Test everything
    if ! test_application; then
        exit 1
    fi
    
    print_success "Setup completed successfully!"
    start_application
}

# Run the setup
main 