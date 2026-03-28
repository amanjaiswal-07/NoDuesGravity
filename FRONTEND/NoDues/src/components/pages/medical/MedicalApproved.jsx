import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import ApprovedRequests from "../../Request/ApprovedRequests";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

export default function MedicalApproved() {
  const { approved, moveApprovedToRejected } = useOutletContext();

  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const openMoveToRejected = (student) => {
    setSelectedStudent(student);
    setRejectOpen(true);
  };

  const closeReject = () => {
    setRejectOpen(false);
    setSelectedStudent(null);
  };

  const confirmMove = (finalReason) => {
    if (!selectedStudent) return;
    moveApprovedToRejected(selectedStudent, finalReason);
    closeReject();
  };

  const openView = (student) => {
    setViewStudent(student);
    setViewOpen(true);
  };

  const closeView = () => {
    setViewOpen(false);
    setViewStudent(null);
  };

  return (
    <>
      <ApprovedRequests
        title="Medical - Approved Requests"
        data={approved}
        onMoveToRejected={openMoveToRejected}
        onView={openView}
      />

      <RejectModal
        open={rejectOpen}
        student={selectedStudent}
        onClose={closeReject}
        onConfirm={confirmMove}
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent} 
        status="approved"
        onClose={closeView}
      />
    </>
  );
}
