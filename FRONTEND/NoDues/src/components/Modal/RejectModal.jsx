// import { useEffect, useState } from "react";
// import { XMarkIcon } from "@heroicons/react/24/outline";

// const REASONS = [
//   { value: "instrument", label: "Instrument issued" },
//   { value: "wheelchair", label: "Wheelchair issued" },
//   { value: "misc", label: "Miscellaneous" },
// ];

// export default function RejectModal({ open, student, onClose, onConfirm }) {
//   const [reason, setReason] = useState("");
//   const [miscText, setMiscText] = useState("");
//   const [error, setError] = useState("");

//   // reset when modal opens or student changes
//   useEffect(() => {
//     if (open) {
//       setReason("");
//       setMiscText("");
//       setError("");
//     }
//   }, [open, student?.id]);

//   if (!open) return null;

//   const handleConfirm = () => {
//     if (!reason) {
//       setError("Please select a reason.");
//       return;
//     }

//     if (reason === "misc" && miscText.trim().length === 0) {
//       setError("Please write the miscellaneous reason.");
//       return;
//     }

//     const finalReason =
//       reason === "instrument"
//         ? "Instrument issued"
//         : reason === "wheelchair"
//         ? "Wheelchair issued"
//         : `Miscellaneous: ${miscText.trim()}`;

//     onConfirm(finalReason);
//   };

//   return (
//     <div className="fixed inset-0 z-100 flex items-center justify-center">
//       {/* Backdrop (NO close on click) */}
//       <div className="absolute inset-0 bg-black/70" />

//       {/* Modal */}
//       <div className="relative w-[92%] max-w-lg rounded-2xl border border-white/15 bg-neutral-900 p-6 text-white shadow-xl">
//         {/* Top bar */}
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <h2 className="text-lg font-semibold">Reject Request</h2>
//             <p className="mt-1 text-sm text-white/60">
//               {student ? `${student.name} (${student.roll})` : ""}
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg p-2 hover:bg-white/10"
//             aria-label="Close"
//           >
//             <XMarkIcon className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="mt-5 space-y-4">
//           <div>
//             <label className="text-sm text-white/80">Reason</label>
//             <select
//               value={reason}
//               onChange={(e) => {
//                 setReason(e.target.value);
//                 setError("");
//               }}
//               className="mt-2 w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
//             >
//               <option value="">Select reason</option>
//               {REASONS.map((r) => (
//                 <option key={r.value} value={r.value}>
//                   {r.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {reason === "misc" && (
//             <div>
//               <label className="text-sm text-white/80">
//                 Miscellaneous reason
//               </label>
//               <textarea
//                 rows={4}
//                 value={miscText}
//                 onChange={(e) => {
//                   setMiscText(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="Write the reason..."
//                 className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
//               />
//             </div>
//           )}

//           {error && (
//             <p className="text-sm text-rose-300">{error}</p>
//           )}
//         </div>

//         {/* Buttons */}
//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
//           >
//             Cancel
//           </button>

//           <button
//             type="button"
//             onClick={handleConfirm}
//             className="rounded-xl border border-rose-400/40 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10"
//           >
//             Confirm Reject
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function RejectModal({
  open,
  student,
  onClose,
  onConfirm,

  // ✅ new props (for different departments)
  reasons = [
    { value: "instrument", label: "Instrument issued", requiresText: false },
    { value: "wheelchair", label: "Wheelchair issued", requiresText: false },
    { value: "misc", label: "Miscellaneous", requiresText: true },
  ],
  placeholder = "Write the reason...",
  title = "Reject Request",
  confirmText = "Confirm Reject",
}) {
  const [selected, setSelected] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSelected("");
      setText("");
      setError("");
    }
  }, [open, student?.id]);

  if (!open) return null;

  const selectedReason = reasons.find((r) => r.value === selected);

  const handleConfirm = () => {
    if (!selected) {
      setError("Please select a reason.");
      return;
    }

    // If this reason requires text, enforce it
    if (selectedReason?.requiresText && text.trim().length === 0) {
      setError("Please write the reason.");
      return;
    }

    // Compose final reason string
    let finalReason = selectedReason?.label || "Rejected";
    if (selectedReason?.requiresText) {
      finalReason = `${finalReason}: ${text.trim()}`;
    }

    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop - NO click close */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative w-[92%] max-w-lg rounded-2xl border border-white/15 bg-neutral-900 p-6 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-white/60">
              {student ? `${student.name} (${student.roll})` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm text-white/80">Reason</label>
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setError("");
              }}
              className="mt-2 w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">Select reason</option>
              {reasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Show textarea only when selected reason requires text */}
          {selectedReason?.requiresText && (
            <div>
              <label className="text-sm text-white/80">Details</label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError("");
                }}
                placeholder={placeholder}
                className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          )}

          {error && <p className="text-sm text-rose-300">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl border border-rose-400/40 px-4 py-2 text-sm font-medium text-rose-300 hover:bg-rose-500/10"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
