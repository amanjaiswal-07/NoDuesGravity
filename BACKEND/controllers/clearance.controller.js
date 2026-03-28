const ClearanceStep = require('../models/ClearanceStep');
const StepActionLog = require('../models/StepActionLog');
const NoDuesRequest = require('../models/NoDuesRequest');
const User = require('../models/User');
const { ROUTE_TO_PERMISSION } = require('../config/permissionCodes');
const { unlockDependents, syncRequestStatus } = require('../services/dependencyEngine');

// ── GET Pending / Approved / Rejected ──────────────────────────────────────────

/**
 * Returns steps for a given unitCode filtered by status.
 * Requires `req.hasPermissionFor(unitCode)` via `attachPermissionChecker` middleware.
 */
async function getStepsByStatus(req, res, status) {
    try {
        const { unitCode } = req.query;
        if (!unitCode) return res.status(400).json({ error: 'unitCode query param is required' });

        if (!req.hasPermissionFor(unitCode)) {
            return res.status(403).json({ error: `Not authorized for unitCode: ${unitCode}` });
        }

        // Populate request details so frontend can show student name, roll, etc.
        const steps = await ClearanceStep.find({ unitCode, status })
            .populate('requestId')
            .sort({ updatedAt: -1 });

        res.json({ steps });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getPending(req, res) { return getStepsByStatus(req, res, 'pending'); }
async function getApproved(req, res) { return getStepsByStatus(req, res, 'approved'); }
async function getRejected(req, res) { return getStepsByStatus(req, res, 'rejected'); }

// ── Approve & Reject ──────────────────────────────────────────────────────────

async function approveStep(req, res) {
    try {
        const { stepId } = req.params;
        const step = await ClearanceStep.findById(stepId);
        if (!step) return res.status(404).json({ error: 'Step not found' });

        if (!req.hasPermissionFor(step.unitCode)) {
            return res.status(403).json({ error: 'Not authorized for this step' });
        }
        if (step.status !== 'pending' && step.status !== 'rejected') {
            return res.status(400).json({ error: `Cannot approve step in '${step.status}' state` });
        }

        // Update step
        step.status = 'approved';
        step.actionBy = req.user.email;
        step.actionAt = new Date();
        await step.save();

        // Log action
        await StepActionLog.create({
            stepId: step._id,
            requestId: step.requestId,
            action: 'approved',
            actorEmail: req.user.email,
            actorRole: req.user.role,
        });

        // Run dependency engine: unlock downstream steps + sync request status
        const unlockedCodes = await unlockDependents(step.requestId);

        res.json({ message: 'Step approved', unlockedCodes, step });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function rejectStep(req, res) {
    try {
        const { stepId } = req.params;
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ error: 'Rejection reason is required' });

        const step = await ClearanceStep.findById(stepId);
        if (!step) return res.status(404).json({ error: 'Step not found' });

        if (!req.hasPermissionFor(step.unitCode)) {
            return res.status(403).json({ error: 'Not authorized for this step' });
        }
        if (step.status !== 'pending') {
            return res.status(400).json({ error: `Cannot reject step in '${step.status}' state` });
        }

        // Update step
        step.status = 'rejected';
        step.actionBy = req.user.email;
        step.actionAt = new Date();
        step.rejectionReason = reason;
        await step.save();

        // Log action
        await StepActionLog.create({
            stepId: step._id,
            requestId: step.requestId,
            action: 'rejected',
            actorEmail: req.user.email,
            actorRole: 'staff',
            note: reason,
        });

        // Sync request status (will become 'action_required')
        await syncRequestStatus(step.requestId);

        res.json({ message: 'Step rejected', step });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function bulkApprove(req, res) {
    try {
        const { stepIds } = req.body;
        if (!Array.isArray(stepIds) || stepIds.length === 0) {
            return res.status(400).json({ error: 'stepIds array is required' });
        }

        const steps = await ClearanceStep.find({ _id: { $in: stepIds } });
        const approvedSteps = [];
        const requestIds = new Set(); // to run dependency engine later

        for (const step of steps) {
            if (!req.hasPermissionFor(step.unitCode)) continue;
            if (step.status !== 'pending' && step.status !== 'rejected') continue;

            step.status = 'approved';
            step.actionBy = req.user.email;
            step.actionAt = new Date();
            await step.save();

            await StepActionLog.create({
                stepId: step._id,
                requestId: step.requestId,
                action: 'approved',
                actorEmail: req.user.email,
                actorRole: 'staff',
            });

            approvedSteps.push(step._id);
            requestIds.add(step.requestId.toString());
        }

        // Run dependency engine for all affected requests
        for (const rid of requestIds) {
            await unlockDependents(rid);
        }

        res.json({ message: `Bulk approved ${approvedSteps.length} steps`, approvedSteps });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ── GET Step Details (History) ───────────────────────────────────────────────

async function getStepDetails(req, res) {
    try {
        const { stepId } = req.params;
        const step = await ClearanceStep.findById(stepId).populate('requestId');
        if (!step) return res.status(404).json({ error: 'Step not found' });

        if (!req.hasPermissionFor(step.unitCode)) {
            return res.status(403).json({ error: 'Not authorized for this step' });
        }

        // Fetch full history tail
        const history = await StepActionLog.find({ stepId }).sort({ timestamp: 1 });

        res.json({ step, history });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ── Department Staff Access Management ────────────────────────────────────────

async function getDepartmentAccess(req, res) {
    try {
        const { unitCode } = req.params;
        if (!req.hasPermissionFor(unitCode)) {
            return res.status(403).json({ error: `Not authorized for unitCode: ${unitCode}` });
        }

        // Find users who have this specific unitCode in their permissionCodes
        const users = await User.find({ permissionCodes: unitCode }).sort({ createdAt: -1 });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function addDepartmentAccess(req, res) {
    try {
        const { unitCode } = req.params;
        if (!req.hasPermissionFor(unitCode)) {
            return res.status(403).json({ error: `Not authorized to add access to ${unitCode}` });
        }

        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'name and email are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
            if (!user.permissionCodes.includes(unitCode)) {
                user.permissionCodes.push(unitCode);
                await user.save();
            }
            return res.json({ message: 'Permission added to existing user', user });
        }

        // Create new staff user
        user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            permissionCodes: [unitCode],
        });

        res.status(201).json({ message: 'Staff access added', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function editDepartmentAccess(req, res) {
    try {
        const { unitCode, userId } = req.params;
        if (!req.hasPermissionFor(unitCode)) {
            return res.status(403).json({ error: `Not authorized to edit access in ${unitCode}` });
        }

        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'name and email are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingEmailUser = await User.findOne({ email: normalizedEmail });

        if (existingEmailUser && existingEmailUser.id !== userId) {
            return res.status(409).json({ error: 'Email already exists. Please use a different email or merge permissions.' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.name = name.trim();
        user.email = normalizedEmail;
        await user.save();

        res.json({ message: 'Department access updated', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function removeDepartmentAccess(req, res) {
    try {
        const { unitCode, userId } = req.params;
        if (!req.hasPermissionFor(unitCode)) {
            return res.status(403).json({ error: `Not authorized to remove access from ${unitCode}` });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Remove just this unitCode from the user's permissions
        user.permissionCodes = user.permissionCodes.filter(c => c !== unitCode);

        if (user.permissionCodes.length === 0) {
            // If they have no permissions left, we can delete them
            await User.findByIdAndDelete(userId);
            res.json({ message: 'User record deleted as they have no remaining permissions' });
        } else {
            await user.save();
            res.json({ message: 'Permission removed from user', user });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getPending, getApproved, getRejected,
    approveStep, rejectStep, bulkApprove, getStepDetails,
    getDepartmentAccess, addDepartmentAccess, editDepartmentAccess, removeDepartmentAccess,
};
