// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import {
//   Backdrop,
//   CircularProgress,
//   Divider,
//   FormControl,
//   FormControlLabel,
//   Grid,
//   Radio,
//   RadioGroup,
//   Typography,
// } from "@mui/material";
// import MenuItemCard from "../../components/MenuItem/MenuItemCard";
// import { useDispatch, useSelector } from "react-redux";
// import { getRestaurantById, getRestaurantsCategory } from "../../../State/Customers/Restaurant/restaurant.action";
// import { getMenuItemsByRestaurantId } from "../../../State/Customers/Menu/menu.action";
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import TodayIcon from '@mui/icons-material/Today';

// const categories = [
//   "Thali",
//   "Starters",
//   "Indian Main Course",
//   "Rice and Biryani",
//   "Breads",
//   "Accompaniments",
//   "Dessert",
// ];

// const foodTypes = [
//   {label:"All",value:"all"},
//   { label: "Vegetarian Only", value: "vegetarian" },
//   { label: "Non-Vegetarian Only", value: "non_vegetarian" },
//   {label:"Seasonal",value:"seasonal"},

// ];
// const Restaurant = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { id } = useParams();
//   const { restaurant, menu } = useSelector((store) => store);
//   const navigate = useNavigate();

//   const decodedQueryString = decodeURIComponent(location.search);
//   const searchParams = new URLSearchParams(decodedQueryString);
//   const foodType = searchParams.get("food_type");
//   const foodCategory = searchParams.get("food_category");
//   const jwt=localStorage.getItem("jwt")

//   useEffect(() => {
//     dispatch(
//       getRestaurantById({
//         jwt: localStorage.getItem("jwt"),
//         restaurantId: id,
//       })
//     );
//     dispatch(
//       getMenuItemsByRestaurantId({
//         jwt: localStorage.getItem("jwt"),
//         restaurantId: id,
//         seasonal: foodType==="seasonal",
//         vegetarian: foodType==="vegetarian",
//         nonveg: foodType==="non_vegetarian",
//         foodCategory: foodCategory || ""
//       })
//     );
//     dispatch(getRestaurantsCategory({restaurantId:id,jwt}))
//   }, [id,foodType,foodCategory]);

//   const handleFilter = (e, value) => {
//     const searchParams = new URLSearchParams(location.search);

//     if(value==="all"){
//       searchParams.delete(e.target.name);
//       searchParams.delete("food_category");
//     }
//     else searchParams.set(e.target.name, e.target.value);

//     const query = searchParams.toString();
//     navigate({ search: `?${query}` });
//   };

//   return (
//     <><div className="px-5 lg:px-20 ">
//       <section>
//         <h3 className="text-gray-500 py-2 mt-10">
//           Home/{restaurant.restaurant?.address.country}/
//           {restaurant.restaurant?.name}/{restaurant.restaurant?.id}/Order Online
//         </h3>
//         <div>

//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//             <img
//             className="w-full h-[40vh] object-cover"
//             src={restaurant.restaurant?.images[0]}
//             alt=""
//           />
//             </Grid>
//             <Grid item xs={12} lg={6}>
//             <img
//             className="w-full h-[40vh] object-cover"
//             src={restaurant.restaurant?.images[1]}
//             alt=""
//           />
//             </Grid>
//             <Grid item xs={12} lg={6}>
//             <img
//             className="w-full h-[40vh] object-cover"
//             src={restaurant.restaurant?.images[2]}
//             alt=""
//           />
//             </Grid>
//           </Grid>
//         </div>
//         <div className="pt-3 pb-5">
//           <h1 className="text-4xl font-semibold">
//             {restaurant.restaurant?.name}
//           </h1>
//           <p className="text-gray-500 mt-1">{restaurant.restaurant?.description}</p>
//           <div className="space-y-3 mt-3">
//               <p className="text-gray-500 flex items-center gap-3">
//             <LocationOnIcon/> <span>{restaurant.restaurant?.address.streetAddress}
//               </span>
//           </p>
//           <p className="flex items-center gap-3 text-gray-500">
//            <TodayIcon/> <span className=" text-orange-300"> {restaurant.restaurant?.openingHours} (Today)</span>
//           </p>
//           </div>

//         </div>
//       </section>
//       <Divider />

//       <section className="pt-[2rem] lg:flex relative ">
//         <div className="space-y-10 lg:w-[20%] filter">
//           <div className="box space-y-5 lg:sticky top-28">

