const Product = require('../models/Product');

class ProductController {
    static async index(req, res) {
        try {
            const productModel = new Product();
            const products = await productModel.findAll();
            const inventoryStats = await productModel.calculateInventoryValue();
            
            res.render('products/index', {
                user: req.session.user,
                products,
                inventoryStats
            });
        } catch (error) {
            console.error('Products index error:', error);
            res.render('products/index', {
                user: req.session.user,
                products: [],
                inventoryStats: { totalValue: 0, totalProducts: 0 },
                error: 'Failed to load products'
            });
        }
    }

    static async create(req, res) {
        res.render('products/create', { user: req.session.user, error: null });
    }

    static async store(req, res) {
        try {
            const { name, description, price, stock } = req.body;
            const productModel = new Product();
            
            await productModel.create({
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock)
            });
            
            res.redirect('/products');
        } catch (error) {
            console.error('Product store error:', error);
            res.render('products/create', {
                user: req.session.user,
                error: 'Failed to create product'
            });
        }
    }

    static async edit(req, res) {
        try {
            const productModel = new Product();
            const product = await productModel.findById(req.params.id);
            
            if (!product) {
                return res.redirect('/products');
            }
            
            res.render('products/edit', {
                user: req.session.user,
                product,
                error: null
            });
        } catch (error) {
            console.error('Product edit error:', error);
            res.redirect('/products');
        }
    }

    static async update(req, res) {
        try {
            const { name, description, price, stock } = req.body;
            const productModel = new Product();
            
            await productModel.update(req.params.id, {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock)
            });
            
            res.redirect('/products');
        } catch (error) {
            console.error('Product update error:', error);
            res.redirect('/products');
        }
    }

    static async delete(req, res) {
        try {
            const productModel = new Product();
            await productModel.delete(req.params.id);
            res.redirect('/products');
        } catch (error) {
            console.error('Product delete error:', error);
            res.redirect('/products');
        }
    }
}

module.exports = ProductController;