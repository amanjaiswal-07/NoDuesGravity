// import { useOutletContext } from "react-router-dom";
// import DepartmentHome from "../../Home/DepartmentHome";

// export default function LUCSHome() {
//   const { pending } = useOutletContext();
//   return <DepartmentHome deptName="LUCS" pendingCount={pending.length} />;
// }
import { useOutletContext } from "react-router-dom";
import DepartmentHome from "../../Home/DepartmentHome";
import DepartmentAccessManager from "../../Home/DepartmentAccessManager";

export default function LUCSHome() {
  const { pending } = useOutletContext();

  return (
    <DepartmentHome deptName="LUCS" pendingCount={pending.length}>
      <DepartmentAccessManager currentRoute="/lucs" />
    </DepartmentHome>
  );
}