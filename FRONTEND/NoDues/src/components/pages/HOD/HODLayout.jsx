/**
 * HODLayout — reads the logged-in user's permissionCodes to determine
 * which HOD unit code (hod_cse | hod_ece | hod_cce | hod_mech) they hold.
 * Only that department's requests are fetched.
 */
import { Outlet } from "react-router-dom";
import DepartmentLayout from "../../shared/DepartmentLayout";

const HOD_LABELS = {
  hod_cse: "HOD - CSE",
  hod_ece: "HOD - ECE",
  hod_cce: "HOD - CCE",
  hod_mech: "HOD - MECH",
};

const HOD_CODES = Object.keys(HOD_LABELS);

export default function HODLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  // Find the first HOD code this user has permission for
  const hodCode = user?.permissionCodes?.find((c) => HOD_CODES.includes(c)) || "hod_cse";
  const title = HOD_LABELS[hodCode] || "HOD";

  // Create a display label like "CSE", "ECE", "CCE", "MECH" to pass to child pages
  const departmentLabel = title.replace("HOD - ", "");

  return (
    <DepartmentLayout role="hod" unitCodes={[hodCode]} title={title} basePath={`/hod/${departmentLabel.toLowerCase()}`}>
      {(contextData) => (
        <Outlet
          context={{
            ...contextData,
            departmentLabel,
          }}
        />
      )}
    </DepartmentLayout>
  );
}