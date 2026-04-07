/**
 * One-time repair script: find and re-lock any ClearanceStep records that are
 * in 'pending' status but have one or more dependsOn prerequisites that are NOT
 * 'approved'.  This fixes stale data created before relockDependents was added.
 *
 * Run once: node scripts/repair-stale-pending.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const ClearanceStep = require('../models/ClearanceStep');

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all pending steps that have at least one dependency
    const pendingWithDeps = await ClearanceStep.find({
        status: 'pending',
        dependsOn: { $exists: true, $not: { $size: 0 } },
    });

    console.log(`Found ${pendingWithDeps.length} pending steps with dependencies`);

    // Group by requestId so we fetch siblings once per request
    const byRequest = {};
    for (const step of pendingWithDeps) {
        const rid = String(step.requestId);
        if (!byRequest[rid]) byRequest[rid] = [];
        byRequest[rid].push(step);
    }

    let totalRelocked = 0;

    for (const [rid, steps] of Object.entries(byRequest)) {
        // Get all sibling step statuses for this request
        const siblings = await ClearanceStep.find({ requestId: rid });
        const statusMap = {};
        for (const s of siblings) statusMap[s.unitCode] = s.status;

        for (const step of steps) {
            const depsAllApproved = step.dependsOn.every(dep => statusMap[dep] === 'approved');
            if (!depsAllApproved) {
                const missingDeps = step.dependsOn.filter(dep => statusMap[dep] !== 'approved');
                console.log(`  Re-locking ${step.unitCode} (request ${rid}) — unmet deps: ${missingDeps.join(', ')}`);
                await ClearanceStep.findByIdAndUpdate(step._id, {
                    $set: {
                        status: 'locked',
                        rejectionReason: '',
                        rejectionDescription: '',
                        rejectedAt: null,
                        restartFrom: [],
                    },
                });
                totalRelocked++;
            }
        }
    }

    console.log(`\nDone. ${totalRelocked} steps re-locked.`);
    await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
