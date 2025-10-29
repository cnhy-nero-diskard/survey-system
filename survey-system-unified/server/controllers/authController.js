// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import logger from '../middleware/logger.js';
import dotenv from 'dotenv';
dotenv.config();
export const login = async (req, res, next) => {
    const { username, password } = req.body;
    logger.info(`POST /api/auth/login for username: ${username}`);

    try {
        const result = await pool.query('SELECT * FROM admin_table WHERE username = $1', [username]);
        const admin = result.rows[0];
        if (!admin) {
            logger.warn(`Admin with username ${username} not found`);
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        const validPassword = await bcrypt.compare(password, admin.e_password);
        if (!validPassword) {
            logger.warn(`Invalid password for admin with username ${username}`);
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, {
            expiresIn: '3h',
        });

        await pool.query('UPDATE admin_table SET last_login = NOW(), is_logged_in = TRUE WHERE username = $1', [username]);

        const cookieOptions = {
            httpOnly: true,
            secure: false,     //TRUE IF IN PRODUCTION
            // sameSite: 'none', // UNCOMMENT THIS WHEN YOU'RE DEPLOYING THIS in production
            maxAge: 18000000, // 5 hours expiration
            path: '/',
        };

        logger.info('Cookie options:', cookieOptions);

        res.cookie('token', token, cookieOptions).status(200).send('Logged in successfully');

        logger.info('Response Headers:', res.getHeaders());
    } catch (err) {
        logger.error('Error during login:', err);
        next(err);
    }
};
export const logout = async (req, res, next) => {
    logger.info('POST /api/auth/logout');
    const { username } = req.user; // Assuming the user is attached to the request by the auth middleware

    try {
        const result = await pool.query('SELECT last_login FROM admin_table WHERE username = $1', [username]);
        const lastLogin = result.rows[0].last_login;

        const sessionDuration = Math.floor((new Date() - lastLogin) / 1000); // Duration in seconds

        await pool.query('UPDATE admin_table SET last_logout = NOW(), session_duration = $1, is_logged_in = FALSE WHERE username = $2', [sessionDuration, username]);

        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',

        }).status(200).send('Logged out successfully');

    } catch (err) {
        next(err);
    }
}; export const registerAdmin = async (req, res) => {
    const { username, password, email } = req.body;
    logger.info(`POST /api/auth/register for password: ${password} and username: ${username}    email: ${email}`);
    try {
        // Hash the password
        logger.info('Hashing password');
        const saltRounds = 10; // Number of salt rounds for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        logger.info('Password hashed');

        // Insert the admin into the database
        try {
            const query = `
        INSERT INTO admin_table (username, e_password, gmail)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
            const values = [username, hashedPassword, email];
            const result = await pool.query(query, values);
            res.json(`Admin successfully registered with username: ${username}`);
            return result.rows[0]; // Return the newly created admin

        } catch (error) {
            logger.error('Error registering admin:', error);
        }
    } catch (err) {
        logger.error('Error registering admin:', err);
        throw err; // Pass the error to the caller
    }
};

export const checkAuth = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token || typeof token !== 'string' || token.trim() === '') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Authenticated', user: decoded });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired.' });
        }
        res.status(400).json({ error: 'Unauthorized' });
    }
};