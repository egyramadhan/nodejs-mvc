const BaseModel = require('./BaseModel');
const bcrypt = require('bcryptjs');

class User extends BaseModel {
    constructor() {
        super('users');
    }

    async authenticate(username, password) {
        try {
            const users = await this.findAll({ username });
            
            if (users.length === 0) {
                return null;
            }

            const user = users[0];
            const isValid = await bcrypt.compare(password, user.password);
            
            if (isValid) {
                // Remove password from returned user object
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }
            
            return null;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            // Hash password before storing
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const userDataWithHashedPassword = {
                ...userData,
                password: hashedPassword
            };
            
            return await this.create(userDataWithHashedPassword);
        } catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    }
}

module.exports = User;