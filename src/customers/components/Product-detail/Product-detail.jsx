import React, { useState, useMemo } from "react";
import { X, ChevronDown, Plus, Minus } from "lucide-react";

// Dữ liệu giả lập cho các lựa chọn sản phẩm
const productData = {
  name: "2 Gà Rán Giòn + 2 Mì Ý Jolly + 1 Khoai Tây Chiên Cỡ Vừa + 2 Nước Ngọt Thường",
  basePrice: 145000,
  details: [
    "2 Gà Rán Giòn",
    "2 Mì Ý Jolly",
    "1 Khoai Tây Chiên Cỡ Vừa",
    "2 Nước Ngọt Thường",
    "2 Gói Sốt Cà chua",
    "1 Gói Sốt",
  ],
  sections: [
    {
      title: "Thêm nước sốt",
      subtitle: "Tối đa 3",
      type: "checkbox",
      key: "addOnSauce",
      items: [
        { id: "sauce_ms", name: "Thêm 2 gói Sốt M&S", price: 1000 },
        { id: "sauce_ketchup", name: "Thêm 2 gói Sốt Cà Chua", price: 1000 },
      ],
    },
    {
      title: "Chọn Gà",
      subtitle: "Chọn 1",
      type: "radio",
      key: "chooseChicken",
      items: [
        {
          id: "chicken_crispy",
          name: "1 Gà Giòn + 1 Gà Cay",
          price: 2000,
          default: true,
        },
        { id: "chicken_spicy", name: "2 Gà với nước sốt cay", price: 4000 },
      ],
    },
    {
      title: "Chọn Mì Ý",
      subtitle: "Chọn 1",
      type: "radio",
      key: "chooseSpaghetti",
      items: [
        {
          id: "spaghetti_medium",
          name: "2 Mì Ý - Mì Ý Ý Cỡ Vừa",
          price: 10000,
          default: true,
        },
        { id: "spaghetti_large", name: "2 Mì Ý Cỡ Lớn", price: 20000 },
        {
          id: "spaghetti_jolly",
          name: "1 Mì Ý Jolly + 1 Mì Ý Cay",
          price: 5000,
        },
        { id: "spaghetti_spicy", name: "2 Mì Ý Cay", price: 10000 },
        { id: "spaghetti_jumbo", name: "2 Mì Ý Cay Cỡ Lớn", price: 30000 },
      ],
    },
    {
      title: "Chọn Khoai Tây",
      subtitle: "Chọn 1",
      type: "radio",
      key: "choosePotatoes",
      items: [
        {
          id: "potato_sweet_medium",
          name: "1 Khoai Tây Chiên Ngọt (Cỡ Vừa)",
          price: 5000,
          default: true,
        },
        {
          id: "potato_sweet_bbq",
          name: "1 Khoai Tây Chiên Ngọt với Sốt BBQ Cỡ Vừa",
          price: 10000,
        },
        {
          id: "potato_french_large",
          name: "1 Khoai Tây Chiên Cỡ Lớn",
          price: 10000,
        },
        {
          id: "potato_bbq_large",
          name: "1 Khoai Tây Chiên Ngọt BBQ Cỡ Lớn",
          price: 15000,
        },
      ],
    },
    {
      title: "Chọn Thức Uống 1",
      subtitle: "Chọn 1",
      type: "radio",
      key: "chooseDrink1",
      items: [
        {
          id: "drink1_pepsi_m",
          name: "1 Pepsi Cỡ Vừa",
          price: 5000,
          default: true,
        },
        { id: "drink1_rare_m", name: "1 Rare Deal Cỡ Vừa", price: 10000 },
        { id: "drink1_7up_m", name: "1 7Up Cỡ Vừa", price: 10000 },
        { id: "drink1_pepsi_l", name: "1 Pepsi Cỡ Lớn", price: 5000 },
        {
          id: "drink1_cocoa_m",
          name: "1 Sữa Cacao Đá Lạnh (Cỡ Vừa)",
          price: 15000,
        },
        {
          id: "drink1_cocoa_l",
          name: "1 Sữa Cacao Đá Lạnh Cỡ Lớn",
          price: 15000,
        },
        { id: "drink1_mango", name: "1 Nước Ép Xoài Đào Cỡ Lớn", price: 15000 },
        { id: "drink1_tea", name: "1 Trà Chanh Thái", price: 10000 },
      ],
    },
    {
      title: "Chọn Thức Uống 2",
      subtitle: "Chọn 1",
      type: "radio",
      key: "chooseDrink2",
      items: [
        {
          id: "drink2_pepsi_m",
          name: "1 Pepsi Cỡ Vừa",
          price: 5000,
          default: true,
        },
        { id: "drink2_rare_m", name: "1 Rare Deal Cỡ Vừa", price: 10000 },
        { id: "drink2_7up_m", name: "1 7Up Cỡ Vừa", price: 10000 },
        { id: "drink2_pepsi_l", name: "1 Pepsi Cỡ Lớn", price: 5000 },
        {
          id: "drink2_cocoa_m",
          name: "1 Sữa Cacao Đá Lạnh (Cỡ Vừa)",
          price: 15000,
        },
        {
          id: "drink2_cocoa_l",
          name: "1 Sữa Cacao Đá Lạnh Cỡ Lớn",
          price: 15000,
        },
        { id: "drink2_mango", name: "1 Nước Ép Xoài Đào Cỡ Lớn", price: 15000 },
        { id: "drink2_tea", name: "1 Trà Chanh Thái", price: 10000 },
      ],
    },
  ],
};

