// import DepartmentHome from "../../Home/DepartmentHome.jsx";
// import { useOutletContext } from "react-router-dom";

// export default function MedicalHome() {
//   const { pending } = useOutletContext();
//   return <DepartmentHome deptName="Medical Unit" pendingCount={pending.length}/>;
// }
import DepartmentHome from "../../Home/DepartmentHome.jsx";
import DepartmentAccessManager from "../../Home/DepartmentAccessManager";
import { useOutletContext } from "react-router-dom";

export default function MedicalHome() {
  const { pending } = useOutletContext();

  return (
    <DepartmentHome deptName="Medical Unit" pendingCount={pending.length}>
      <DepartmentAccessManager currentRoute="/medical" />
    </DepartmentHome>
  );
}