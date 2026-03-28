// import { useState } from "react";
// import { useOutletContext } from "react-router-dom";

// import PendingRequests from "../../Request/PendingRequests";
// import RejectModal from "../../Modal/RejectModal";
// import ViewDetailsModal from "../../Modal/ViewDetailsModal";

// const STORE_REASONS = [
//   { value: "general_equipment", label: "Institute equipment issued to the student", requiresText: true },
//   { value: "club_equipment", label: "Club inventory issued on behalf of the student", requiresText: true },
//   { value: "misc", label: "Miscellaneous", requiresText: true },
// ];

// export default function StorePending() {
//   const { pending, approveStudent, rejectStudent } = useOutletContext();

//   const [rejectOpen, setRejectOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewStudent, setViewStudent] = useState(null);

//   return (
//     <>
//       <PendingRequests
//         title="Store - Pending Requests"
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
//         reasons={STORE_REASONS}
//         title="Reject Request"
//         confirmText="Confirm Reject"
//         placeholder="Write details (item name, quantity, issue date, club name if any)..."
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

const STORE_REASONS = [
  { value: "general_equipment", label: "Institute equipment issued to the student", requiresText: true },
  { value: "club_equipment", label: "Club inventory issued on behalf of the student", requiresText: true },
  { value: "misc", label: "Miscellaneous", requiresText: true },
];

export default function StorePending() {
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
        title="Store - Pending Requests"
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
        title="Approve Store Clearance?"
        message={
          approveTarget
            ? `Approve Store clearance for ${approveTarget.name} (${approveTarget.roll})?`
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
        title="Approve Selected Store Requests?"
        message={
          bulkApproveTargets.length > 0
            ? `Approve Store clearance for ${bulkApproveTargets.length} selected students?`
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
        reasons={STORE_REASONS}
        title="Reject Request"
        confirmText="Confirm Reject"
        placeholder="Write details (item name, quantity, issue date, club name if any)..."
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="pending"
        currentDepartment="store"
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}