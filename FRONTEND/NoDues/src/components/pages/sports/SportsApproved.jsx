import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import ApprovedRequests from "../../Request/ApprovedRequests";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

const SPORTS_REASONS = [
  { value: "sports_equipment", label: "Sports equipment issued", requiresText: false },
  { value: "misc", label: "Miscellaneous", requiresText: true },
];

export default function SportsApproved() {
  const { approved, moveApprovedToRejected } = useOutletContext();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  return (
    <>
      <ApprovedRequests
        title="Sports - Approved Requests"
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
        reasons={SPORTS_REASONS}
        title="Move to Rejected"
        confirmText="Move"
        placeholder="Write miscellaneous reason..."
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
  );
}
