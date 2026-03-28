import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import ApprovedRequests from "../../Request/ApprovedRequests";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

const LAB_REASONS = [
  {
    value: "equipment_not_returned",
    label: "Lab equipment / issued item has not been returned",
    requiresText: true,
  },
  {
    value: "records_not_verified",
    label: "Lab usage / issue records could not be verified",
    requiresText: true,
  },
  {
    value: "pending_dues",
    label: "Pending lab dues remain unsettled",
    requiresText: true,
  },
  {
    value: "misc",
    label: "Miscellaneous",
    requiresText: true,
  },
];

export default function LabsApproved() {
  const { selectedLab, approved, moveApprovedToRejected } = useOutletContext();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  if (!selectedLab) {
    return <EmptyLabGuard />;
  }

  return (
    <>
      {approved.length === 0 ? (
        <EmptyLabState lab={selectedLab} type="approved" />
      ) : (
        <>
          <ApprovedRequests
            title={`Labs - ${selectedLab} | Approved Requests`}
            data={approved}
            onMoveToRejected={(s) => {
              setSelectedStudent(s);
              setRejectOpen(true);
            }}
            onView={(s) => {
              setViewStudent(s);
              setViewOpen(true);
            }}
          />

          <RejectModal
            open={rejectOpen}
            student={selectedStudent}
            onClose={() => {
              setRejectOpen(false);
              setSelectedStudent(null);
            }}
            onConfirm={(finalReason) => {
              moveApprovedToRejected(selectedStudent, finalReason);
              setRejectOpen(false);
              setSelectedStudent(null);
            }}
            reasons={LAB_REASONS}
            title="Move to Rejected"
            confirmText="Move"
            placeholder="Write details (issued item, register entry, remarks)..."
          />

          <ViewDetailsModal
            open={viewOpen}
            student={viewStudent}
            status="approved"
            onClose={() => {
              setViewOpen(false);
              setViewStudent(null);
            }}
          />
        </>
      )}
    </>
  );
}

function EmptyLabGuard() {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-10 text-center text-white">
      <p className="text-lg font-semibold">No lab selected</p>
      <p className="mt-1 text-sm text-white/60">
        Please go to the dashboard and select a lab first.
      </p>
    </div>
  );
}

function EmptyLabState({ lab, type }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-10 text-center text-white">
      <p className="text-lg font-semibold">No requests in this lab</p>
      <p className="mt-1 text-sm text-white/60">
        No {type} requests found for{" "}
        <span className="font-semibold text-white">{lab}</span>.
      </p>
    </div>
  );
}