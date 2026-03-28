// import { useOutletContext } from "react-router-dom";
// import DepartmentHome from "../../Home/DepartmentHome";

// export default function PlacementHome() {
//   const { pending } = useOutletContext();
//   return <DepartmentHome deptName="Placement Cell" pendingCount={pending.length} />;
// }
import { useOutletContext } from "react-router-dom";
import DepartmentHome from "../../Home/DepartmentHome";
import DepartmentAccessManager from "../../Home/DepartmentAccessManager";

export default function PlacementHome() {
  const { pending } = useOutletContext();

  return (
    <DepartmentHome deptName="Placement Cell" pendingCount={pending.length}>
      <DepartmentAccessManager currentRoute="/placement" />
    </DepartmentHome>
  );
}