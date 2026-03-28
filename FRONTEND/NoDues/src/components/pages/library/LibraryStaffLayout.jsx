import { Outlet } from "react-router-dom";
import DepartmentLayout from "../../shared/DepartmentLayout";

export default function LibraryStaffLayout() {
  return (
    <DepartmentLayout
      role="library_staff"
      unitCodes={["library_staff"]}
      title="Central Library - Staff"
      basePath="/library/staff"
      headerPaths={{ approved: '/library/staff/sent' }}
      headerLabels={{ approved: 'Sent Requests' }}
    >
      {(contextData) => (
        <Outlet
          context={{
            ...contextData,
            staffPending: contextData.pending,
            staffApproved: contextData.approved,
            staffSent: contextData.approved,
            staffRejected: contextData.rejected,
            staffMoveToLibrarian: contextData.approveStudent,
            staffReject: contextData.rejectStudent,
          }}
        />
      )}
    </DepartmentLayout>
  );
}