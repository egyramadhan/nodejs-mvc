const BaseModel = require('./BaseModel');

class Product extends BaseModel {
    constructor() {
        super('products');
    }

    // Nested loops and mathematics - Calculate total inventory value
    async calculateInventoryValue() {
        try {
            const products = await this.findAll();
            let totalValue = 0;
            let categoryStats = {};

            // Nested loop example
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const productValue = product.price * product.stock;
                totalValue += productValue;

                // Nested if example
                if (product.price > 0) {
                    if (product.stock > 0) {
                        if (product.price > 100) {
                            if (!categoryStats.expensive) {
                                categoryStats.expensive = { count: 0, value: 0 };
                            }
                            categoryStats.expensive.count++;
                            categoryStats.expensive.value += productValue;
                        } else {
                            if (!categoryStats.affordable) {
                                categoryStats.affordable = { count: 0, value: 0 };
                            }
                            categoryStats.affordable.count++;
                            categoryStats.affordable.value += productValue;
                        }
                    }
                }
            }

            return {
                totalValue,
                totalProducts: products.length,
                categoryStats,
                averageValue: products.length > 0 ? totalValue / products.length : 0
            };
        } catch (error) {
            console.error('Calculate inventory value error:', error);
            throw error;
        }
    }

    async searchProducts(searchTerm) {
        try {
            const connection = await require('../config/database').getConnection();
            const query = `
                SELECT * FROM ${this.tableName} 
                WHERE name LIKE ? OR description LIKE ?
                ORDER BY name
            `;
            const searchPattern = `%${searchTerm}%`;
            const [rows] = await connection.execute(query, [searchPattern, searchPattern]);
            await connection.end();
            
            return rows;
        } catch (error) {
            console.error('Search products error:', error);
            throw error;
        }
    }
}

module.exports = Product;