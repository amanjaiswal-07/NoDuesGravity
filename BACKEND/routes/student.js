const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');
const upload = require('../config/multer');
const studentController = require('../controllers/student.controller');

// All student routes require authentication + 'student' role
router.use(verifyToken, requireRole('student'));

// ── Profile ────────────────────────────────────────────────────────────────────
router.get('/profile', studentController.getProfile);

router.post(
    '/profile',
    upload.fields([
        { name: 'idCardFile', maxCount: 1 },
        { name: 'btpReportFile', maxCount: 1 },
        { name: 'offerLetterFile', maxCount: 1 },
        { name: 'placementDeclarationFile', maxCount: 1 },
        { name: 'admissionLetterFile', maxCount: 1 },
        { name: 'examScorecardFile', maxCount: 1 },
        { name: 'cancelledChequeFile', maxCount: 1 },
    ]),
    studentController.updateProfile
);

// ── In-App File Viewer Proxy ───────────────────────────────────────────────────
// Returns file content via backend proxy — Cloudinary URL never exposed to frontend
router.get('/file/:fieldName', studentController.getStudentFile);

// ── Apply ──────────────────────────────────────────────────────────────────────
router.post('/apply', studentController.applyForNoDues);

// ── Tracking ───────────────────────────────────────────────────────────────────
router.get('/request', studentController.getActiveRequest);
router.get('/request/:requestId/steps', studentController.getRequestSteps);

// ── Reply to Rejection ─────────────────────────────────────────────────────────
router.post(
    '/request/steps/:stepId/reply',
    upload.array('proofs', 5),
    studentController.replyToRejectedStep
);

module.exports = router;