//             <div className="">
//               <Typography sx={{ paddingBottom: "1rem" }} variant="h5">
//                 Food Type
//               </Typography>
//               <FormControl className="py-10 space-y-5" component="fieldset">
//                 <RadioGroup
//                   name="food_type"
//                   value={foodType || "all"}
//                   onChange={handleFilter}
//                 >
//                   {foodTypes?.map((item, index) => (
//                     <FormControlLabel
//                       key={index}
//                       value={item.value}
//                       control={<Radio />}
//                       label={item.label}
//                       sx={{ color: "gray" }}
//                     />
//                   ))}
//                 </RadioGroup>
//                 <Divider/>
//                 <Typography sx={{ paddingBottom: "1rem" }} variant="h5">
//                 Food Category
//               </Typography>
//                 <RadioGroup
//                   name="food_category"
//                   value={foodCategory || "all"}
//                   onChange={handleFilter}
//                 >
//                    <FormControlLabel

//                       value={"all"}
//                       control={<Radio />}
//                       label={"All"}
//                       sx={{ color: "gray" }}
//                     />
//                   {restaurant?.categories.map((item, index) => (
//                     <FormControlLabel
//                       key={index}
//                       value={item.name}
//                       control={<Radio />}
//                       label={item.name}
//                       sx={{ color: "gray" }}
//                     />
//                   ))}
//                 </RadioGroup>
//               </FormControl>
//             </div>
//           </div>
//         </div>
//         <div className="lg:w-[80%] space-y-5 lg:pl-10">
//           {menu?.menuItems.map((item) => (
//             <MenuItemCard item={item} />
//             // <p>ashok</p>
//           ))}
//         </div>
//       </section>
//     </div>
//     <Backdrop
//   sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
//   open={menu.loading || restaurant.loading}

// >
//   <CircularProgress color="inherit" />
// </Backdrop>
//     </>

//   );
// };

// export default Restaurant;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getRestaurantById, getRestaurantsCategory } from "../../../State/Customers/Restaurant/restaurant.action";

// Dữ liệu giả lập mô phỏng cấu trúc menu của bạn
const menuData = [
  {
    title: "Dành cho bạn",
    id: "danh-cho-ban",
    products: [
      {
        id: 1,
        title: "Gà Hấp Mắm Nhĩ - Nguyên Con",
        description:
          "Gà ta hấp mắm nhĩ, da vàng, thịt mềm, đậm đà (10 phần ăn)",
        price: "245.000đ",
        imageUrl:
          "https://placehold.co/100x100/94a3b8/ffffff?text=Ga_Hap_Mam_Nhi",
      },
      {
        id: 2,
        title: "Gà Hấp Mắm Nhĩ - 1/2 Con",
        description: "Gà ta hấp mắm nhĩ, da vàng, thịt mềm, đậm đà (5 phần ăn)",
        price: "135.000đ",
        imageUrl: "https://placehold.co/100x100/94a3b8/ffffff?text=1/2_Con",
      },
      {
        id: 3,
        title: "Gà Hấp Lá Chanh - Nguyên Con",
        description:
          "Gà hấp lá chanh tươi, giữ trọn vị ngọt tự nhiên của gà (10 phần ăn)",
        price: "235.000đ",
        imageUrl:
          "https://placehold.co/100x100/94a3b8/ffffff?text=Ga_Hap_La_Chanh",
      },
      {
        id: 4,
        title: "Gà Hấp Muối Ớt Chanh",
        description: "Gà hấp với muối ớt chanh đặc biệt, thơm ngon, vừa miệng",
        price: "132.000đ",
        imageUrl:
          "https://placehold.co/100x100/94a3b8/ffffff?text=Muoi_Ot_Chanh",
      },
    ],
  },
  {
    title: "Menu Hấp Mắm (Không Đồ Lòng & Gà Mềm Không Dai)",
    id: "menu-hap-mam",
    products: [
      {
        id: 5,
        title: "Chân Gà Hấp Hành Lá - 10 Chân",
        description: "Chân gà hấp hành lá, tươi giòn, thơm lừng vị hấp",
        price: "108.000đ",
        imageUrl: "https://placehold.co/100x100/fecaca/000?text=Chan_Ga",
      },
      {
        id: 6,
        title: "Cơm Tấm Mộc - Hòa Cơm",
        description:
          "Cơm tấm mộc, trộn với nước mắm gia truyền, hương vị đặc trưng",
        price: "132.000đ",
        imageUrl: "https://placehold.co/100x100/fecaca/000?text=Com_Tam",
      },
      {
        id: 7,
        title: "Nước Ngọt Chai 300ml",
        description: "Thùng 24 chai Coca Cola/Pepsi/7UP",
        price: "15.000đ",
        imageUrl: "https://placehold.co/100x100/fecaca/000?text=Nuoc_Ngot",
      },
      {
        id: 8,
        title: "Trà Sữa Thái",
        description: "Trà sữa Thái nguyên chất, thơm ngon, đậm vị trà",
        price: "28.000đ",
        imageUrl: "https://placehold.co/100x100/fecaca/000?text=Tra_Sua",
      },
    ],
  },
  {
    title: "Gà Hấp Mắm, Hấp Lá Chanh",
    id: "ga-hap-chanh",
    products: [
      {
        id: 9,
        title: "Gà Hấp Mắm - 1/2 Con",
        description: "Thịt mềm, không dai, ăn kèm với xôi chiên không béo",
        price: "131.000đ",
        imageUrl: "https://placehold.co/100x100/d8b4fe/000?text=Gia_Vi",
      },
      {
        id: 10,
        title: "Chả Giò Hấp Hành - Nguyên Con",
        description: "Thơm ngon, thịt mềm, không dai, thấm vị mắm nhĩ",
        price: "235.000đ",
        imageUrl: "https://placehold.co/100x100/d8b4fe/000?text=Cha_Gio",
      },
      {
        id: 11,
        title: "Cơm Tấm Mộc - Đặc Biệt",
        description: "Cơm tấm đặc biệt với sườn, bì, chả, trứng ốp la",
        price: "141.000đ",
        imageUrl: "https://placehold.co/100x100/d8b4fe/000?text=Com_Tam_DB",
      },
    ],
  },
];

