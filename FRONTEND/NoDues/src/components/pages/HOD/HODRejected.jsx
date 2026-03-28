// import { useState } from "react";
// import { useOutletContext } from "react-router-dom";

// import RejectedRequests from "../../Request/RejectedRequests";
// import ViewDetailsModal from "../../Modal/ViewDetailsModal";
// import ConfirmModal from "../../Modal/ConfirmModal";

// export default function HODRejected() {
//   const { departmentLabel, rejected, moveRejectedToApproved } =
//     useOutletContext();

//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewStudent, setViewStudent] = useState(null);

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [confirmStudent, setConfirmStudent] = useState(null);

//   return (
//     <>
//       <RejectedRequests
//         title={`${departmentLabel} HOD - Rejected Requests`}
//         data={rejected}
//         onMoveToApproved={(s) => {
//           setConfirmStudent(s);
//           setConfirmOpen(true);
//         }}
//         onView={(s) => {
//           setViewStudent(s);
//           setViewOpen(true);
//         }}
//       />

//       <ConfirmModal
//         open={confirmOpen}
//         title="Move to Approved?"
//         message={
//           confirmStudent
//             ? `Move ${confirmStudent.name} (${confirmStudent.roll}) to approved?`
//             : ""
//         }
//         confirmText="Yes, move"
//         cancelText="Cancel"
//         onClose={() => {
//           setConfirmOpen(false);
//           setConfirmStudent(null);
//         }}
//         onConfirm={() => {
//           if (confirmStudent) moveRejectedToApproved(confirmStudent);
//           setConfirmOpen(false);
//           setConfirmStudent(null);
//         }}
//       />

//       <ViewDetailsModal
//         open={viewOpen}
//         student={viewStudent}
//         status="rejected"
//         rejectionReason={viewStudent?.rejectionReason || ""}
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

import RejectedRequests from "../../Request/RejectedRequests";
import ConfirmModal from "../../Modal/ConfirmModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

export default function AdministrationRejected() {
  const { rejected, moveRejectedToApproved } = useOutletContext();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);

  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkApproveTargets, setBulkApproveTargets] = useState([]);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  return (
    <>
      <RejectedRequests
        title="Administration - Rejected Requests"
        data={rejected}
        onMoveToApproved={(s) => {
          setApproveTarget(s);
          setConfirmOpen(true);
        }}
        onMoveToApprovedSelected={(students) => {
          setBulkApproveTargets(students);
          setBulkConfirmOpen(true);
        }}
        onView={(s) => {
          setViewStudent(s);
          setViewOpen(true);
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Move to Approved?"
        message={
          approveTarget
            ? `Move ${approveTarget.name} (${approveTarget.roll}) to approved?`
            : ""
        }
        confirmText="Move to Approved"
        cancelText="Cancel"
        onClose={() => {
          setConfirmOpen(false);
          setApproveTarget(null);
        }}
        onConfirm={() => {
          if (approveTarget) moveRejectedToApproved(approveTarget);
          setConfirmOpen(false);
          setApproveTarget(null);
        }}
      />

      <ConfirmModal
        open={bulkConfirmOpen}
        title="Approve Selected Rejected Requests?"
        message={
          bulkApproveTargets.length > 0
            ? `Move ${bulkApproveTargets.length} selected students to approved?`
            : ""
        }
        confirmText="Approve Selected"
        cancelText="Cancel"
        onClose={() => {
          setBulkConfirmOpen(false);
          setBulkApproveTargets([]);
        }}
        onConfirm={() => {
          bulkApproveTargets.forEach((student) => moveRejectedToApproved(student));
          setBulkConfirmOpen(false);
          setBulkApproveTargets([]);
        }}
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="rejected"
        currentDepartment="hod"
        rejectionReason={viewStudent?.rejectionReason || ""}
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}