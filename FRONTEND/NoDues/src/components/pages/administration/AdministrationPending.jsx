// import { useState } from "react";
// import { useOutletContext } from "react-router-dom";

// import PendingRequests from "../../Request/PendingRequests";
// import RejectModal from "../../Modal/RejectModal";
// import ViewDetailsModal from "../../Modal/ViewDetailsModal";

// const ADMIN_REASONS = [
//   { value: "guest_house", label: "Guest House charges pending (room/stay fees)", requiresText: true },
//   { value: "transport", label: "Transport dues pending (bus related)", requiresText: true },
//   { value: "misc", label: "Miscellaneous", requiresText: true },
// ];

// export default function AdministrationPending() {
//   const { pending, approveStudent, rejectStudent } = useOutletContext();

//   const [rejectOpen, setRejectOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewStudent, setViewStudent] = useState(null);

//   return (
//     <>
//       <PendingRequests
//         title="Administration - Pending Requests"
//         data={pending}
//         onApprove={approveStudent}
//         onReject={(s) => {
//           setSelectedStudent(s);
//           setRejectOpen(true);
//         }}
//         onView={(s) => {
//           setViewStudent(s);
//           setViewOpen(true);
//         }}
//       />

//       <RejectModal
//         open={rejectOpen}
//         student={selectedStudent}
//         onClose={() => {
//           setRejectOpen(false);
//           setSelectedStudent(null);
//         }}
//         onConfirm={(finalReason) => {
//           rejectStudent(selectedStudent, finalReason);
//           setRejectOpen(false);
//           setSelectedStudent(null);
//         }}
//         reasons={ADMIN_REASONS}
//         title="Reject Request"
//         confirmText="Confirm Reject"
//         placeholder="Write details (type of due, amount, reference, remarks)..."
//       />

//       <ViewDetailsModal
//         open={viewOpen}
//         student={viewStudent}
//         status="pending"
//         onClose={() => {
//           setViewOpen(false);
//           setViewStudent(null);
//         }}
//       />
//     </>
//   );
// }
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import PendingRequests from "../../Request/PendingRequests";
import ConfirmModal from "../../Modal/ConfirmModal";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

const ADMIN_REASONS = [
  { value: "guest_house", label: "Guest House charges pending (room/stay fees)", requiresText: true },
  { value: "transport", label: "Transport dues pending (bus related)", requiresText: true },
  { value: "misc", label: "Miscellaneous", requiresText: true },
];

export default function AdministrationPending() {
  const { pending, approveStudent, rejectStudent } = useOutletContext();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);

  const [bulkApproveOpen, setBulkApproveOpen] = useState(false);
  const [bulkApproveTargets, setBulkApproveTargets] = useState([]);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  return (
    <>
      <PendingRequests
        title="Administration - Pending Requests"
        data={pending}
        onApprove={(s) => {
          setApproveTarget(s);
          setConfirmOpen(true);
        }}
        onApproveSelected={(students) => {
          setBulkApproveTargets(students);
          setBulkApproveOpen(true);
        }}
        onReject={(s) => {
          setSelectedStudent(s);
          setRejectOpen(true);
        }}
        onView={(s) => {
          setViewStudent(s);
          setViewOpen(true);
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Approve Administration Clearance?"
        message={
          approveTarget
            ? `Approve Administration clearance for ${approveTarget.name} (${approveTarget.roll})?`
            : ""
        }
        confirmText="Approve"
        cancelText="Cancel"
        onClose={() => {
          setConfirmOpen(false);
          setApproveTarget(null);
        }}
        onConfirm={() => {
          if (approveTarget) approveStudent(approveTarget);
          setConfirmOpen(false);
          setApproveTarget(null);
        }}
      />

      <ConfirmModal
        open={bulkApproveOpen}
        title="Approve Selected Administration Requests?"
        message={
          bulkApproveTargets.length > 0
            ? `Approve Administration clearance for ${bulkApproveTargets.length} selected students?`
            : ""
        }
        confirmText="Approve Selected"
        cancelText="Cancel"
        onClose={() => {
          setBulkApproveOpen(false);
          setBulkApproveTargets([]);
        }}
        onConfirm={() => {
          bulkApproveTargets.forEach((student) => approveStudent(student));
          setBulkApproveOpen(false);
          setBulkApproveTargets([]);
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
          rejectStudent(selectedStudent, finalReason);
          setRejectOpen(false);
          setSelectedStudent(null);
        }}
        reasons={ADMIN_REASONS}
        title="Reject Request"
        confirmText="Confirm Reject"
        placeholder="Write details (type of due, amount, reference, remarks)..."
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="pending"
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}