// Component Card Sản Phẩm Cơ Bản
const ProductCard = ({ title, description, price, imageUrl }) => (
  // Sử dụng bg-white và hover shadow để nổi bật
  <div className="flex p-3 sm:p-4 border border-gray-100 rounded-xl shadow-lg mb-4 bg-white transition duration-300 hover:shadow-xl">
    {/* Phần nội dung chi tiết */}
    <div className="flex-grow pr-3">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
        {description}
      </p>

      {/* Giá và nút thêm */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-base sm:text-lg font-bold text-red-600">
          {price}
        </span>
        <button
          className="text-green-600 border-2 border-green-500 bg-green-50 rounded-full w-7 h-7 flex items-center justify-center text-xl leading-none transition duration-150 hover:bg-green-100 active:bg-green-200"
          aria-label={`Thêm ${title} vào giỏ hàng`}
        >
          {/* Icon dấu cộng */}
          <span className="pb-0.5">+</span>
        </button>
      </div>
    </div>

    {/* Phần hình ảnh */}
    <div className="flex-shrink-0">
      <img
        src={imageUrl}
        alt={title}
        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/96x96/f1f1f1/000?text=No_Image";
        }}
      />
    </div>
  </div>
);

// Component Danh Mục (Section)
const MenuSection = ({ name, products, id }) => (
  <section id={id} className="mb-10 pt-4">
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5 border-b-2 border-red-500/20 pb-2">
      {name}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  </section>
);

const Restaurant = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = React.useState(menuData[0].id);
  const dispatch = useDispatch();
  const { restaurant, categories } = useSelector((state) => state?.restaurant);

  console.log(categories);

  useEffect(() => {
    dispatch(getRestaurantById(id));
    dispatch(getRestaurantsCategory(id))
  }, [id, dispatch]);

  // Hàm cuộn đến section tương ứng
  const scrollToSection = (id) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Container chính */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* --- Phần Header & Thông tin Chung --- */}
        <header className="mb-6 bg-white p-4 rounded-xl shadow-md">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {restaurant?.name}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
            <span className="flex items-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-yellow-500 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.691-.921 1.99 0l3.058 9.404a1.5 1.5 0 01-1.424 2.052H7.315a1.5 1.5 0 01-1.424-2.052l3.058-9.404z" />
              </svg>
              {restaurant?.description}
            </span>
            {/* <span className="flex items-center mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              30 phút - 3.7 km
            </span> */}
            <span className="text-green-600 font-medium">
              {restaurant?.is_temporarily_closed == false
                ? "Đóng cửa"
                : "Đang mở cửa"}
            </span>
          </div>
        </header>

        {/* --- Thanh Menu (Chọn Món) - Sticky Navigation --- */}
        <nav className="sticky top-0 bg-white z-20 py-3 border-b border-gray-200 shadow-md mb-6 overflow-x-auto whitespace-nowrap -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex space-x-3 pb-1">
            {categories?.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ease-in-out flex-shrink-0
                  ${
                    activeTab === section.id
                      ? "text-white bg-red-600 shadow-lg"
                      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                  }
                `}
              >
                {section.name}
              </button>
            ))}
          </div>
        </nav>

        {/* --- Các Section Menu Chính --- */}
        {/* {categories?.map((section) => (
          <MenuSection key={section.id} {...section} />
        ))} */}

        {/* Footer giả */}
        <div className="text-center text-sm text-gray-400 mt-10 p-4 border-t">
          --- Kết thúc danh sách sản phẩm ---
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
