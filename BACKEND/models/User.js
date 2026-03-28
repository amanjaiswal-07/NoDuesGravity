const mongoose = require('mongoose');

/**
 * User — auth/permissions only.
 * Student profile data lives in EligibleStudent, NOT here.
 * Staff/admin data lives here with permissionCodes.
 */
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        // e.g. ["student"], ["medical"], ["library_staff", "library_librarian"], ["admin"]
        permissionCodes: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
