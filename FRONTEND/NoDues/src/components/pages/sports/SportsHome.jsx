// import { useOutletContext } from "react-router-dom";
// import DepartmentHome from "../../Home/DepartmentHome";

// export default function SportsHome() {
//   const { pending } = useOutletContext();
//   return <DepartmentHome deptName="Sports" pendingCount={pending.length} />;
// }
import { useOutletContext } from "react-router-dom";
import DepartmentHome from "../../Home/DepartmentHome";
import DepartmentAccessManager from "../../Home/DepartmentAccessManager";

export default function SportsHome() {
  const { pending } = useOutletContext();

  return (
    <DepartmentHome deptName="Sports" pendingCount={pending.length}>
      <DepartmentAccessManager currentRoute="/sports" />
    </DepartmentHome>
  );
}
