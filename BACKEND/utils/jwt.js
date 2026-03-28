const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRY = process.env.JWT_EXPIRY || '15h';

/**
 * Signs a JWT.
 * @param {object} payload - { id, email, role, permissionCodes, redirectRoute }
 * @returns {string} token
 */
function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRY });
}

/**
 * Verifies and decodes a JWT.
 * @param {string} token
 * @returns {object} decoded payload
 * @throws if invalid/expired
 */
function verifyToken(token) {
    return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
