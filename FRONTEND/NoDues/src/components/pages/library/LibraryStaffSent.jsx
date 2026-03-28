import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

export default function LibraryStaffSent() {
  const { staffSent } = useOutletContext();
  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const badgeClass = (status) => {
    if (status === "Approved by Librarian")
      return "border-emerald-400/40 text-emerald-300 bg-emerald-500/10";
    if (status === "Rejected by Librarian")
      return "border-rose-400/40 text-rose-300 bg-rose-500/10";
    return "border-white/20 text-white/80 bg-white/5"; // Pending by Librarian
  };

  const getStatus = (s) => s?.tracking?.status || "Pending by Librarian";
  const getReason = (s) => s?.tracking?.librarianReason || "";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Central Library - Staff | Move to Librarian
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Requests forwarded to Librarian for final approval.
        </p>
      </div>

      <div className="space-y-4">
        {staffSent.length === 0 ? (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-white">
            <p className="text-lg font-semibold">No requests sent</p>
            <p className="mt-1 text-sm text-white/60">Nothing to track right now.</p>
          </div>
        ) : (
          staffSent.map((s, idx) => (
            <div
              key={s.id ?? s.roll}
              className="flex flex-nowrap items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white shadow-sm"
            >
              <div className="w-10 shrink-0 text-white/80">{idx + 1}.</div>
              <div className="min-w-[220px] flex-1 font-medium">{s.name}</div>
              <div className="min-w-[140px] shrink-0 text-white/80">{s.roll}</div>
              <div className="min-w-[260px] flex-1 text-white/70">{s.email}</div>

              <div className="ml-auto flex shrink-0 items-center gap-3">
                {/* Status badge */}
                <span
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold ${badgeClass(
                    getStatus(s)
                  )}`}
                >
                  {getStatus(s)}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setViewStudent(s);
                    setViewOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
                >
                  <EyeIcon className="h-5 w-5" />
                  View details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        // pass the real tracking status + reason
        status={viewStudent ? getStatus(viewStudent) : "Pending by Librarian"}
        rejectionReason={viewStudent ? getReason(viewStudent) : ""}
        showLibraryFields={true}
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </div>
  );
}