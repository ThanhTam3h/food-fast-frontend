import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllCartItems,
  removeCartItem,
  updateCartItem,
} from "../../../State/Customers/Cart/cart.action";
import { CartFooter } from "../../components/CartItem/CartFooter";
import { CartHeader } from "../../components/CartItem/CartHeader";
import CartItemCard from "../../components/CartItem/CartItemCard";
import { useCheckRouter } from "../../util/checkRouter";
import { formatCurrency } from "../../util/formartCurrency";
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const hide = useCheckRouter("checkout");

  // Lấy state
  const { jwt } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const navigateToLogin = () => {
    navigate("/login");
  };
  // Load giỏ hàng khi có jwt và merchantId
  useEffect(() => {
    if (jwt && id) {
      dispatch(getAllCartItems({ merchantId: id, jwt }));
    }
  }, [jwt, id, dispatch]);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = async (cartItemId, delta, currentQuantity) => {
    if (!cartItemId) return;

    try {
      if (delta < 0 && currentQuantity === 1) {
        await dispatch(
          removeCartItem({ reqData: { merchantId: id, cartItemId, jwt } })
        );
      } else {
        const action = delta > 0 ? "increment" : "decrement";
        await dispatch(
          updateCartItem({ cartItemId, merchantId: id, action, jwt })
        );
      }
      dispatch(getAllCartItems({ merchantId: id, jwt }));
    } catch (err) {
      console.error("Cập nhật số lượng thất bại", err);
    }
  };

  const formattedTotal = cart?.data?.total
    ? formatCurrency(cart.data.total)
    : "0";

  // Kiểm tra trạng thái
  const isLoggedIn = !!jwt;
  const isCartEmpty = cart?.data?.items?.length === 0;
  const isLoading = !cart;

  return (
    <div
      className={`flex justify-center mx-auto bg-white w-full flex-col font-sans shadow-xl ${
        hide ? "h-auto" : "min-h-screen"
      }`}
    >
      {!hide && <CartHeader />}

      <main className="flex-grow p-4 overflow-y-auto">
        {/* 1. Chưa đăng nhập */}
        {!isLoggedIn && (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Vui lòng đăng nhập
            </h2>
            <p className="text-gray-600 mb-6 max-w-xs">
              Đăng nhập để xem giỏ hàng và tiếp tục đặt món
            </p>
            <div
              onClick={navigateToLogin}
              className="hidden md:flex items-center text-sm font-semibold rounded-full py-3 px-4 cursor-pointer bg-green-600 text-white hover:shadow-md"
            >
              Đăng nhập/Đăng ký
            </div>
          </div>
        )}

        {/* 2. Đã đăng nhập, giỏ hàng rỗng */}
        {isLoggedIn && !isLoading && isCartEmpty && (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-6 max-w-xs">
              Hãy thêm món ăn yêu thích vào giỏ hàng
            </p>

            <div
              onClick={() => navigate(`/restaurant/${id}`)}
              className="hidden md:flex items-center text-sm font-semibold rounded-full py-3 px-4 cursor-pointer bg-green-600 text-white hover:shadow-md"
            >
              Xem menu
            </div>
          </div>
        )}

        {/* 3. Đã đăng nhập, có giỏ hàng */}
        {isLoggedIn && !isLoading && !isCartEmpty && (
          <>
            {/* Tên quán */}
            {!hide && (
              <section className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {cart?.data?.merchantName}
                </h2>
              </section>
            )}

            {/* Danh sách món */}
            {cart?.data?.items?.map((item) => (
              <section key={item.id} className="mb-4">
                <CartItemCard
                  item={item?.id}
                  product={item?.product}
                  quantity={item?.quantity}
                  toppings={item?.toppings}
                  subTotal={item?.subTotal}
                  formattedTotal={formattedTotal}
                  onQuantityChange={(delta) =>
                    handleQuantityChange(item.id, delta, item.quantity)
                  }
                />
              </section>
            ))}

            {/* Tổng + phí */}
            <section className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center mb-1">
                <p className="text-base font-normal text-gray-800">Tổng</p>
                <p className="text-base font-semibold text-gray-900">
                  {formattedTotal}
                </p>
              </div>
              {!hide && (
                <p className="text-sm text-gray-500 mt-1">
                  Phí vận chuyển sẽ xuất hiện sau khi bạn xem lại đơn hàng
                </p>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer - chỉ hiện khi có hàng */}
      {!hide && isLoggedIn && !isCartEmpty && (
        <CartFooter
          formattedTotal={formattedTotal}
          onClick={() => navigate(`/checkout/${id}`)}
        />
      )}
    </div>
  );
};

export default Cart;
