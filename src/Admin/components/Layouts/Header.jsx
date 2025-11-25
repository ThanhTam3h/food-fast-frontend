import { Clock, ShoppingBag } from "lucide-react";

export const Header = ({ storeName, onClick }) => {
  return (
    <header className="bg-white shadow-md h-20 flex items-center justify-between p-4 pl-20 lg:pl-72 fixed w-full top-0 z-10">
      <div className="text-xl font-semibold text-green-500 flex items-center">
        <ShoppingBag className="w-5 h-5 mr-2 text-green-500" />
        {storeName}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-green-500" />
          <span className="hidden sm:block"></span>
        </div>
        <button
          onClick={onClick}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
        >
          Đăng Xuất
        </button>
      </div>
    </header>
  );
};
