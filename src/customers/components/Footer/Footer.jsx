export const Footer = () => {
  return (
    <footer className="bg-green-600 text-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold mb-8">FastFood</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-2">
          <div>
            <h4 className="font-bold mb-4">Về FastFood</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-green-200">Giới thiệu</a>
              </li>
              <li>
                <a className="hover:text-green-200">Tuyển dụng</a>
              </li>
              <li>
                <a className="hover:text-green-200">Blog</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-green-200">Trung tâm hỗ trợ</a>
              </li>
              <li>
                <a className="hover:text-green-200">Liên hệ với chúng tôi</a>
              </li>
              <li>
                <a className="hover:text-green-200">Hợp tác nhà hàng</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Điều khoản & Chính sách</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-green-200">Điều khoản dịch vụ</a>
              </li>
              <li>
                <a className="hover:text-green-200">Chính sách bảo mật</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
