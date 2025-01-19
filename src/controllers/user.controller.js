const User = require('../models/user.model');
const Dashboard = require('../models/dashboard.model');

// Create a new user
// exports.createUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         if (!username || !email || !password) {
//             return res.status(400).send({ error: 'Please provide all required fields' });
//         }

//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).send({ error: 'User already exists' });
//         }

//         const user = new User({
//             username,
//             email,
//             password,
//         });

//         await user.save();
//         res.status(201).send({ message: 'User created successfully' });
//     } catch (error) {
//         res.status(400).send(error);
//     }
// };

// Login a user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).send({ error: 'Please provide all required fields' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: 'User already exists' });
        }

        // Create and save the new user
        const user = new User({
            username,
            email,
            password,
        });

        await user.save();

        // Create a new dashboard entry for the user
        const dashboard = new Dashboard({
            userId: user._id, // Link the dashboard to the user
            email: user.email, // Store the user's email in the dashboard
            metrics: {
                profit: { value: 0, increase: "0%" },
                sales: { value: 0, increase: "0%" },
                payments: { value: 0, decrease: "0%" },
                transactions: { value: 0, increase: "0%" },
            },
            charts: {
                totalRevenue: { labels: [], data: [] },
                growth: { labels: [], data: [] },
                profileReport: { labels: [], data: [], increase: "0%" },
            },
            orders: {
                totalOrders: 0,
                categories: [],
            },
            transactions: [],
            orderStatistics: {
                totalSales: 0,
                totalOrders: 0,
                categories: [],
            },
            badges: [],
        });

        await dashboard.save();

        res.status(201).send({ message: 'User and dashboard created successfully', user, dashboard });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ error: 'Please provide email and password' });
        }

        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        });

        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Logout a user
exports.logoutUser = async (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to logout' });
    }
};