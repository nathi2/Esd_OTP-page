const db = require('../config/db');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Enter login credentials' });

    try {
        // Query to get the user by email
        const [rows] = await db.query(
            `SELECT u.*, r.roleName, d.dept_name 
            FROM users u 
            LEFT JOIN roles r ON u.roleID = r.roleID 
            LEFT JOIN department d ON u.departmentID = d.ID 
            WHERE u.email = ?`, 
            [email]
        );

        if (rows.length === 0) return res.status(404).json({ message: 'User does not exist' });

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(401).json({ message: 'Incorrect password' });

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                roleName: user.roleName,
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Send response
        res.header('Authorization', `Bearer ${token}`).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login };
