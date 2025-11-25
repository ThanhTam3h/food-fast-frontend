import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import { useMediaQuery } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../State/Authentication/Action";

const menu = [
  // { title: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { title: "Người dùng", icon: <PeopleIcon />, path: "/customers" },
  { title: "Nhà hàng", icon: <StoreIcon />, path: "/merchants" },
  // { title: "Approve", icon: <AssignmentTurnedInIcon />, path: "/approve" },
  { title: "Drone", icon: <FlightTakeoffIcon />, path: "/drone" },
  { title: "Drone Hub", icon: <FlightTakeoffIcon />, path: "/drone-hub" },
  { title: "Đơn hàng", icon: <FlightTakeoffIcon />, path: "/drone-order" },
  { title: "Đăng xuất", icon: <LogoutIcon />, path: "/login" },
];

export default function SuperAdminSidebar({ handleClose, open }) {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleNavigate = (item) => {
    if (item.title === "Logout") {
      dispatch(logout());
      navigate("/login");
    } else {
      navigate(`/super-admin${item.path}`);
    }
    if (isSmallScreen) handleClose();
  };

  return (
    <Drawer
      sx={{ zIndex: 1 }}
      anchor={"left"}
      open={open}
      onClose={handleClose}
      variant={isSmallScreen ? "temporary" : "permanent"}
      PaperProps={{
        sx: {
          backgroundColor: "white",
          color: "#4b5563", // gray-600
          borderRight: "none",
          width: isSmallScreen ? "70vw" : "20vw",
          boxShadow: "4px 0 24px rgba(0,0,0,0.02)",
        },
      }}
    >
      <div className="h-screen flex flex-col py-6">
        {/* Logo Area */}
        <div className="flex items-center justify-center px-6 mb-10">
          <div className="text-2xl font-extrabold text-green-500 tracking-tighter flex items-center gap-2">
            Admin
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 space-y-1 px-3">
          {menu.map((item) => {
            // Check active path
            const isActive =
              location.pathname ===
              `/super-admin${item.path === "/" ? "" : item.path}`;

            return (
              <div key={item.title} onClick={() => handleNavigate(item)}>
                <div
                  className={`px-4 py-3 flex items-center space-x-3 cursor-pointer transition-all duration-200 rounded-lg font-medium
                    ${
                      isActive
                        ? "bg-green-50 text-green-600 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }
                  `}
                >
                  <span
                    className={isActive ? "text-green-500" : "text-gray-400"}
                  >
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
}
