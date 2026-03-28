const { verifyToken: verify } = require('../utils/jwt');

/**
 * Middleware: extracts JWT from Authorization header, verifies it,
 * and attaches decoded user to req.user.
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        req.user = verify(token);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

module.exports = verifyToken;
