import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar, Badge, IconButton, Menu, MenuItem } from "@mui/material";
import { green, pink } from "@mui/material/colors";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../State/Authentication/Action";
import Auth from "../../pages/Auth/Auth";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useSelector((store) => store);
  const user = useSelector((state) => state.auth?.user);
  console.log(user)
  const dispatch = useDispatch();
  const isRestaurantPage =
    /^\/restaurant\/\d+$/.test(location.pathname) ||
    /^\/cart\/\d+$/.test(location.pathname);

  const email = user?.email || user?.data?.email || user?.user?.email || "";
  const avatarText = email ? email.charAt(0).toUpperCase() : "";

  const userRole =
    (user && Array.isArray(user.roles) && user.roles[0]) ||
    user?.role ||
    (user?.data && user.data.roles && user.data.roles[0]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseAuthModel = () => {
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseMenu();
  };

  const navigateToCart = () => {
    const path = location.pathname;
    const match = path.match(/\/restaurant\/(\d+)/);
    const merchantId = match ? match[1] : null;

    if (merchantId) {
      navigate(`/cart/${merchantId}`);
    }
  };

  const navigateToProfile = (e) => {
    userRole === "customer"
      ? navigate("/my-profile")
      : navigate("/admin/restaurant");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToOrders = () => {
    navigate("/orders");
  };

  const navigateToPartner = () => {
    navigate("/register-merchant");
  };

  return (
    <div className="fixed text-gray-900 top-0 left-0 right-0 z-50 py-3 px-5 lg:px-20 flex justify-between items-center bg-white shadow-md border-b border-gray-100">
      <div className="flex items-center space-x-4">
        <div
          onClick={navigateToHome}
          className="cursor-pointer flex items-center space-x-2"
        >
          {/* SVG Logo - Biểu tượng Drone giao hàng */}
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Thân drone */}
            <rect
              x="7"
              y="5"
              width="10"
              height="2"
              rx="1"
              fill="currentColor"
              className="text-green-500 fill-current"
            />
            {/* Cánh quạt */}
            <path d="M4 8h2m12 0h2M12 4v2m0 12v2" />
            {/* Khung dưới và dây treo */}
            <path d="M6 10l-1 4h14l-1-4M12 14v4" />
            {/* Hộp hàng */}
            <rect
              x="10"
              y="17"
              width="4"
              height="4"
              rx="1"
              fill="currentColor"
              className="text-pink-500 fill-current"
            />
            {/* Thân chính */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 7l-3 3-3-3"
            />
          </svg>

          <span className="text-xl font-extrabold text-green-600 tracking-wide">
            FastFood
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2 lg:space-x-8">
        <div
          onClick={navigateToPartner}
          className="hidden md:flex items-center text-sm font-semibold text-green-600 bg-transparent border border-green-600 rounded-full py-3 px-4 cursor-pointer hover:shadow-md"
        >
          Trở thành đối tác
        </div>

        <div className="flex items-center">
          {email ? (
            <div
              id="user-menu-button"
              aria-controls={open ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              // Open menu for merchant/admin, navigate directly to profile for customer
              onClick={handleOpenMenu}
              className="font-semibold cursor-pointer rounded-full p-1 transition-transform hover:scale-105"
            >
              <Avatar
                // Custom color based on role for distinction
                sx={{
                  bgcolor: userRole === "customer" ? green[600] : pink[500],
                  color: "white",
                  width: 36,
                  height: 36,
                  fontSize: "1rem",
                }}
              >
                {avatarText}
              </Avatar>
            </div>
          ) : (
            <div
              onClick={navigateToLogin}
              className="hidden md:flex items-center text-sm font-semibold rounded-full py-3 px-4 cursor-pointer bg-green-600 text-white hover:shadow-md"
            >
              Đăng nhập/Đăng ký
            </div>
          )}

          {/* User Menu (for merchant/admin roles) */}
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            MenuListProps={{
              "aria-labelledby": "user-menu-button",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: "0.75rem",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                minWidth: "180px",
                bgcolor: "white",
                color: "#333",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                const navPath =
                  userRole === "merchant"
                    ? "/admin/restaurant"
                    : userRole === "super-admin"
                    ? "/super-admin"
                    : "/my-profile";
                navigate(navPath);
                handleCloseMenu();
              }}
              sx={{
                color: "#374151",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#ecfdf5", // green-50
                  color: "#16a34a", // green-600
                },
              }}
            >
              Quản lý tài khoản
            </MenuItem>
            <MenuItem
              onClick={navigateToOrders}
              sx={{
                color: "#374151",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#ecfdf5",
                  color: "#16a34a",
                },
              }}
            >
              Quản lý đơn hàng
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "#374151",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#fee2e2",
                  color: "#b91c1c",
                },
              }}
            >
              Đăng xuất
            </MenuItem>
          </Menu>
        </div>

        {isRestaurantPage && (
          <IconButton onClick={navigateToCart} x={{ color: "#4b5563" }}>
            <Badge color="error" badgeContent={cart?.cart?.data?.items?.length}>
              <ShoppingCartIcon
                className="text-4xl  text-green-600"
                sx={{ fontSize: "2rem" }}
              />
            </Badge>
          </IconButton>
        )}
      </div>

      <Auth handleClose={handleCloseAuthModel} />
    </div>
  );
};

export default Navbar;
