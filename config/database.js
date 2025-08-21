const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'hashmicro_test'
};

class Database {
    static async getConnection() {
        try {
            const connection = await mysql.createConnection(dbConfig);
            return connection;
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    }

    static async initDatabase() {
        try {
            const connection = await mysql.createConnection({
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password
            });

            // Create database if not exists
            await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
            await connection.end();

            // Connect to the database and create tables
            const dbConnection = await this.getConnection();
            
            // Users table
            await dbConnection.execute(`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    email VARCHAR(100),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);

            // Products table
            await dbConnection.execute(`
                CREATE TABLE IF NOT EXISTS products (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    price DECIMAL(10,2) NOT NULL,
                    stock INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);

            // Character analysis results table
            await dbConnection.execute(`
                CREATE TABLE IF NOT EXISTS character_analysis (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    input1 VARCHAR(255) NOT NULL,
                    input2 VARCHAR(255) NOT NULL,
                    percentage DECIMAL(5,2) NOT NULL,
                    matching_chars TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Insert default admin user
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await dbConnection.execute(`
                INSERT IGNORE INTO users (username, password, email) 
                VALUES ('admin', ?, 'admin@hashmicro.com')
            `, [hashedPassword]);

            await dbConnection.end();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }
}

module.exports = Database;