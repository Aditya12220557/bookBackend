const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user to the request object
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;