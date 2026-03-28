const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
// requireRole has been removed in favor of strict unitCode permission checking
const { attachPermissionChecker } = require('../middleware/requirePermission');
const clearanceController = require('../controllers/clearance.controller');

// All clearance routes require authentication. Specific unitCode authorization happens in attachPermissionChecker
router.use(verifyToken);

// Middleware that supplies req.hasPermissionFor(unitCode)
router.use(attachPermissionChecker);

// GET lists (requires ?unitCode=xyz)
router.get('/pending', clearanceController.getPending);
router.get('/approved', clearanceController.getApproved);
router.get('/rejected', clearanceController.getRejected);

// Actions
router.post('/bulk-approve', clearanceController.bulkApprove);
router.post('/:stepId/approve', clearanceController.approveStep);
router.post('/:stepId/reject', clearanceController.rejectStep);

// Department Staff Access Management
router.get('/:unitCode/access', clearanceController.getDepartmentAccess);
router.post('/:unitCode/access', clearanceController.addDepartmentAccess);
router.put('/:unitCode/access/:userId', clearanceController.editDepartmentAccess);
router.delete('/:unitCode/access/:userId', clearanceController.removeDepartmentAccess);

// Details & History
router.get('/:stepId/details', clearanceController.getStepDetails);

module.exports = router;
