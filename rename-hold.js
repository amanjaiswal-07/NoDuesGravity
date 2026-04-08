const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

const REPLACEMENTS = [
    // Specific exact phrases first
    { from: /"Your request has been rejected"/g, to: '"Your request is currently on hold. Please review the details and take necessary action."' },
    { from: /"Rejected steps will be reset"/g, to: '"Steps on hold will be reviewed again after you resubmit."' },
    { from: /"One or more departments have rejected your request"/g, to: '"One or more departments have placed your request on hold"' },
    { from: /"Reject Reason"/g, to: '"Reason for Hold"' },
    { from: /"Reject Description"/g, to: '"Additional Details"' },
    { from: /"Move to Rejected"/gi, to: '"Move to On Hold"' },
    { from: /"Rejected Requests"/gi, to: '"Requests On Hold"' },
    { from: /"Confirm Reject"/gi, to: '"Confirm Hold"' },
    { from: /"Reject Request"/gi, to: '"Put Request On Hold"' },
    { from: /"Reject /g, to: '"Put ' }, // e.g. "Reject HOD Clearance" -> "Put HOD Clearance On Hold" (needs careful handling, see next)
    { from: /title="Reject (.*?)"/g, to: 'title="Put $1 On Hold"' },
    { from: /"Rejected by:/gi, to: '"Put on hold by:"' },
    { from: /"No rejected requests"/g, to: '"No requests on hold"' },
    { from: />Reject</g, to: '>Put On Hold<' },
    { from: />Rejected</g, to: '>On Hold<' },
    { from: />REJECTED</g, to: '>ON HOLD<' },
    { from: /rejectLabel="Reject"/g, to: 'rejectLabel="Put On Hold"' },
    { from: /rejectLabel = "Reject"/g, to: 'rejectLabel = "Put On Hold"' },
    { from: /label: "Rejected"/g, to: 'label: "On Hold"' },
    { from: /"Rejected students/g, to: '"Students on hold' },
    { from: /student to rejected/g, to: 'student to on hold' },
    { from: /"Action Required — Rejection Received"/g, to: '"Action Required — Placed On Hold"' },
    { from: /status === "rejected" \? "rejected"/g, to: 'status === "rejected" ? "on hold"' }, // Note: keeping status backend data intact
];

async function run() {
    const dir = path.join(__dirname, 'FRONTEND', 'NoDues', 'src');
    const files = await getFiles(dir);

    for (const file of files) {
        if (!file.endsWith('.jsx') && !file.endsWith('.js') && !file.endsWith('.tsx')) continue;

        const originalContent = await readFile(file, 'utf8');
        let newContent = originalContent;

        for (const rule of REPLACEMENTS) {
            newContent = newContent.replace(rule.from, rule.to);
        }

        // Additional case for StudentTrack: "On Hold" instead of "Action Required" for overall status?
        // User said: If any rejected -> "Action Required". So we keep Action Required.

        // Additional case for Main.jsx headerLabels where it says "Rejected" as tab name
        // e.g. `headerLabels={["Pending", "Approved", "Rejected"]}` -> `... "On Hold"]}`
        newContent = newContent.replace(/headerLabels=\{\["Pending", "Approved", "Rejected"\]\}/g, 'headerLabels={["Pending", "Approved", "On Hold"]}');

        if (newContent !== originalContent) {
            await writeFile(file, newContent, 'utf8');
            console.log(`Updated: ${path.basename(file)}`);
        }
    }
}

run().catch(console.error);
