// import { useOutletContext } from "react-router-dom";
// import DepartmentHome from "../../Home/DepartmentHome";

// export default function StoreHome() {
//   const { pending } = useOutletContext();
//   return <DepartmentHome deptName="Store" pendingCount={pending.length} />;
// }
import { useOutletContext } from "react-router-dom";
import DepartmentHome from "../../Home/DepartmentHome";
import DepartmentAccessManager from "../../Home/DepartmentAccessManager";

export default function StoreHome() {
  const { pending } = useOutletContext();

  return (
    <DepartmentHome deptName="Store" pendingCount={pending.length}>
      <DepartmentAccessManager currentRoute="/store" />
    </DepartmentHome>
  );
}