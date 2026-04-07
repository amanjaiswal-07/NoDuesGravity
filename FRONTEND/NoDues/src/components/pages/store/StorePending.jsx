import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import PendingRequests from "../../Request/PendingRequests";
import ConfirmModal from "../../Modal/ConfirmModal";
import RejectModal from "../../Modal/RejectModal";
import ViewDetailsModal from "../../Modal/ViewDetailsModal";

const STORE_REASONS = [
  { value: "general_equipment", label: "Institute equipment issued to the student" },
  { value: "club_equipment", label: "Club inventory issued on behalf of the student" },
  { value: "misc", label: "Miscellaneous" },
];

// Branch → HOD unit code
const BRANCH_TO_HOD = {
  CSE: { value: "hod_cse", label: "HOD - CSE" },
  ECE: { value: "hod_ece", label: "HOD - ECE" },
  CCE: { value: "hod_cce", label: "HOD - CCE" },
  MECH: { value: "hod_mech", label: "HOD - MECH" },
};

/**
 * Returns dynamic dep options for Store based on student's branch and hostel.
 * Always shows ONLY the relevant HOD and the student's specific warden.
 * Falls back to all HODs if branch is unknown.
 */
function getStoreDepOptions(student) {
  const branch = (student?.branch || "").toUpperCase();
  const hostel = student?.hostel || "";

  const hodOption = BRANCH_TO_HOD[branch] || null;
  const allHods = Object.values(BRANCH_TO_HOD);
  const hodOptions = hodOption ? [hodOption] : allHods; // fallback: show all if branch unknown

  const wardenLabel = hostel ? `Warden Incharge (${hostel})` : "Warden Incharge";
  const wardenOption = { value: "warden", label: wardenLabel };

  return [...hodOptions, wardenOption];
}

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
        onClose={() => { setRejectOpen(false); setSelectedStudent(null); }}
        onConfirm={(reason, description, restartFrom) => {
          rejectStudent(selectedStudent, reason, description, restartFrom);
          setRejectOpen(false);
          setSelectedStudent(null);
        }}
        reasons={STORE_REASONS}
        title="Reject Store Request"
        confirmText="Confirm Reject"
        placeholder="Specify item name, quantity, issue date, club name if any…"
        dependencyOptions={getStoreDepOptions(selectedStudent)}
        dependenciesRequired={false}
      />

      <ViewDetailsModal
        open={viewOpen}
        student={viewStudent}
        currentDepartment="store"
        onClose={() => {
          setViewOpen(false);
          setViewStudent(null);
        }}
      />
    </>
  );
}