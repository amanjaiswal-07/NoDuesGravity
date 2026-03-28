import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import ApprovedRequests from "../../Request/ApprovedRequests";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

const NAD_REASONS = [
  { value: "apaar", label: "APAAR ID not submitted / verified", requiresText: true },
  { value: "abc", label: "ABC ID not submitted / verified", requiresText: true },
  { value: "digilocker", label: "DigiLocker marksheets not fetched / verified", requiresText: true },
  { value: "admission_docs", label: "Required admission documents pending / incomplete", requiresText: true },
  { value: "misc", label: "Miscellaneous", requiresText: true },
];

export default function NadApproved() {
  const { approved, moveApprovedToRejected } = useOutletContext();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  return (
    <>
      <ApprovedRequests
        title="NAD Cell - Approved Requests"
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
        reasons={NAD_REASONS}
        title="Move to Rejected"
        confirmText="Move"
        placeholder="Write details (what is missing, reference number, remarks)..."
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="approved"
        currentDepartment="nad"
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}
