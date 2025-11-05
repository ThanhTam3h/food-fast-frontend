// import { Button, Chip, Divider, IconButton } from "@mui/material";
// import React from "react";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addItemToCart,
//   removeCartItem,
//   updateCartItem,
// } from "../../../State/Customers/Cart/cart.action";

// const CartItemCard = ({ item }) => {
//   const dispatch = useDispatch();
//   const jwt=localStorage.getItem("jwt");
//   const {auth}=useSelector(store=>store)
//   const handleUpdateCartItem = (value) => {
//     if(value===-1 && item.quantity==1){
//       handleRemoveCartItem()
//     }
//     const data={ cartItemId: item.id, quantity: item.quantity + value }
//     dispatch(
//       updateCartItem({data,jwt:auth.jwt || jwt})
//     );
//   };
//   const handleRemoveCartItem=()=>{
//     dispatch(removeCartItem({cartItemId:item.id,jwt:auth.jwt || jwt}))

//   }
//   return (
//     <div className="px-5">
//       <div className="lg:flex items-center lg:space-x-5">
//         <div>
//           <img
//             className="w-[5rem] h-[5rem] object-cover"
//             src={item.food.images[0]}
//             alt=""
//           />
//         </div>

//         <div className="flex items-center justify-between lg:w-[70%]">
//           <div className="space-y-1 lg:space-y-3 w-full ">
//             <p className="">{item.food.name}</p>
//             {
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center space-x-1">
//                   <IconButton
//                     onClick={() => handleUpdateCartItem(-1)}
//                     color="primary"
//                   >
//                     <RemoveCircleOutlineIcon />
//                   </IconButton>
//                   <div className="w-5 h-5 text-xs flex items-center justify-center ">
//                     {item.quantity}
//                   </div>

//                   <IconButton
//                     onClick={() => handleUpdateCartItem(1)}
//                     color="primary"
//                   >
//                     <AddCircleOutlineIcon />
//                   </IconButton>
//                 </div>
//               </div>
//             }
//           </div>

//           <p>₹{item.totalPrice}</p>
//         </div>
//       </div>
//       <div className="pt-3 space-x-2">
//         {item.ingredients.map((item)=><Chip label={item}/> )}
//       </div>

//   </div>
//   );
// };

// export default CartItemCard;

// Component Chi tiết món hàng
const CartItemCard = ({ item, quantity, formattedTotal, onQuantityChange }) => (
  <section className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5 transition-all hover:shadow-md">
    {/* Nút Tăng/Giảm số lượng */}
    <div className="flex items-center space-x-3 mr-4 flex-shrink-0">
      <button
        onClick={() => onQuantityChange(-1)}
        disabled={quantity === 1}
        className={`w-9 h-9 flex items-center justify-center rounded-full text-lg font-bold transition-all
          ${
            quantity === 1
              ? "text-gray-400 border border-gray-300 cursor-not-allowed bg-gray-50"
              : "text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:scale-105"
          }
        `}
      >
        −
      </button>

      <span className="font-bold text-lg text-gray-800 min-w-[2ch] text-center">
        {quantity}
      </span>

      <button
        onClick={() => onQuantityChange(1)}
        className="w-9 h-9 flex items-center justify-center rounded-full text-lg font-bold text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-all hover:scale-105"
      >
        +
      </button>
    </div>

    {/* Nội dung chính: ảnh + mô tả + giá */}
    <div className="flex items-center space-x-4 flex-grow min-w-0">
      {/* Ảnh món ăn - to hơn, bo tròn */}
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl overflow-hidden shadow-md flex-shrink-0">
        <img
          src="https://placehold.co/80x80/EAB308/ffffff?text=FOOD"
          alt={item.itemName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/80x80/EAB308/ffffff?text=FOOD";
          }}
        />
      </div>

      {/* Mô tả món ăn */}
      <div className="flex-grow min-w-0">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
          {item.itemName}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
          {item.descriptionLine1}
        </p>
        {item.descriptionLine2 && (
          <p className="text-xs text-gray-500 line-clamp-1">
            {item.descriptionLine2}
          </p>
        )}
      </div>

      {/* Giá - căn phải, to hơn */}
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-bold text-gray-900">
          {formattedTotal}.000 ₫
        </p>
      </div>
    </div>
  </section>
);

export default CartItemCard;
