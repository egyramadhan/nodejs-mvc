# Hashmicro Coding Test - Node.js MVC Application

A comprehensive web application built with Node.js following the MVC (Model-View-Controller) architecture pattern. This application demonstrates various programming concepts including model inheritance, nested loops, conditional statements, mathematical operations, and CRUD functionality.

## Features

### 🏗️ Architecture
- **MVC Pattern**: Clean separation of concerns with Models, Views, and Controllers
- **Model Inheritance**: BaseModel class with inherited User, Product, and CharacterAnalysis models
- **RESTful Routes**: Well-structured routing system
- **Middleware**: Authentication and authorization middleware

### 🔐 Authentication System
- User login/logout functionality
- Session management
- Password hashing with bcrypt
- Protected routes with authentication middleware

### 📦 Product Management (CRUD)
- Create, Read, Update, Delete products
- Inventory management with stock tracking
- Price and value calculations
- Product search functionality
- Mathematical operations for inventory statistics

### 📊 Character Analysis Tool
- **Special Feature**: Calculate percentage of characters from first string present in second string
- Uses nested loops for character comparison
- Mathematical percentage calculations
- Detailed analysis breakdown
- Save and view analysis history

### 🎯 Programming Concepts Demonstrated
- **Nested Loops**: Character analysis and inventory calculations
- **Nested If Statements**: Product categorization and validation
- **Mathematics**: Percentage calculations, inventory values, statistics
- **CRUD Operations**: Complete database operations for all entities
- **Object-Oriented Programming**: Class inheritance and polymorphism

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Template Engine**: EJS
- **Authentication**: bcryptjs for password hashing
- **Session Management**: express-session
- **Frontend**: Bootstrap 5, Font Awesome icons
- **Development**: Nodemon for auto-restart

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

### Setup Instructions

1. **Clone or download the project**
   ```bash
   cd d:\laragon\www\hashmicro-coding-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MySQL Database**
   - Ensure MySQL server is running
   - Update database configuration in `config/database.js` if needed:
     ```javascript
     const dbConfig = {
         host: 'localhost',
         user: 'root',
         password: '', // Your MySQL password
         database: 'hashmicro_test'
     };
     ```

4. **Run the application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - Default login credentials:
     - Username: `admin`
     - Password: `admin123`

## Project Structure

```
hashmicro-coding-test/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── config/
│   └── database.js        # Database configuration
├── models/
│   ├── BaseModel.js       # Base model with common CRUD operations
│   ├── User.js            # User model (inherits from BaseModel)
│   ├── Product.js         # Product model (inherits from BaseModel)
│   └── CharacterAnalysis.js # Character analysis model
├── controllers/
│   ├── AuthController.js  # Authentication logic
│   ├── DashboardController.js # Dashboard logic
│   ├── ProductController.js   # Product CRUD operations
│   └── CharacterAnalysisController.js # Analysis logic
├── middleware/
│   └── auth.js            # Authentication middleware
├── routes/
│   └── web.js             # Application routes
├── views/
│   ├── layout.ejs         # Main layout template
│   ├── auth/
│   │   └── login.ejs      # Login page
│   ├── dashboard/
│   │   └── index.ejs      # Dashboard page
│   ├── products/
│   │   ├── index.ejs      # Products listing
│   │   ├── create.ejs     # Add product form
│   │   └── edit.ejs       # Edit product form
│   └── analysis/
│       ├── index.ejs      # Analysis history
│       └── create.ejs     # Character analysis tool
└── public/
    └── css/
        └── style.css      # Custom styles
```

## Key Features Explained

### 1. Model Inheritance
The application uses a base model class that provides common CRUD operations:

```javascript
// BaseModel.js - Parent class
class BaseModel {
    static async create(data) { /* ... */ }
    static async findAll() { /* ... */ }
    static async findById(id) { /* ... */ }
    static async update(id, data) { /* ... */ }
    static async delete(id) { /* ... */ }
    static async getStatistics() { /* ... */ }
}

