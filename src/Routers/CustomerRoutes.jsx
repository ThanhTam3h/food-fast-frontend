import { Route, Routes } from "react-router-dom";
import CreateRestaurantForm from "../Admin/AddRestaurants/CreateRestaurantForm";
import Checkout from "../customers/components/Checkout/Checkout";
import LoginForm from "../customers/components/Login/Login";
import Navbar from "../customers/components/Navbar/Navbar";

import RegistrationForm from "../customers/components/Register/Register";
import Search from "../customers/components/Search/Search";
import Verify from "../customers/components/Verify/Verify";
import PasswordChangeSuccess from "../customers/pages/Auth/PasswordChangeSuccess";
import Cart from "../customers/pages/Cart/Cart";
import HomePage from "../customers/pages/Home/HomePage";
import CreateMerchantForm from "../customers/pages/Merchant/CreateMerchantForm";
import NotFound from "../customers/pages/NotFound/NotFound";
import Orders from "../customers/pages/Orders/Orders";
import Partner from "../customers/pages/Partner/Partner";
import PaymentSuccess from "../customers/pages/PaymentSuccess/PaymentSuccess";
import ProductDetail from "../customers/pages/Product-detail/Product-detail";
import Profile from "../customers/pages/Profile/Profile";
import Restaurant from "../customers/pages/Restaurant/Restaurant";
import TrackingOrder from "../customers/pages/TrackingOrder/TrackingOrder";

const CustomerRoutes = () => {
  return (
    <div className="relative bg-white">
      <nav className="sticky top-0 z-50">
        <Navbar />
      </nav>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/account/register" element={<HomePage />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/register" element={<RegistrationForm />} />
        <Route exact path="/verify" element={<Verify />} />
        <Route exact path="/partner" element={<Partner />} />
        <Route exact path="/merchant" element={<CreateMerchantForm />} />
        <Route exact path="/orders" element={<Orders />} />
        <Route
          exact
          path="/tracking/:orderNumber"
          element={<TrackingOrder />}
        />
        <Route exact path="/restaurant/:id" element={<Restaurant />} />
        <Route exact path="product-detail/:id" element={<ProductDetail />} />
        <Route exact path="checkout/:id" element={<Checkout />} />
        <Route path="/cart/:id" element={<Cart />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/my-profile/*" element={<Profile />} />

        <Route path="/search" element={<Search />} />
        <Route
          path="/admin/add-restaurant"
          element={<CreateRestaurantForm />}
        />
        <Route
          exact
          path="/password_change_success"
          element={<PasswordChangeSuccess />}
        />
        <Route exact path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default CustomerRoutes;
