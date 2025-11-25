import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import AdminRouters from "./AdminRouters";
import CustomerRoutes from "./CustomerRoutes";
import { SuperAdminRouters } from "./SuperAdminRouters";

const Routers = () => {
  const { auth } = useSelector((store) => store);

  return (
    <>
      <Routes>
        <Route
          path="/super-admin/*"
          element={
            <SuperAdminRouters>
              <SuperAdmin />
            </SuperAdminRouters>
          }
        />
        <Route path="/admin/restaurant/*" element={<AdminRouters />} />
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    </>
  );
};

export default Routers;
