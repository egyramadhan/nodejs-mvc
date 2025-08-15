const Product = require('../models/Product');
const CharacterAnalysis = require('../models/CharacterAnalysis');

class DashboardController {
    static async index(req, res) {
        try {
            const productModel = new Product();
            const analysisModel = new CharacterAnalysis();
            
            const products = await productModel.findAll();
            const recentAnalyses = await analysisModel.findAll();
            const inventoryStats = await productModel.calculateInventoryValue();
            
            res.render('dashboard/index', {
                user: req.session.user,
                products: products.slice(0, 5), // Show only first 5 products
                recentAnalyses: recentAnalyses.slice(-5).reverse(), // Show last 5 analyses
                inventoryStats
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.render('dashboard/index', {
                user: req.session.user,
                products: [],
                recentAnalyses: [],
                inventoryStats: { totalValue: 0, totalProducts: 0 },
                error: 'Failed to load dashboard data'
            });
        }
    }
}

module.exports = DashboardController;