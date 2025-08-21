const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('./config/database');
const webRoutes = require('./routes/web');

const app = express();
const PORT = process.env.PORT || 3000;
const isVercel = !!process.env.VERCEL;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'hashmicro-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Disabled for local development - enable only with HTTPS in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
app.use('/', webRoutes);

// Health check route (no database dependency)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        vercel: !!process.env.VERCEL
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        message: 'Page not found',
        error: {}
    });
});

// Initialize database and start server
async function startServer() {
    try {
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Vercel deployment:', !!isVercel);
        
        if (!isVercel) {
            await Database.initDatabase();
            console.log('Database initialized successfully');
        } else {
            console.log('Skipping database initialization in Vercel environment');
        }
        
        if (!isVercel) {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
                console.log('Default login: username=admin, password=admin123');
            });
        }
    } catch (error) {
        console.error('Failed to start server:', error);
        if (!isVercel) {
            process.exit(1);
        }
    }
}

// Initialize database with lazy loading for Vercel
let dbInitialized = false;
async function ensureDatabase() {
    if (!dbInitialized && isVercel) {
        try {
            await Database.initDatabase();
            dbInitialized = true;
            console.log('Database initialized lazily');
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }
}

// Add middleware to ensure database is initialized for each request in Vercel
if (isVercel) {
    app.use(async (req, res, next) => {
        try {
            await ensureDatabase();
            next();
        } catch (error) {
            console.error('Database initialization error:', error);
            res.status(500).render('error', { 
                message: 'Database connection failed',
                error: process.env.NODE_ENV === 'development' ? error : {}
            });
        }
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        vercel: !!isVercel
    });
});

startServer();

// Export for Vercel
module.exports = app;