import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Admin from "../Admin/Admin";
import AdminLogin from "../Admin/pages/AdminLogin";
import AdminRegister from "../Admin/pages/AdminRegiser";
import MerchantDetail from "../Admin/pages/MerchantDetail";

const AdminRouters = () => {
  const { auth, restaurant } = useSelector((store) => store);
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Admin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/register" element={<AdminRegister />} />
        <Route path="/merchant-detail" element={<MerchantDetail />} />
      </Routes>
    </div>
  );
};

export default AdminRouters;
