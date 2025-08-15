const User = require('../models/User');

class AuthController {
    static async showLogin(req, res) {
        res.render('auth/login', { error: null });
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const userModel = new User();
            const user = await userModel.authenticate(username, password);

            if (user) {
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.render('auth/login', { error: 'Invalid username or password' });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', { error: 'Login failed. Please try again.' });
        }
    }

    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
            }
            res.redirect('/login');
        });
    }
}

module.exports = AuthController;