const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verifies a Google ID token and returns the decoded payload.
 * @param {string} idToken
 * @returns {Promise<{email: string, name: string, picture: string}>}
 */
async function verifyGoogleToken(idToken) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        email: payload.email,
        name: payload.name || payload.email,
        picture: payload.picture || '',
    };
}

module.exports = { verifyGoogleToken };
