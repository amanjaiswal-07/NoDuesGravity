import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ConfirmModal from "../../Modal/ConfirmModal";
import api from "../../../api/client";

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase";

  if (status === "pending") {
    return (
      <span className={`${base} border-amber-400/40 bg-amber-500/10 text-amber-300`}>
        ONGOING
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className={`${base} border-rose-400/40 bg-rose-500/10 text-rose-300`}>
        REJECTED
      </span>
    );
  }

  if (status === "approved") {
    return (
      <span className={`${base} border-emerald-400/40 bg-emerald-500/10 text-emerald-300`}>
        COMPLETED
      </span>
    );
  }

  return (
    <span className={`${base} border-white/40 bg-white/10 text-white/80`}>
      {status}
    </span>
  );
}

export default function StudentHistory() {
  const { applications, currentApplication, refreshStudentData } = useOutletContext();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reapplyTarget, setReapplyTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasOngoingApplication = Boolean(currentApplication);
  const displayApplications = applications || [];

  const handleReapply = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/student/request');
      refreshStudentData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reapply");
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
      setReapplyTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/10 p-8 text-white shadow-lg backdrop-blur">
        <h1 className="text-3xl font-semibold">Application History</h1>
        <p className="mt-2 text-white/70">
          View all your previous No Dues applications and their status.
        </p>
      </div>

      <div className="grid gap-5">
        {displayApplications.length === 0 && (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-white">
            <p className="text-lg font-semibold">No applications found</p>
            <p className="mt-2 text-sm text-white/60">
              You haven't submitted any No Dues requests yet.
            </p>
          </div>
        )}

        {displayApplications.map((item) => {
          // Find if there's a rejected step to display reasons
          const rejectedStep = item.steps?.find(s => s.status === 'rejected');

          return (
            <div
              key={item._id || item.id}
              className="rounded-2xl border border-white/15 bg-white/5 p-6 text-white"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-sm font-mono text-white/50 mb-1">ID: {item._id || item.id}</h2>
                  <p className="text-sm text-white/80">
                    Applied on {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <StatusBadge status={item.status} />
              </div>

              {item.status === "pending" && (
                <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-500/10 p-4">
                  <p className="text-sm text-amber-100">
                    Current Application is pending approvals.
                    Check the Track section for details.
                  </p>
                </div>
              )}

              {item.status === "rejected" && rejectedStep && (
                <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4">
                  <p className="text-sm font-medium text-rose-200">
                    Rejected by: {rejectedStep.departmentName}
                  </p>
                  <p className="mt-2 text-sm text-rose-100/90">
                    Reason: {rejectedStep.remarks || "No reason provided"}
                  </p>
                </div>
              )}

              {item.status === "rejected" && !hasOngoingApplication && (
                <div className="mt-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setReapplyTarget(item);
                      setConfirmOpen(true);
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${isSubmitting ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {isSubmitting ? "Reapplying..." : "Reapply"}
                  </button>
                </div>
              )}

              {item.status === "approved" && (
                <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <p className="text-sm text-emerald-100 font-medium">
                    Application completed successfully. All dues are cleared!
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Reapply for No Dues?"
        message={
          reapplyTarget
            ? `Are you sure you want to create a new No Dues application? Make sure you have resolved the previous rejection reason.`
            : ""
        }
        confirmText="Yes, reapply"
        cancelText="Cancel"
        onClose={() => {
          setConfirmOpen(false);
          setReapplyTarget(null);
        }}
        onConfirm={handleReapply}
      />
    </div>
  );
}