// import { useOutletContext } from "react-router-dom";
// import { EyeIcon } from "@heroicons/react/24/outline";
// import { useState } from "react";
// import ViewDetailsModal from "../../Modal/ViewDetailsModal";

// export default function LibraryStaffRejected() {
//   const { staffRejected } = useOutletContext();

//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewStudent, setViewStudent] = useState(null);
//   const [viewRejectReason, setViewRejectReason] = useState("");


//   return (
//     <div className="mx-auto w-full max-w-7xl">
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-white">
//           Central Library - Staff | Rejected Requests
//         </h1>
//         <p className="mt-1 text-sm text-white/60">
//           Rejected requests (reason stored). View details later.
//         </p>
//       </div>

//       <div className="space-y-4">
//         {staffRejected.length === 0 ? (
//           <div className="rounded-2xl border border-white/15 bg-white/5 p-8 text-center text-white">
//             <p className="text-lg font-semibold">No rejected requests</p>
//             <p className="mt-1 text-sm text-white/60">Nothing to track right now.</p>
//           </div>
//         ) : (
//           staffRejected.map((s, idx) => (
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
//                   className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
//                   onClick={() => {
//                     setViewStudent(s);
//                     setViewRejectReason(s.rejected?.reason || "");
//                     setViewOpen(true);
//                   }}

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
//         rejectionReason={viewRejectReason}
//         showLibraryFields={true}
//         onClose={() => {
//           setViewOpen(false);
//           setViewStudent(null);
//           setViewRejectReason("");
//         }}
//       />

//     </div>
//   );
// }
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import RejectedRequests from "../../Request/RejectedRequests";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

export default function LibraryStaffRejected() {
  const { staffRejected } = useOutletContext();

  const [viewOpen, setViewOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [viewRejectReason, setViewRejectReason] = useState("");

  return (
    <>
      <RejectedRequests
        title="Central Library - Staff | Rejected Requests"
        data={staffRejected}
        onView={(s) => {
          setViewStudent(s);
          setViewRejectReason(s.rejected?.reason || "");
          setViewOpen(true);
        }}
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        status="rejected"
        rejectionReason={viewRejectReason}
        showLibraryFields={true}
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
          setViewRejectReason("");
        }}
      />
    </>
  );
}