const Database = require('../config/database');

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // CRUD Operations - Create
    async create(data) {
        try {
            const connection = await Database.getConnection();
            const fields = Object.keys(data).join(', ');
            const placeholders = Object.keys(data).map(() => '?').join(', ');
            const values = Object.values(data);

            const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
            const [result] = await connection.execute(query, values);
            await connection.end();
            
            return result.insertId;
        } catch (error) {
            console.error('Create error:', error);
            throw error;
        }
    }

    // CRUD Operations - Read
    async findAll(conditions = {}) {
        try {
            const connection = await Database.getConnection();
            let query = `SELECT * FROM ${this.tableName}`;
            let values = [];

            if (Object.keys(conditions).length > 0) {
                const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
                query += ` WHERE ${whereClause}`;
                values = Object.values(conditions);
            }

            const [rows] = await connection.execute(query, values);
            await connection.end();
            
            return rows;
        } catch (error) {
            console.error('Find all error:', error);
            throw error;
        }
    }

    async findById(id) {
        try {
            const connection = await Database.getConnection();
            const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            const [rows] = await connection.execute(query, [id]);
            await connection.end();
            
            return rows[0] || null;
        } catch (error) {
            console.error('Find by ID error:', error);
            throw error;
        }
    }

    // CRUD Operations - Update
    async update(id, data) {
        try {
            const connection = await Database.getConnection();
            const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(data), id];

            const query = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;
            const [result] = await connection.execute(query, values);
            await connection.end();
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Update error:', error);
            throw error;
        }
    }

    // CRUD Operations - Delete
    async delete(id) {
        try {
            const connection = await Database.getConnection();
            const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
            const [result] = await connection.execute(query, [id]);
            await connection.end();
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    }

    // Mathematics function - Calculate statistics
    async getStatistics() {
        try {
            const connection = await Database.getConnection();
            const query = `
                SELECT 
                    COUNT(*) as total_records,
                    MIN(id) as min_id,
                    MAX(id) as max_id,
                    AVG(id) as avg_id
                FROM ${this.tableName}
            `;
            const [rows] = await connection.execute(query);
            await connection.end();
            
            return rows[0];
        } catch (error) {
            console.error('Statistics error:', error);
            throw error;
        }
    }
}

module.exports = BaseModel;