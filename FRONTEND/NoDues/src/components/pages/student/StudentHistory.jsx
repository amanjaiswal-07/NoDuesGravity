import { useState, useEffect } from "react";
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

function HistoryCard({ item, hasOngoingApplication, isSubmitting, onReapply }) {
  const [steps, setSteps] = useState([]);
  const [overallStatus, setOverallStatus] = useState(item.status || "pending");

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const { data } = await api.get(`/student/request/${item._id || item.id}/steps`);
        const itemSteps = data.steps || [];
        setSteps(itemSteps);

        const allApproved = itemSteps.every(s => s.status === "approved");
        const anyRejected = itemSteps.some(s => s.status === "rejected");

        if (allApproved && itemSteps.length > 0) setOverallStatus("approved");
        else if (anyRejected) setOverallStatus("rejected");
        else setOverallStatus("pending");
      } catch (err) {
        console.error(err);
      }
    };
    fetchSteps();
  }, [item._id, item.id]);

  const rejectedStep = steps.find(s => s.status === "rejected");
  const finalApproveDate = overallStatus === "approved" && steps.length > 0
    ? new Date(Math.max(...steps.map(s => s.actionAt ? new Date(s.actionAt).getTime() : 0)))
    : null;

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-sm font-mono text-white/50 mb-1">ID: {item._id || item.id}</h2>
          <p className="text-sm text-white/80">
            Applied on {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>

        <StatusBadge status={overallStatus} />
      </div>

      {overallStatus === "pending" && (
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-100">
            Current Application is pending approvals. Check the Track section for details.
          </p>
        </div>
      )}

      {overallStatus === "rejected" && rejectedStep && (
        <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4">
          <p className="text-sm font-medium text-rose-200">
            Placed on hold by: {rejectedStep.unitLabel || rejectedStep.unitCode}
          </p>
          <p className="mt-2 text-sm text-rose-100/90">
            Reason: {rejectedStep.rejectionReason || "No reason provided"}
          </p>
          {rejectedStep.rejectionDescription && (
            <p className="mt-1 text-sm text-rose-100/70">
              Details: {rejectedStep.rejectionDescription}
            </p>
          )}
        </div>
      )}

      {overallStatus === "rejected" && !hasOngoingApplication && (
        <div className="mt-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onReapply(item)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${isSubmitting ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isSubmitting ? "Reapplying..." : "Reapply"}
          </button>
        </div>
      )}

      {overallStatus === "approved" && (
        <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="text-sm text-emerald-100 font-medium">
            Application completed successfully. All dues are cleared!
          </p>
          {finalApproveDate && finalApproveDate.getTime() > 0 && (
            <p className="mt-2 text-xs text-emerald-200/70 block">
              Completed on: {finalApproveDate.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
            </p>
          )}
        </div>
      )}
    </div>
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

        {displayApplications.map((item) => (
          <HistoryCard
            key={item._id || item.id}
            item={item}
            hasOngoingApplication={hasOngoingApplication}
            isSubmitting={isSubmitting}
            onReapply={(target) => {
              setReapplyTarget(target);
              setConfirmOpen(true);
            }}
          />
        ))}
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