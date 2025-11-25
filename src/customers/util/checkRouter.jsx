import { useLocation } from "react-router-dom";

export const useCheckRouter = (page) => {
  const location = useLocation();

  switch (page) {
    case "checkout":
      return /^\/checkout\/[^\/]+$/.test(location.pathname);
    case "auth":
      // Kiểm tra xem đường dẫn có chứa /login, /register, hoặc /verify ở bất kỳ đâu không
      // Biểu thức chính quy:
      // \/(login|register|verify)
      // - khớp với dấu / theo sau là login HOẶC register HOẶC verify
      return /\/(login|register|verify)/.test(location.pathname);
    default:
      return false;
  }
};
