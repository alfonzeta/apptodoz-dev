const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Extract token from header
    if (!token) return res.status(401).json({ ok: false, message: 'No token provided' });

    jwt.verify(token, process.env.SEED, (err, user) => {
        if (err) return res.status(403).json({ ok: false, message: 'Invalid token' });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
