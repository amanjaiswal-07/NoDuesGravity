const mongoose = require('mongoose');

const clearanceStepSchema = new mongoose.Schema(
    {
        requestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NoDuesRequest',
            required: true,
        },
        // Approval unit this step belongs to, e.g. "medical", "cse_lab_1", "library_librarian"
        unitCode: { type: String, required: true },
        // Human-readable label shown in UI
        unitLabel: { type: String, required: true },
        // Lab group code (e.g. 'labs_cse_cce') — null for non-lab steps
        unitGroup: { type: String, default: null },

        // ── Status Machine ────────────────────────────────────────────────────────
        // locked   → waiting for dependsOn steps to be approved
        // pending  → ready for department staff to act
        // approved → cleared
        // rejected → department rejected; student must reply before it goes back to pending
        status: {
            type: String,
            enum: ['locked', 'pending', 'approved', 'rejected'],
            default: 'locked',
        },

        // List of unitCodes that must be 'approved' before this step unlocks
        dependsOn: { type: [String], default: [] },

        // ── Staff Action ──────────────────────────────────────────────────────────
        actionBy: { type: String, default: '' },        // staff email
        actionAt: { type: Date },
        rejectionReason: { type: String, default: '' },

        // ── Student Reply (after rejection) ───────────────────────────────────────
        studentReply: { type: String, default: '' },
        studentProofUrls: { type: [String], default: [] },  // Cloudinary URLs
        repliedAt: { type: Date },
    },
    { timestamps: true }
);

// Fast queries: "all pending steps for unitCode=medical"
clearanceStepSchema.index({ unitCode: 1, status: 1 });
// Fast queries: "all steps for a request"
clearanceStepSchema.index({ requestId: 1 });

module.exports = mongoose.model('ClearanceStep', clearanceStepSchema);
