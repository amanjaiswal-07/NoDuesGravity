// import { useMemo, useState } from "react";
// import { useOutletContext } from "react-router-dom";
// import PendingRequests from "../../Request/PendingRequests";
// import RejectModal from "../../Modal/RejectModal";
// import ViewDetailsModal from "../../Modal/ViewDetailsModal";

// export default function LibraryLibrarianPending() {
//   const { librarianPending, librarianApprove, librarianReject } = useOutletContext();

//   const [rejectOpen, setRejectOpen] = useState(false);
//   const [rejectSelected, setRejectSelected] = useState(null);

//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewStudent, setViewStudent] = useState(null);

//   const title = useMemo(
//     () => "Central Library - Librarian | Pending Requests",
//     []
//   );

//   const LIB_REJECT_REASONS = [
//     { value: "rfid_missing", label: "Student RFID missing", requiresText: true },
//     { value: "fine_pending", label: "Pending fine", requiresText: true },
//     { value: "books_not_returned", label: "Issued books not returned", requiresText: true },
//     { value: "btp_report_unsigned", label: "BTP report not signed by supervisor", requiresText: true },
//     { value: "misc", label: "Miscellaneous", requiresText: true },
//   ];

//   return (
//     <>
//       <PendingRequests
//         title={title}
//         data={librarianPending}
//         // Approve
//         showApprove={true}
//         approveLabel="Approve"
//         approveIcon="check"
//         onApprove={(s) => librarianApprove(s)}
//         // Reject
//         showReject={true}
//         rejectLabel="Reject"
//         onReject={(s) => {
//           setRejectSelected(s);
//           setRejectOpen(true);
//         }}
//         // View
//         onView={(s) => {
//           setViewStudent(s);
//           setViewOpen(true);
//         }}
//       />

//       <RejectModal
//         open={rejectOpen}
//         student={rejectSelected}
//         onClose={() => {
//           setRejectOpen(false);
//           setRejectSelected(null);
//         }}
//         onConfirm={(finalReason) => {
//           if (rejectSelected) librarianReject(rejectSelected, finalReason);
//           setRejectOpen(false);
//           setRejectSelected(null);
//         }}
//         title="Reject Request"
//         confirmText="Confirm Reject"
//         reasons={LIB_REJECT_REASONS}
//         placeholder="Write details (mandatory)..."
//       />

//       <ViewDetailsModal
//         open={viewOpen}
//         student={viewStudent}
//         status="pending"
//         showLibraryFields={true}
//         onClose={() => {
//           setViewOpen(false);
//           setViewStudent(null);
//         }}
//       />
//     </>
//   );
// }
import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PendingRequests from "../../Request/PendingRequests";
import ConfirmModal from "../../Modal/ConfirmModal";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

export default function LibraryLibrarianPending() {
  const { librarianPending, librarianApprove, librarianReject } = useOutletContext();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);

  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkSelected, setBulkSelected] = useState([]);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectSelected, setRejectSelected] = useState(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const title = useMemo(
    () => "Central Library - Librarian | Pending Requests",
    []
  );

  const LIB_REJECT_REASONS = [
    { value: "rfid_missing", label: "Student RFID missing", requiresText: true },
    { value: "fine_pending", label: "Pending fine", requiresText: true },
    { value: "books_not_returned", label: "Issued books not returned", requiresText: true },
    { value: "btp_report_unsigned", label: "BTP report not signed by supervisor", requiresText: true },
    { value: "misc", label: "Miscellaneous", requiresText: true },
  ];

  return (
    <>
      <PendingRequests
        title={title}
        data={librarianPending}
        showApprove={true}
        approveLabel="Approve"
        approveIcon="check"
        onApprove={(s) => {
          setApproveTarget(s);
          setConfirmOpen(true);
        }}
        onApproveSelected={(students) => {
          setBulkSelected(students);
          setBulkConfirmOpen(true);
        }}
        showReject={true}
        rejectLabel="Reject"
        onReject={(s) => {
          setRejectSelected(s);
          setRejectOpen(true);
        }}
        onView={(s) => {
          setViewStudent(s);
          setViewOpen(true);
        }}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Approve Library Clearance?"
        message={
          approveTarget
            ? `Approve library clearance for ${approveTarget.name} (${approveTarget.roll})?`
            : ""
        }
        confirmText="Approve"
        cancelText="Cancel"
        onClose={() => {
          setConfirmOpen(false);
          setApproveTarget(null);
        }}
        onConfirm={() => {
          if (approveTarget) librarianApprove(approveTarget);
          setConfirmOpen(false);
          setApproveTarget(null);
        }}
      />

      <ConfirmModal
        open={bulkConfirmOpen}
        title="Approve Selected Library Requests?"
        message={
          bulkSelected.length > 0
            ? `Approve library clearance for ${bulkSelected.length} selected students?`
            : ""
        }
        confirmText="Approve Selected"
        cancelText="Cancel"
        onClose={() => {
          setBulkConfirmOpen(false);
          setBulkSelected([]);
        }}
        onConfirm={() => {
          bulkSelected.forEach((student) => librarianApprove(student));
          setBulkConfirmOpen(false);
          setBulkSelected([]);
        }}
      />

      <RejectModal
        open={rejectOpen}
        student={rejectSelected}
        onClose={() => {
          setRejectOpen(false);
          setRejectSelected(null);
        }}
        onConfirm={(finalReason) => {
          if (rejectSelected) librarianReject(rejectSelected, finalReason);
          setRejectOpen(false);
          setRejectSelected(null);
        }}
        title="Reject Request"
        confirmText="Confirm Reject"
        reasons={LIB_REJECT_REASONS}
        placeholder="Write details (mandatory)..."
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="pending"
        showLibraryFields={true}
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}