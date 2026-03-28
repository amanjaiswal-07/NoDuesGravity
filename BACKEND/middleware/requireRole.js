/**
 * Middleware factory: checks that req.user.role is in the allowed roles list.
 * Use after verifyToken.
 *
 * @param {...string} roles - allowed roles, e.g. 'admin', 'staff', 'student'
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: insufficient role' });
        }
        next();
    };
}

module.exports = requireRole;
