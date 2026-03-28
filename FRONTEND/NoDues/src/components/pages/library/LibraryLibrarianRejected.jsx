// import { useOutletContext } from "react-router-dom";
// import { useState } from "react";
// import { EyeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
// import ViewDetailsModal from "../../Modal/ViewDetailsModal";

// export default function LibraryLibrarianRejected() {
//   const { librarianRejected, librarianMoveRejectedToApproved } = useOutletContext();

//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewStudent, setViewStudent] = useState(null);

//   return (
//     <div className="mx-auto w-full max-w-7xl">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-white">
//           Central Library - Librarian | Rejected Requests
//         </h1>
//         <p className="mt-1 text-sm text-white/60">Final rejections done by Librarian.</p>
//       </div>

//       <div className="space-y-4">
//         {librarianRejected.length === 0 ? (
//           <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-white">
//             <p className="text-lg font-semibold">No rejected requests</p>
//             <p className="mt-1 text-sm text-white/60">Nothing here right now.</p>
//           </div>
//         ) : (
//           librarianRejected.map((s, idx) => (
//             <div
//               key={s.id ?? s.roll}
//               className="flex flex-nowrap items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-white shadow-sm"
//             >
//               <div className="w-10 shrink-0 text-white/80">{idx + 1}.</div>
//               <div className="min-w-[220px] flex-1 font-medium">{s.name}</div>
//               <div className="min-w-[140px] shrink-0 text-white/80">{s.roll}</div>
//               <div className="min-w-[260px] flex-1 text-white/70">{s.email}</div>

//               <div className="ml-auto flex shrink-0 items-center gap-3">
//                 <button
//                   type="button"
//                   onClick={() => librarianMoveRejectedToApproved(s)}
//                   className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10"
//                 >
//                   <CheckCircleIcon className="h-5 w-5" />
//                   Move to Approved
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setViewStudent(s);
//                     setViewOpen(true);
//                   }}
//                   className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
//                 >
//                   <EyeIcon className="h-5 w-5" />
//                   View details
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <ViewDetailsModal
//         open={viewOpen}
//         student={viewStudent}
//         status="rejected"
//         rejectionReason={viewStudent?.rejected?.reason || ""}
//         showLibraryFields={true}
//         onClose={() => {
//           setViewOpen(false);
//           setViewStudent(null);
//         }}
//       />
//     </div>
//   );
// }
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import RejectedRequests from "../../Request/RejectedRequests";
import ConfirmModal from "../../Modal/ConfirmModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

export default function LibraryLibrarianRejected() {
  const { librarianRejected, librarianMoveRejectedToApproved } = useOutletContext();

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmStudent, setConfirmStudent] = useState(null);

  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkConfirmStudents, setBulkConfirmStudents] = useState([]);

  return (
    <>
      <RejectedRequests
        title="Central Library - Librarian | Rejected Requests"
        data={librarianRejected}
        onMoveToApproved={(s) => {
          setConfirmStudent(s);
          setConfirmOpen(true);
        }}
        onMoveToApprovedSelected={(students) => {
          setBulkConfirmStudents(students);
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
          confirmStudent
            ? `Move ${confirmStudent.name} (${confirmStudent.roll}) to approved?`
            : ""
        }
        confirmText="Yes, move"
        cancelText="Cancel"
        onClose={() => {
          setConfirmOpen(false);
          setConfirmStudent(null);
        }}
        onConfirm={() => {
          if (confirmStudent) librarianMoveRejectedToApproved(confirmStudent);
          setConfirmOpen(false);
          setConfirmStudent(null);
        }}
      />

      <ConfirmModal
        open={bulkConfirmOpen}
        title="Approve Selected Rejected Requests?"
        message={
          bulkConfirmStudents.length > 0
            ? `Move ${bulkConfirmStudents.length} selected students to approved?`
            : ""
        }
        confirmText="Approve Selected"
        cancelText="Cancel"
        onClose={() => {
          setBulkConfirmOpen(false);
          setBulkConfirmStudents([]);
        }}
        onConfirm={() => {
          bulkConfirmStudents.forEach((student) =>
            librarianMoveRejectedToApproved(student)
          );
          setBulkConfirmOpen(false);
          setBulkConfirmStudents([]);
        }}
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="rejected"
        rejectionReason={viewStudent?.rejected?.reason || ""}
        showLibraryFields={true}
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}