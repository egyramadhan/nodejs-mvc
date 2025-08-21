const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const Database = require('./config/database');
const webRoutes = require('./routes/web');

const app = express();
const PORT = process.env.PORT || 3000;

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
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
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
        await Database.initDatabase();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        // Don't exit in production, let the app continue without database
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
    
    // Only start server if not in Vercel environment
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log('Default login: username=admin, password=admin123');
        });
    }
}

// Add debugging for Vercel
console.log('App starting...', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    DB_HOST: process.env.DB_HOST ? 'Set' : 'Not set'
});

// Initialize database on startup (non-blocking for Vercel)
if (process.env.VERCEL) {
    console.log('Running in Vercel environment');
    // In Vercel, initialize database lazily
    Database.initDatabase().catch(err => {
        console.error('Database initialization failed in Vercel:', err);
    });
} else {
    console.log('Running in local environment');
    // In local development, wait for database initialization
    startServer();
}

// Export the Express app for Vercel
module.exports = app;