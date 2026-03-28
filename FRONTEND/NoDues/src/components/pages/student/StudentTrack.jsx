import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../../api/client";

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  approved: {
    dot: "bg-emerald-400",
    card: "border-emerald-400/40 bg-emerald-500/10",
    text: "text-emerald-200",
    badge: "bg-emerald-500/20 text-emerald-300",
    label: "Approved",
  },
  rejected: {
    dot: "bg-red-400",
    card: "border-red-400/40 bg-red-500/10",
    text: "text-red-200",
    badge: "bg-red-500/20 text-red-300",
    label: "Rejected",
  },
  pending: {
    dot: "bg-amber-400",
    card: "border-amber-400/40 bg-amber-500/10",
    text: "text-amber-200",
    badge: "bg-amber-500/20 text-amber-300",
    label: "Pending",
  },
  locked: {
    dot: "bg-white/20",
    card: "border-white/10 bg-white/5",
    text: "text-white/50",
    badge: "bg-white/10 text-white/40",
    label: "Waiting",
  },
};

const cfg = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.locked;

// ── Step Card ─────────────────────────────────────────────────────────────────

function StepCard({ step, isLast }) {
  const c = cfg(step.status);
  return (
    <div className="relative flex gap-4">
      <div className="flex w-8 flex-col items-center">
        <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${c.dot} ring-2 ring-neutral-900`} />
        {!isLast && <div className="mt-2 w-0.5 flex-1 bg-white/10" />}
      </div>
      <div className={`mb-4 flex-1 rounded-xl border p-4 ${c.card}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className={`text-sm font-semibold ${c.text}`}>{step.unitLabel}</p>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>
            {c.label}
          </span>
        </div>
        {step.status === "locked" && (
          <p className="mt-1.5 text-xs text-white/35">Awaiting prerequisite approvals</p>
        )}
        {step.rejectionNote && (
          <p className={`mt-2 border-t border-white/10 pt-2 text-xs italic ${c.text} opacity-80`}>
            Reason: {step.rejectionNote}
          </p>
        )}
        {step.studentReply && (
          <p className="mt-1 text-xs text-blue-300/80 italic">Your reply: {step.studentReply}</p>
        )}
      </div>
    </div>
  );
}

// ── Group Card (for lab groups) ───────────────────────────────────────────────

