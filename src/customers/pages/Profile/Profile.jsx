import { Route, Routes } from "react-router-dom";
import UserProfile from "./UserProfile";

const Profile = () => {
  return (
    <div className="flex justify-center items-center">
      <Routes>
        <Route path="/" element={<UserProfile />} />
        {/* <Route path="/orders" element={<Orders/>} />
          <Route path="/address" element={<UsersAddresses/>} />
          <Route path="/favorites" element={<Favorite/>} />
          <Route path="/payments" element={<Orders/>} />
          <Route path="/events" element={<CustomerEvents/>} />
          <Route path="/notification" element={<Notifications/>} /> */}
      </Routes>
    </div>
  );
};

export default Profile;
