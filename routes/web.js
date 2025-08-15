const express = require('express');
const router = express.Router();
const { requireAuth, redirectIfAuthenticated } = require('../middleware/auth');

// Controllers
const AuthController = require('../controllers/AuthController');
const DashboardController = require('../controllers/DashboardController');
const ProductController = require('../controllers/ProductController');
const CharacterAnalysisController = require('../controllers/CharacterAnalysisController');

// Public routes
router.get('/', redirectIfAuthenticated, (req, res) => {
    res.redirect('/login');
});

router.get('/login', redirectIfAuthenticated, AuthController.showLogin);
router.post('/login', redirectIfAuthenticated, AuthController.login);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/dashboard', requireAuth, DashboardController.index);

// Product routes
router.get('/products', requireAuth, ProductController.index);
router.get('/products/create', requireAuth, ProductController.create);
router.post('/products', requireAuth, ProductController.store);
router.get('/products/:id/edit', requireAuth, ProductController.edit);
router.post('/products/:id', requireAuth, ProductController.update);
router.post('/products/:id/delete', requireAuth, ProductController.delete);

// Character Analysis routes
router.get('/analysis', requireAuth, CharacterAnalysisController.index);
router.get('/analysis/create', requireAuth, CharacterAnalysisController.create);
router.post('/analysis', requireAuth, CharacterAnalysisController.analyze);

module.exports = router;