function GroupCard({ groupLabel, steps, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const allApproved = steps.every((s) => s.status === "approved");
  const anyRejected = steps.some((s) => s.status === "rejected");
  const groupStatus = allApproved ? "approved" : anyRejected ? "rejected" : steps.some((s) => s.status === "pending") ? "pending" : "locked";
  const c = cfg(groupStatus);
  const approvedCount = steps.filter((s) => s.status === "approved").length;

  return (
    <div className="relative flex gap-4">
      <div className="flex w-8 flex-col items-center">
        <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${c.dot} ring-2 ring-neutral-900`} />
        {!isLast && <div className="mt-2 w-0.5 flex-1 bg-white/10" />}
      </div>
      <div className={`mb-4 flex-1 rounded-xl border ${c.card}`}>
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex w-full flex-wrap items-center justify-between gap-2 p-4 text-left"
        >
          <div>
            <p className={`text-sm font-semibold ${c.text}`}>{groupLabel}</p>
            <p className="mt-0.5 text-xs text-white/40">{approvedCount}/{steps.length} labs approved</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.badge}`}>{c.label}</span>
            <span className="text-white/40 text-xs">{expanded ? "▲" : "▼"}</span>
          </div>
        </button>
        {expanded && (
          <div className="border-t border-white/10 px-4 py-3 space-y-2">
            {steps.map((step) => {
              const sc = cfg(step.status);
              return (
                <div key={step._id} className="flex items-center justify-between gap-2">
                  <p className="text-xs text-white/70">{step.unitLabel}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.badge}`}>{sc.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Group steps by their lab group ────────────────────────────────────────────

const GROUP_LABELS = {
  labs_cse_cce: "CSE / CCE Labs",
  labs_ece_cce: "ECE / CCE Labs",
  labs_mech: "MECH Labs",
  labs_physics: "Physics Labs",
};

function organiseSteps(steps) {
  const grouped = []; // [{type:'group'|'step', ...}]
  const seenGroups = new Set();

  const groupBuckets = {};
  for (const step of steps) {
    const g = step.unitGroup;  // from backend: step.unitGroup = ALL_UNIT_CODES[unitCode].group
    if (g && GROUP_LABELS[g]) {
      if (!groupBuckets[g]) groupBuckets[g] = [];
      groupBuckets[g].push(step);
    }
  }

  // Preserve original order but merge lab steps into group cards
  const ORDER = [
    "medical", "sports", "lucs", "warden", "placement", "administration",
    "library_staff", "library_librarian",
    "labs_cse_cce", "labs_ece_cce", "labs_mech", "labs_physics",
    "hod_cse", "hod_ece", "hod_cce", "hod_mech",
    "nad", "store", "accounts",
  ];

  const stepByCode = {};
  for (const s of steps) stepByCode[s.unitCode] = s;

  const used = new Set();

  for (const code of ORDER) {
    if (GROUP_LABELS[code] && groupBuckets[code]) {
      if (!seenGroups.has(code)) {
        seenGroups.add(code);
        grouped.push({ type: "group", code, label: GROUP_LABELS[code], steps: groupBuckets[code] });
        groupBuckets[code].forEach((s) => used.add(s._id));
      }
    } else if (stepByCode[code] && !used.has(stepByCode[code]._id)) {
      grouped.push({ type: "step", step: stepByCode[code] });
      used.add(stepByCode[code]._id);
    }
  }

  // Append any remaining steps not in the ORDER list
  for (const s of steps) {
    if (!used.has(s._id)) grouped.push({ type: "step", step: s });
  }

  return grouped;
}

// ── Overall status pill ───────────────────────────────────────────────────────

function OverallStatusBanner({ status }) {
  const map = {
    approved: { bg: "border-emerald-400/30 bg-emerald-500/10", text: "text-emerald-200", label: "All Cleared" },
    action_required: { bg: "border-red-400/30 bg-red-500/10", text: "text-red-200", label: "Action Required" },
    in_progress: { bg: "border-amber-400/30 bg-amber-500/10", text: "text-amber-200", label: "In Progress" },
    submitted: { bg: "border-blue-400/30 bg-blue-500/10", text: "text-blue-200", label: "Submitted" },
  };
  const s = map[status] || map.submitted;
  return (
    <div className={`rounded-xl border p-4 ${s.bg}`}>
      <p className={`text-sm font-semibold ${s.text}`}>
        Overall Status: <span className="uppercase">{s.label}</span>
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function StudentTrack() {
  const { currentApplication } = useOutletContext();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSteps = useCallback(async () => {
    if (!currentApplication?._id) return;
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/student/request/${currentApplication._id}/steps`);
      setSteps(res.data.steps || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load progress.");
    } finally {
      setLoading(false);
    }
  }, [currentApplication?._id]);

  useEffect(() => { fetchSteps(); }, [fetchSteps]);

  if (!currentApplication) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white/10 p-8 text-white shadow-lg backdrop-blur">
          <h1 className="text-3xl font-semibold">Track Application</h1>
          <p className="mt-2 text-white/70">Monitor your No Dues request across all departments.</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-10 text-center">
          <p className="text-lg font-semibold text-white">No active application</p>
          <p className="mt-2 text-sm text-white/60">Apply for No Dues to start tracking.</p>
        </div>
      </div>
    );
  }

  const organised = organiseSteps(steps);
  const approved = steps.filter((s) => s.status === "approved").length;
  const total = steps.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white/10 p-8 text-white shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Track Application</h1>
            <p className="mt-2 text-white/70">Monitor your No Dues request across all departments.</p>
          </div>
          <button
            onClick={fetchSteps}
            className="self-start rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-6 space-y-4">
        <OverallStatusBanner status={currentApplication.status} />

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Application ID</p>
            <p className="mt-1 text-xs font-mono font-medium text-white/80 break-all">{currentApplication._id}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Submitted</p>
            <p className="mt-1 text-sm font-medium text-white">
              {currentApplication.submittedAt
                ? new Date(currentApplication.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50">Progress</p>
            <p className="mt-1 text-sm font-medium text-white">{approved} / {total} approved</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-emerald-400 transition-all"
                style={{ width: total ? `${(approved / total) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step Timeline */}
      <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">Department Clearance Status</h2>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        )}

        {!loading && !error && organised.length === 0 && (
          <p className="text-center text-sm text-white/50 py-8">No clearance steps generated yet.</p>
        )}

        {!loading && !error && organised.map((item, idx) => {
          const isLast = idx === organised.length - 1;
          if (item.type === "group") {
            return <GroupCard key={item.code} groupLabel={item.label} steps={item.steps} isLast={isLast} />;
          }
          return <StepCard key={item.step._id} step={item.step} isLast={isLast} />;
        })}
      </div>
    </div>
  );
}