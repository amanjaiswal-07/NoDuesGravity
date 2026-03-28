/**
 * workflowService.js
 *
 * Creates all ClearanceStep documents when a student submits a NoDuesRequest.
 * All applicable steps are created upfront:
 *   - Independent steps → status: 'pending'
 *   - Dependent steps   → status: 'locked'
 */

const ClearanceStep = require('../models/ClearanceStep');
const StepActionLog = require('../models/StepActionLog');
const { getApplicableUnitCodes, getDependenciesForUnit } = require('../config/workflowConfig');
const { ALL_UNIT_CODES } = require('../config/permissionCodes');

/**
 * Creates all clearance steps for a newly submitted NoDuesRequest.
 *
 * @param {object} request - NoDuesRequest document
 * @returns {Promise<ClearanceStep[]>} - created steps
 */
async function createClearanceSteps(request) {
    const { _id: requestId, branch } = request;
    const applicableUnits = getApplicableUnitCodes(branch);

    const stepsToCreate = [];

    for (const unitCode of applicableUnits) {
        const deps = getDependenciesForUnit(unitCode, branch);
        const status = deps.length === 0 ? 'pending' : 'locked';
        const unitInfo = ALL_UNIT_CODES[unitCode] || { label: unitCode };

        stepsToCreate.push({
            requestId,
            unitCode,
            unitLabel: unitInfo.label || unitCode,
            unitGroup: unitInfo.group || null,   // e.g. 'labs_cse_cce' — null for non-lab steps
            status,
            dependsOn: deps,
        });
    }

    // Bulk insert all steps
    const createdSteps = await ClearanceStep.insertMany(stepsToCreate);

    // Log every step creation
    const logs = createdSteps.map(step => ({
        stepId: step._id,
        requestId,
        action: 'created',
        actorEmail: 'system',
        actorRole: 'system',
        note: `Step created with status: ${step.status}`,
    }));

    await StepActionLog.insertMany(logs);

    return createdSteps;
}

module.exports = { createClearanceSteps };
