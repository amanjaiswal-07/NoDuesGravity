// import { useOutletContext } from "react-router-dom";
// import DepartmentHome from "../../Home/DepartmentHome";

// export default function NadHome() {
//   const { pending } = useOutletContext();
//   return <DepartmentHome deptName="NAD Cell" pendingCount={pending.length} />;
// }
import { useOutletContext } from "react-router-dom";
import DepartmentHome from "../../Home/DepartmentHome";
import DepartmentAccessManager from "../../Home/DepartmentAccessManager";

export default function NadHome() {
  const { pending } = useOutletContext();

  return (
    <DepartmentHome deptName="NAD Cell" pendingCount={pending.length}>
      <DepartmentAccessManager currentRoute="/nad" />
    </DepartmentHome>
  );
}