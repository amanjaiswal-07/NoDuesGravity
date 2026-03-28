import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { EyeIcon, XCircleIcon } from "@heroicons/react/24/outline";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

export default function LibraryLibrarianApproved() {
  const { librarianApproved, librarianMoveApprovedToRejected } = useOutletContext();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectSelected, setRejectSelected] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const LIB_REJECT_REASONS = [
    { value: "rfid_missing", label: "Student RFID missing", requiresText: true },
    { value: "fine_pending", label: "Pending fine", requiresText: true },
    { value: "books_not_returned", label: "Issued books not returned", requiresText: true },
    { value: "btp_report_unsigned", label: "BTP report not signed by supervisor", requiresText: true },
    { value: "misc", label: "Miscellaneous", requiresText: true },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">
          Central Library - Librarian | Approved Requests
        </h1>
        <p className="mt-1 text-sm text-white/60">Final approvals done by Librarian.</p>
      </div>

      <div className="space-y-4">
        {librarianApproved.length === 0 ? (
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-white">
            <p className="text-lg font-semibold">No approved requests</p>
            <p className="mt-1 text-sm text-white/60">Nothing here right now.</p>
          </div>
        ) : (
          librarianApproved.map((s, idx) => (
            <div
              key={s.id ?? s.roll}
              className="flex flex-nowrap items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white shadow-sm"
            >
              <div className="w-10 shrink-0 text-white/80">{idx + 1}.</div>
              <div className="min-w-[220px] flex-1 font-medium">{s.name}</div>
              <div className="min-w-[140px] shrink-0 text-white/80">{s.roll}</div>
              <div className="min-w-[260px] flex-1 text-white/70">{s.email}</div>

              <div className="ml-auto flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRejectSelected(s);
                    setRejectOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-400/40 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10"
                >
                  <XCircleIcon className="h-5 w-5" />
                  Move to Rejected
                </button>

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

      <RejectModal
        open={rejectOpen}
        student={rejectSelected}
        onClose={() => {
          setRejectOpen(false);
          setRejectSelected(null);
        }}
        onConfirm={(finalReason) => {
          if (rejectSelected) librarianMoveApprovedToRejected(rejectSelected, finalReason);
          setRejectOpen(false);
          setRejectSelected(null);
        }}
        title="Move to Rejected"
        confirmText="Confirm Reject"
        reasons={LIB_REJECT_REASONS}
        placeholder="Write details (mandatory)..."
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="approved"
        showLibraryFields={true}
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </div>
  );
}