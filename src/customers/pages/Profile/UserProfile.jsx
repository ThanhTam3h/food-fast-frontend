
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../State/Authentication/Action";

// --- Inline SVG thay AccountCircleIcon ---
const UserIcon = ({ size = "10rem", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UserProfile = () => {
  // Redux state
  const { user } = useSelector((state) => state.auth || {});
  const userData = user?.data || user || {};

  const userEmail = userData.email || "N/A";
  const userPhone = userData.phone || "N/A";
  const userUsername = userData.username || userEmail.split("@")[0] || "User";
  const memberSince = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("vi-VN")
    : "N/A";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true);
    setTimeout(() => {
      dispatch(logout());
      navigate("/");
      setIsLoggingOut(false);
    }, 800);
  }, [dispatch, navigate]);

  // Tailwind button
  const TailwindButton = ({ onClick, children, loading }) => (
    <button
      onClick={onClick}
      className={`
        mt-8 py-3 px-8 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform
        hover:scale-[1.02] active:scale-95 bg-green-600
      `}
    >
      Logout
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="text-indigo-600 mb-4">
            <UserIcon
              size="6rem"
              className="h-24 w-24 mx-auto text-green-600 "
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Welcome, {userUsername}
          </h1>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 text-left p-6 bg-green-50 rounded-xl border border-indigo-200">
          <div className="flex justify-between items-center border-b pb-2 border-indigo-200"></div>
          <div className="flex justify-between items-center border-b pb-2 border-indigo-200">
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p className="text-lg font-semibold text-gray-800">{userEmail}</p>
          </div>
          <div className="flex justify-between items-center border-b pb-2 border-indigo-200">
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="text-lg font-semibold text-gray-800">{userPhone}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-500">Member Since</p>
            <p className="text-lg font-semibold text-gray-800">{memberSince}</p>
          </div>
        </div>

        {/* Logout Button */}
        <TailwindButton
          onClick={handleLogout}
          loading={isLoggingOut}
        ></TailwindButton>
      </div>
    </div>
  );
};

export default UserProfile;
