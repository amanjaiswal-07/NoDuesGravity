import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import ApprovedRequests from "../../Request/ApprovedRequests";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

const STORE_REASONS = [
  { value: "general_equipment", label: "Institute equipment issued to the student", requiresText: true },
  { value: "club_equipment", label: "Club inventory issued on behalf of the student", requiresText: true },
  { value: "misc", label: "Miscellaneous", requiresText: true },
];

export default function StoreApproved() {
  const { approved, moveApprovedToRejected } = useOutletContext();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  return (
    <>
      <ApprovedRequests
        title="Store - Approved Requests"
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
        reasons={STORE_REASONS}
        title="Move to Rejected"
        confirmText="Move"
        placeholder="Write details (item name, quantity, issue date, club name if any)..."
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="approved"
        currentDepartment="store"
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}
