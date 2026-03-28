const mongoose = require('mongoose');

const noDuesRequestSchema = new mongoose.Schema(
    {
        // ── Identity ──────────────────────────────────────────────────────────────
        studentEmail: { type: String, required: true, lowercase: true },
        studentName: { type: String, required: true },
        rollNo: { type: String, required: true },
        branch: { type: String, required: true },

        // ── Profile fields (student fills at apply time) ──────────────────────────
        phone: { type: String, default: '' },
        hostel: { type: String, default: '' },
        idCardUrl: { type: String, default: '' },           // Cloudinary URL
        btpReportEmailDate: { type: String, default: '' },  // date string
        btpReportUrl: { type: String, default: '' },        // Cloudinary URL

        // Placement
        placementStatus: {
            type: String,
            default: '',
        },
        offerLetterUrl: { type: String, default: '' },
        declarationUrl: { type: String, default: '' },
        admissionLetterUrl: { type: String, default: '' },
        examScorecardUrl: { type: String, default: '' },

        // Library
        rfidStatus: {
            type: String,
            enum: ['verified', 'pending'],
            default: 'pending',
        },

        // ── Request State ─────────────────────────────────────────────────────────
        status: {
            type: String,
            enum: ['submitted', 'in_progress', 'action_required', 'approved'],
            default: 'submitted',
        },
        submittedAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

// Useful index for fast student lookups
noDuesRequestSchema.index({ studentEmail: 1, status: 1 });

module.exports = mongoose.model('NoDuesRequest', noDuesRequestSchema);