// Product.js - Child class
class Product extends BaseModel {
    // Inherits all BaseModel methods
    static async calculateInventoryValue() { /* ... */ }
}
```

### 2. Character Analysis Algorithm
The special feature calculates what percentage of unique characters from the first string are present in the second string:

```javascript
static calculateCharacterPercentage(string1, string2) {
    // Get unique characters from string1 (nested loop)
    const uniqueChars = [];
    for (let i = 0; i < string1.length; i++) {
        let isUnique = true;
        for (let j = 0; j < uniqueChars.length; j++) {
            if (string1[i] === uniqueChars[j]) {
                isUnique = false;
                break;
            }
        }
        if (isUnique) {
            uniqueChars.push(string1[i]);
        }
    }
    
    // Check which characters are found in string2 (nested loop)
    const foundChars = [];
    for (let i = 0; i < uniqueChars.length; i++) {
        for (let j = 0; j < string2.length; j++) {
            if (uniqueChars[i] === string2[j]) {
                foundChars.push(uniqueChars[i]);
                break;
            }
        }
    }
    
    // Calculate percentage (mathematics)
    const percentage = (foundChars.length / uniqueChars.length) * 100;
    
    return {
        percentage,
        uniqueCharsString1: uniqueChars.length,
        foundChars: foundChars.length,
        notFoundChars: uniqueChars.length - foundChars.length,
        foundCharsList: foundChars,
        notFoundCharsList: uniqueChars.filter(char => !foundChars.includes(char))
    };
}
```

### 3. Nested Loops and Conditional Statements
The application demonstrates nested loops in:
- Character analysis algorithm
- Product inventory calculations
- Statistical computations

Nested if statements are used in:
- Product categorization by price ranges
- User input validation
- Inventory status checking

### 4. Mathematical Operations
- Percentage calculations for character analysis
- Inventory value computations
- Statistical averages and totals
- Price calculations with discounts

## Database Schema

The application automatically creates the following tables:

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Character Analysis Table
```sql
CREATE TABLE character_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    string1 TEXT NOT NULL,
    string2 TEXT NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    unique_chars_string1 INT NOT NULL,
    found_chars INT NOT NULL,
    not_found_chars INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication
- `GET /` - Login page
- `POST /login` - Process login
- `POST /logout` - Logout user

### Dashboard
- `GET /dashboard` - Main dashboard

### Products (CRUD)
- `GET /products` - List all products
- `GET /products/create` - Show create form
- `POST /products` - Create new product
- `GET /products/:id/edit` - Show edit form
- `POST /products/:id` - Update product
- `POST /products/:id/delete` - Delete product

### Character Analysis
- `GET /analysis` - Analysis history
- `GET /analysis/create` - Analysis tool
- `POST /analysis/analyze` - Perform analysis

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon to automatically restart the server when files change.

### Adding New Features
1. Create new models in `models/` directory
2. Add controllers in `controllers/` directory
3. Define routes in `routes/web.js`
4. Create views in `views/` directory

## Testing the Application

1. **Login**: Use admin/admin123 to access the system
2. **Products**: Add, edit, and delete products to test CRUD operations
3. **Character Analysis**: Try different string combinations:
   - "hello" vs "world" → 60% (characters 'l' and 'o' found)
   - "abc" vs "xyz" → 0% (no common characters)
   - "programming" vs "program" → ~70% (most characters found)

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL server is running
   - Check database credentials in `config/database.js`
   - Verify MySQL port (default: 3306)

2. **Port Already in Use**
   - Change port in `app.js` or kill process using port 3000
   - Use `netstat -ano | findstr :3000` to find process ID

3. **Module Not Found**
   - Run `npm install` to install dependencies
   - Check if all required packages are in `package.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational purposes as part of the Hashmicro coding test.

---

**Note**: This application demonstrates various programming concepts and best practices in Node.js development, including MVC architecture, database operations, authentication, and complex algorithmic implementations.