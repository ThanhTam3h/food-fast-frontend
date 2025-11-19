import React, { useState, useCallback } from "react";

const Partner = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Validate email từ backend
  const validateEmail = async () => {
    const res = await fetch(
      "http://localhost:3000/api/v1/merchants/validate-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    if (!res.ok) return { exists: false };
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });
    setIsLoading(true);

    if (!email) {
      setStatus({ message: "Vui lòng nhập Email.", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      // 1️⃣ Kiểm tra email
      const check = await validateEmail();
      if (check.exists) {
        setStatus({
          message: "Email này đã đăng ký trước đó!",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // 2️⃣ Nếu ok → gửi đăng ký (mock API)
      await new Promise((r) => setTimeout(r, 1200));

      setStatus({
        message: "Đăng ký thành công! Chúng tôi sẽ liên hệ qua Email.",
        type: "success",
      });

      setEmail("");
    } catch (err) {
      setStatus({
        message: "Có lỗi xảy ra, vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "px-4 py-3 text-black border-2 border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500 transition text-base w-full";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Trở thành Đối tác của Grab
        </h1>

        {status.message && (
          <div
            className={`p-3 mb-4 rounded-lg text-sm font-semibold ${
              status.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              placeholder="Nhập email của bạn"
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white font-bold text-lg rounded-xl shadow-lg transition ${
              isLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký ngay"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Partner;
