// import { useState } from "react";
// import { useOutletContext } from "react-router-dom";

// import PendingRequests from "../../Request/PendingRequests";
// import ConfirmModal from "../../Modal/ConfirmModal";
// import RejectModal from "../../Modal/RejectModal";
// import ViewDetailsModal from "../../Modal/ViewDetailsModal";

// const HOD_REASONS = [
//   {
//     value: "department_clearance_incomplete",
//     label: "Departmental clearance requirements are not yet complete",
//     requiresText: true,
//   },
//   {
//     value: "lab_clearance_pending",
//     label: "Relevant lab clearance is still pending",
//     requiresText: true,
//   },
//   {
//     value: "supporting_verification_pending",
//     label: "Required verification is still pending",
//     requiresText: true,
//   },
//   {
//     value: "misc",
//     label: "Miscellaneous",
//     requiresText: true,
//   },
// ];

// export default function HODPending() {
//   const { departmentLabel, pending, approveStudent, rejectStudent } =
//     useOutletContext();

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [approveTarget, setApproveTarget] = useState(null);

//   const [rejectOpen, setRejectOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewStudent, setViewStudent] = useState(null);

//   return (
//     <>
//       <PendingRequests
//         title={`${departmentLabel} HOD - Pending Requests`}
//         data={pending}
//         onApprove={(s) => {
//           setApproveTarget(s);
//           setConfirmOpen(true);
//         }}
//         onReject={(s) => {
//           setSelectedStudent(s);
//           setRejectOpen(true);
//         }}
//         onView={(s) => {
//           setViewStudent(s);
//           setViewOpen(true);
//         }}
//       />

//       <ConfirmModal
//         open={confirmOpen}
//         title="Send for Final Approval?"
//         message={
//           approveTarget
//             ? `Approve no dues for ${approveTarget.name} (${approveTarget.roll})?`
//             : ""
//         }
//         confirmText="Approve"
//         cancelText="Cancel"
//         onClose={() => {
//           setConfirmOpen(false);
//           setApproveTarget(null);
//         }}
//         onConfirm={() => {
//           if (approveTarget) approveStudent(approveTarget);
//           setConfirmOpen(false);
//           setApproveTarget(null);
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
//         reasons={HOD_REASONS}
//         title="Reject Request"
//         confirmText="Confirm Reject"
//         placeholder="Write details (which clearance is pending, remarks, notes)..."
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

export default function HODPending() {
  const { departmentLabel, pending, approveStudent, rejectStudent } =
    useOutletContext();

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
        title={`${departmentLabel} HOD - Pending Requests`}
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
        title="Send for Final Approval?"
        message={
          approveTarget
            ? `Approve no dues for ${approveTarget.name} (${approveTarget.roll})?`
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
        title={`Approve Selected ${departmentLabel} HOD Requests?`}
        message={
          bulkApproveTargets.length > 0
            ? `Approve no dues for ${bulkApproveTargets.length} selected students?`
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
        reasons={HOD_REASONS}
        title="Reject Request"
        confirmText="Confirm Reject"
        placeholder="Write details (which clearance is pending, remarks, notes)..."
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="pending"
        currentDepartment="hod"
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}