// Hàm định dạng tiền tệ Việt Nam Đồng
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(amount)
    .replace("₫", "đ");
};

// Tìm các lựa chọn mặc định và tạo trạng thái ban đầu
const getInitialSelections = (sections) => {
  return sections.reduce((acc, section) => {
    if (section.type === "radio") {
      const defaultItem = section.items.find((item) => item.default);
      acc[section.key] = defaultItem ? defaultItem.id : null;
    } else if (section.type === "checkbox") {
      // Checkbox bắt đầu trống
      acc[section.key] = [];
    }
    return acc;
  }, {});
};

const defaultSelections = getInitialSelections(productData.sections);

const ProductDetail = () => {
  const [selections, setSelections] = useState(defaultSelections);
  const [quantity, setQuantity] = useState(1);
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);

  // Xử lý thay đổi lựa chọn (radio/checkbox)
  const handleSelectionChange = (key, itemId, type) => {
    setSelections((prev) => {
      if (type === "radio") {
        // Radio: Đặt ID mới
        return { ...prev, [key]: itemId };
      } else if (type === "checkbox") {
        // Checkbox: Thêm/xóa ID
        const currentSelections = prev[key] || [];
        if (currentSelections.includes(itemId)) {
          return {
            ...prev,
            [key]: currentSelections.filter((id) => id !== itemId),
          };
        } else {
          return { ...prev, [key]: [...currentSelections, itemId] };
        }
      }
      return prev;
    });
  };

  // Tính tổng giá tiền dựa trên các lựa chọn
  const totalCost = useMemo(() => {
    let cost = productData.basePrice;

    productData.sections.forEach((section) => {
      const selectedId = selections[section.key];

      if (section.type === "radio" && selectedId) {
        const selectedItem = section.items.find(
          (item) => item.id === selectedId
        );
        // Do tất cả các mục radio đều có giá > 0 (là giá nâng cấp), ta cộng vào.
        // Cần đảm bảo rằng các mục mặc định cũng được tính giá (nếu có).
        // Ta chỉ tính phí nâng cấp (price > 0), nhưng vì dữ liệu giả định,
        // ta giả định rằng tất cả các giá hiển thị là chi phí nâng cấp so với món cơ bản
        // và cộng chúng vào.
        if (selectedItem) {
          cost += selectedItem.price;
        }
      } else if (section.type === "checkbox" && Array.isArray(selectedId)) {
        selectedId.forEach((itemId) => {
          const selectedItem = section.items.find((item) => item.id === itemId);
          if (selectedItem) {
            cost += selectedItem.price;
          }
        });
      }
    });

    return cost * quantity;
  }, [selections, quantity]);

  // Component con để hiển thị một nhóm lựa chọn (radio hoặc checkbox)
  const SelectionGroup = ({ section }) => {
    const { title, subtitle, items, type, key } = section;
    const currentSelection = selections[key];

    return (
      <div className="border-b border-gray-100 py-4 px-4 sm:px-6">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mb-3">{subtitle}</p>

        <div className="space-y-3">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex justify-between items-center cursor-pointer"
              onClick={() => handleSelectionChange(key, item.id, type)}
            >
              <div className="flex items-center space-x-3">
                {/* Custom Radio/Checkbox */}
                <div
                  className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all ${
                    type === "radio"
                      ? currentSelection === item.id
                        ? "border-red-500 bg-red-500"
                        : "border-gray-400"
                      : currentSelection.includes(item.id)
                      ? "bg-red-500 border-red-500 rounded"
                      : "border-gray-400 rounded"
                  }`}
                >
                  {type === "radio" && currentSelection === item.id && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                  {type === "checkbox" &&
                    currentSelection.includes(item.id) && (
                      <X size={14} className="text-white transform rotate-45" /> // Dùng X xoay 45 độ làm dấu check
                    )}
                </div>

                <span className="text-gray-700">{item.name}</span>
              </div>
              {item.price > 0 && (
                <span className="text-gray-700 font-medium text-sm">
                  {formatCurrency(item.price)}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 flex flex-col items-center">
      {/* Container Chính */}
      <div className=" bg-white shadow-xl relative pb-28">
        {/* Thông tin Sản phẩm Chính */}
        <div className="p-4 sm:p-6 flex items-start space-x-4 border-b border-gray-100">
          <img
            src="https://placehold.co/80x80/ef4444/ffffff?text=FOOD"
            alt="Product Image"
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/80x80/ef4444/ffffff?text=FOOD";
            }}
          />
          <div className="flex-grow">
            <h1 className="text-lg font-bold text-gray-800 leading-snug">
              {productData.name}
            </h1>
            <p className="text-xl font-extrabold text-red-500 mt-1">
              {formatCurrency(productData.basePrice)}
            </p>
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              {productData.details.map((detail, index) => (
                <p key={index} className="flex items-start">
                  {/* Dùng dấu gạch ngang nhỏ cho danh sách */}
                  <span className="mr-1">-</span>
                  <span>{detail}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Danh sách các lựa chọn */}
        {productData.sections.map((section) => (
          <SelectionGroup key={section.key} section={section} />
        ))}

        {/* Hướng dẫn đặc biệt */}
        <div className="py-4 px-4 sm:px-6 border-b border-gray-100">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsNotesExpanded(!isNotesExpanded)}
          >
            <h2 className="text-lg font-bold text-gray-800">
              Hướng dẫn đặc biệt
            </h2>
            <ChevronDown
              size={20}
              className={`text-gray-500 transition-transform ${
                isNotesExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isNotesExpanded ? "max-h-40 mt-3" : "max-h-0"
            }`}
          >
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500"
              rows="3"
              placeholder="Ví dụ: Không hành, không ớt..."
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer (Thanh Đặt Hàng Cố Định) */}
      <div className="fixed bottom-0 max-width w-full  bg-white shadow-2xl p-4 border-t border-gray-200 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <Minus size={20} />
            </button>
            <span className="text-xl font-bold text-gray-800 w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition hover:text-white hover:bg-red-500"
            >
              <Plus size={20} />
            </button>
          </div>
          <button className="flex-1 ml-4 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition duration-150 text-base sm:text-lg">
            Thêm vào giỏ hàng - {formatCurrency(totalCost)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
