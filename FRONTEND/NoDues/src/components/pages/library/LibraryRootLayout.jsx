import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/client";

export default function LibraryRootLayout() {
  const navigate = useNavigate();
  // We'll use the same backend buckets for both roles, because 
  // the backend automatically filters based on who is logged in 
  // (library staff vs chief librarian)

  const [staffPending, setStaffPending] = useState([]);
  const [staffRejected, setStaffRejected] = useState([]);
  const [staffSent, setStaffSent] = useState([]); // In a real backend, "sent" could be reconstructed, but we can just use "approved" as "sent" for staff.

  const [librarianPending, setLibrarianPending] = useState([]);
  const [librarianApproved, setLibrarianApproved] = useState([]);
  const [librarianRejected, setLibrarianRejected] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/clearance/c-lib');
      const { pending: p, approved: a, rejected: r } = res.data;

      const mapStudent = (req) => ({
        id: req._id,
        name: req.studentId?.name || "Unknown",
        roll: req.studentId?.rollNo || "Unknown",
        email: req.studentId?.email || "Unknown",
        rejectionReason: req.steps?.find(s => s.departmentName === "Central Library")?.remarks || "",
        tracking: { status: req.status }
      });

      const mappedP = p.map(mapStudent);
      const mappedA = a.map(mapStudent);
      const mappedR = r.map(mapStudent);

      setStaffPending(mappedP);
      setStaffSent(mappedA);
      setStaffRejected(mappedR);

      setLibrarianPending(mappedP);
      setLibrarianApproved(mappedA);
      setLibrarianRejected(mappedR);
    } catch (err) {
      console.error(`Failed to fetch clearance requests for Library:`, err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const generalApprove = async (student) => {
    try {
      await api.post(`/clearance/c-lib/approve`, { requestId: student.id });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to approve student");
    }
  };

  const generalReject = async (student, finalReason) => {
    try {
      await api.post(`/clearance/c-lib/reject`, { requestId: student.id, remarks: finalReason });
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reject student");
    }
  };

  // STAFF: Pending -> Sent + Librarian Pending
  const staffMoveToLibrarian = async (student) => {
    await generalApprove(student);
  };

  // STAFF: Pending -> Rejected (staff-only)
  const staffReject = async (student, finalReason) => {
    await generalReject(student, finalReason);
  };

  // LIBRARIAN: Pending -> Approved
  const librarianApprove = async (student) => {
    await generalApprove(student);
  };

  // LIBRARIAN: Pending -> Rejected
  const librarianReject = async (student, finalReason) => {
    await generalReject(student, finalReason);
  };

  // LIBRARIAN: Approved -> Rejected
  const librarianMoveApprovedToRejected = async (student, finalReason) => {
    await generalReject(student, finalReason);
  };

  // LIBRARIAN: Rejected -> Approved
  const librarianMoveRejectedToApproved = async (student) => {
    await generalApprove(student);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white/50">
        Loading library dashboard...
      </div>
    );
  }

  return (
    <Outlet
      context={{
        // staff
        staffPending,
        staffRejected,
        staffSent,
        staffMoveToLibrarian,
        staffReject,

        // librarian
        librarianPending,
        librarianApproved,
        librarianRejected,
        librarianApprove,
        librarianReject,
        librarianMoveApprovedToRejected,
        librarianMoveRejectedToApproved,
      }}
    />
  );
}