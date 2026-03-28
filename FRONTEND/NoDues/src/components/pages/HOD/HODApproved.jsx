import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import ApprovedRequests from "../../Request/ApprovedRequests";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

const HOD_REASONS = [
  {
    value: "department_clearance_incomplete",
    label: "Departmental clearance requirements are not yet complete",
    requiresText: true,
  },
  {
    value: "lab_clearance_pending",
    label: "Relevant lab clearance is still pending",
    requiresText: true,
  },
  {
    value: "supporting_verification_pending",
    label: "Required verification is still pending",
    requiresText: true,
  },
  {
    value: "misc",
    label: "Miscellaneous",
    requiresText: true,
  },
];

export default function HODApproved() {
  const { departmentLabel, approved, moveApprovedToRejected } =
    useOutletContext();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  return (
    <>
      <ApprovedRequests
        title={`${departmentLabel} HOD - Approved Requests`}
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
        reasons={HOD_REASONS}
        title="Move to Rejected"
        confirmText="Move"
        placeholder="Write details (which clearance is pending, remarks, notes)..."
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="approved"
        currentDepartment="hod"
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}