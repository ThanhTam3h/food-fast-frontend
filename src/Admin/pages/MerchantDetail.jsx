import axios from "axios";
import {
  Banknote,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Hash,
  Home,
  Image,
  Key,
  Loader2,
  Lock,
  Mail,
  Map as MapIcon,
  MapPin,
  Phone,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// THAY ĐỔI DÒNG NÀY THEO BACKEND CỦA BẠN
const API_URL = "http://localhost:3000/api/v1/merchants/merchant";
// Ví dụ: https://api.foodapp.com/api/v1/merchants/merchant

function StatusBadge({ status, isTemporarilyClosed }) {
  let icon, color, text;

  if (isTemporarilyClosed) {
    icon = <XCircle size={16} />;
    color = "bg-red-500";
    text = "Tạm đóng cửa";
  } else {
    switch (status) {
      case "APPROVE":
      case "OPENING":
        icon = <CheckCircle size={16} />;
        color = "bg-green-600";
        text = "Đã phê duyệt";
        break;
      case "PENDING":
        icon = <Clock size={16} />;
        color = "bg-yellow-600";
        text = "Đang chờ duyệt";
        break;
      case "REJECT":
        icon = <XCircle size={16} />;
        color = "bg-red-600";
        text = "Đã từ chối";
        break;
      case "LOCKED":
        icon = <Lock size={16} />;
        color = "bg-gray-700";
        text = "Đã khóa";
        break;
      default:
        icon = <XCircle size={16} />;
        color = "bg-gray-500";
        text = "Không xác định";
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-bold ${color}`}
    >
      {icon} {text}
    </span>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl shadow-sm">
      <Icon className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
        <p className="text-sm font-semibold text-gray-900 break-words mt-1">
          {value || "Chưa cung cấp"}
        </p>
      </div>
    </div>
  );
}

function MerchantDetail() {
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const merchantTemp = useSelector((state) => state?.auth?.merchant);
  const merchantId = merchantTemp?.id;

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/${merchantId}`);
        setMerchant(res.data.data); // API của bạn trả { success: true, data: { ... } }
      } catch (err) {
        console.error(err);
        alert(
          "Lỗi tải dữ liệu: " + (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [merchantId]);

  const handleStatusChange = async (newStatus) => {
    if (merchant.status !== "PENDING") {
      alert("Chỉ có thể thao tác khi trạng thái là PENDING");
      return;
    }

    if (
      !window.confirm(
        `Bạn có chắc muốn ${
          newStatus === "APPROVE" ? "PHÊ DUYỆT" : "TỪ CHỐI"
        } merchant này?`
      )
    ) {
      return;
    }

    try {
      setUpdating(true);
      // Giả sử bạn có endpoint này (nếu chưa có thì tạo sau cũng được)
      await axios.patch(`${API_URL}/${merchantId}/status`, {
        status: newStatus,
      });

      setMerchant((prev) => ({ ...prev, status: newStatus }));
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      console.error(err);
      alert(
        "Cập nhật thất bại: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Đang tải thông tin merchant...
          </p>
        </div>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-600">Không tìm thấy merchant</p>
        </div>
      </div>
    );
  }

  const isPending = merchant.status === "PENDING";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className=" bg-white overflow-hidden">
        {/* Header */}
        <div className="text-gray-700 p-8">
          <h1 className="text-3xl font-extrabold mb-3">
            Nhà hàng {merchant.name || "Chưa đặt tên"}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge
              status={merchant.status}
              isTemporarilyClosed={merchant.is_temporarily_closed}
            />
            {/* <span className="bg-white/20 px-4 py-2 rounded-full">
              ID: {merchant.id}
            </span> */}
            <span className="opacity-90">
              Đăng ký:{" "}
              {new Date(merchant.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Ảnh đính kèm */}
          {merchant.merchantImages && merchant.merchantImages.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Image className="w-7 h-7" /> Hình ảnh (
                {merchant.merchantImages.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {merchant.merchantImages.map((img) => (
                  <a
                    key={img.id}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
                  >
                    <img
                      src={img.url}
                      alt={img.type}
                      className="w-full h-48 object-cover"
                    />
                    <div className="bg-black/70 text-white text-center py-1 text-xs font-medium">
                      {img.type}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Các section thông tin */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-5 border-b-2 border-indigo-200 pb-3">
              Thông tin cơ bản
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                icon={MapPin}
                label="Địa chỉ"
                value={merchant.address?.street}
              />
              <InfoItem
                icon={Clock}
                label="Giờ mở cửa"
                value={merchant.openingHours}
              />
              <InfoItem icon={Tag} label="Mô tả" value={merchant.description} />
              <InfoItem
                icon={Briefcase}
                label="Mô hình kinh doanh"
                value={merchant.businessModel}
              />
              <InfoItem
                icon={Calendar}
                label="Đơn hàng/ngày"
                value={merchant.dailyOrderVolume}
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-5 border-b-2 border-indigo-200 pb-3">
              Liên hệ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem
                icon={User}
                label="Người đại diện"
                value={merchant.representativeName}
              />
              <InfoItem
                icon={Phone}
                label="SĐT đại diện"
                value={merchant.representativeMobile}
              />
              <InfoItem
                icon={Mail}
                label="Email đại diện"
                value={merchant.representativeEmail}
              />
              <InfoItem
                icon={Phone}
                label="SĐT cửa hàng"
                value={merchant.merchantPhoneNumber}
              />
              <InfoItem
                icon={Mail}
                label="Email cửa hàng"
                value={merchant.merchantEmail}
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-5 border-b-2 border-indigo-200 pb-3">
              Pháp lý & Ngân hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem
                icon={FileText}
                label="Tên pháp lý"
                value={merchant.legalBusinessName}
              />
              <InfoItem
                icon={Hash}
                label="Mã ĐKKD"
                value={merchant.businessRegistrationCode}
              />
              <InfoItem
                icon={Banknote}
                label="Ngân hàng"
                value={merchant.bankName}
              />
              <InfoItem
                icon={User}
                label="Chủ tài khoản"
                value={merchant.bankAccountHolderName}
              />
              <InfoItem
                icon={Hash}
                label="Số tài khoản"
                value={merchant.bankAccountNumber}
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-5 border-b-2 border-indigo-200 pb-3">
              Chủ sở hữu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem icon={User} label="Họ tên" value={merchant.ownerName} />
              <InfoItem
                icon={Calendar}
                label="Ngày sinh"
                value={merchant.ownerDateOfBirth}
              />
              <InfoItem
                icon={Key}
                label="CCCD/CMND"
                value={merchant.ownerIdNumber}
              />
              <InfoItem
                icon={MapIcon}
                label="Nơi cấp"
                value={merchant.ownerIdIssuePlace}
              />
              <InfoItem
                icon={Home}
                label="Thường trú"
                value={merchant.ownerPermanentAddress}
              />
            </div>
          </section>

          {/* Nút hành động */}
          {/* <div className="pt-12 border-t-4 border-gray-300 text-center">
            <h2 className="text-3xl font-bold mb-8">Hành động duyệt</h2>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <button
                onClick={() => handleStatusChange("APPROVE")}
                disabled={!isPending || updating}
                className={`px-16 py-6 rounded-2xl font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-4
                  ${
                    isPending && !updating
                      ? "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
              >
                {updating ? (
                  <Loader2 className="animate-spin w-8 h-8" />
                ) : (
                  <CheckCircle size={32} />
                )}
                PHÊ DUYỆT
              </button>

              <button
                onClick={() => handleStatusChange("REJECT")}
                disabled={!isPending || updating}
                className={`px-16 py-6 rounded-2xl font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-4
                  ${
                    isPending && !updating
                      ? "bg-red-600 hover:bg-red-700 text-white hover:scale-105"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
              >
                {updating ? (
                  <Loader2 className="animate-spin w-8 h-8" />
                ) : (
                  <XCircle size={32} />
                )}
                TỪ CHỐI
              </button>
            </div>

            {!isPending && (
              <p className="mt-8 text-xl text-red-600 font-bold">
                Merchant đã được xử lý – không thể thay đổi trạng thái
              </p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default MerchantDetail;
