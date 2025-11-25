

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Store,
  Check,
  X,
  Eye,
  MapPin,
  Camera,
  User,
  Loader2,
  Save,
  Clock,
  Building2,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
} from "lucide-react";

// =========================================================================
// Config & Constants
// =========================================================================
const API_BASE =  "http://localhost:3000/api/v1";

const MerchantStatus = {
  PENDING: "PENDING",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  OPENING: "OPENING",
  LOCKED: "LOCKED",
};

const statusLabels = {
  [MerchantStatus.PENDING]: "Chờ duyệt",
  [MerchantStatus.APPROVE]: "Đã duyệt",
  [MerchantStatus.REJECT]: "Từ chối",
  [MerchantStatus.OPENING]: "Đang hoạt động",
  [MerchantStatus.LOCKED]: "Đã khóa",
};

const statusConfig = {
  [MerchantStatus.PENDING]: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  [MerchantStatus.APPROVE]: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: Check,
  },
  [MerchantStatus.REJECT]: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: X,
  },
  [MerchantStatus.OPENING]: {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Store,
  },
  [MerchantStatus.LOCKED]: {
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: X,
  },
};

// =========================================================================
// UI Components
// =========================================================================
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "default",
  className = "",
  loading = false,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeCls =
    size === "sm" ? "h-9 px-3" : size === "lg" ? "h-11 px-6" : "h-10 px-4";
  const variantCls =
    variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-50"
      : variant === "ghost"
      ? "hover:bg-gray-100"
      : variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "success"
      ? "bg-green-600 text-white hover:bg-green-700"
      : "bg-green-600 text-white hover:bg-green-700";

  return (
    <button
      className={`${base} ${sizeCls} ${variantCls} ${className}`}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${className}`}
    {...props}
  />
));

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${className}`}
    {...props}
  />
));

const Select = React.forwardRef(
  ({ children, className = "", ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  )
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      on
      diagnóstico={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => (
  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-green-50">
    {children}
  </div>
);
const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
    {children}
  </h2>
);
const DialogContent = ({ children }) => <div className="p-6">{children}</div>;
const DialogFooter = ({ children }) => (
  <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
    {children}
  </div>
);

// =========================================================================
// Main Component
// =========================================================================
function SuperAdminRestaurant() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({});

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/merchants`);
      const json = await res.json();
      if (json.success) setMerchants(json.data || []);
    } catch (err) {
      alert("Lỗi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const openDetail = (merchant) => {
    setSelectedMerchant(merchant);
    setIsDetailOpen(true);
  };

  const openEdit = (merchant) => {
    setSelectedMerchant(merchant);
    setFormData({
      name: merchant.name || "",
      representativeName: merchant.representativeName || "",
      merchantEmail: merchant.merchantEmail || "",
      merchantPhoneNumber: merchant.merchantPhoneNumber || "",
      openingHours: merchant.openingHours || "",
      businessModel: merchant.businessModel || "",
      legalBusinessName: merchant.legalBusinessName || "",
      businessRegistrationCode: merchant.businessRegistrationCode || "",
      bankName: merchant.bankName || "",
      bankAccountNumber: merchant.bankAccountNumber || "",
      bankAccountHolderName: merchant.bankAccountHolderName || "",
      status: merchant.status,
    });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name?.trim())
      return alert("Tên nhà hàng không được để trống");
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/merchants/${selectedMerchant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Cập nhật thành công!");
        fetchMerchants();
        setIsEditOpen(false);
      } else {
        const err = await res.json();
        alert("Lỗi: " + (err.message || "Không thể cập nhật"));
      }
    } catch (err) {
      alert("Lỗi kết nối: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id, status) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn ${
          status === "APPROVE" ? "DUYỆT" : "TỪ CHỐI"
        } nhà hàng này?`
      )
    )
      return;
    try {
      const res = await fetch(`${API_BASE}/merchants/approve/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchMerchants();
        if (isDetailOpen) setIsDetailOpen(false);
      } else alert("Thao tác thất bại");
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const search = searchTerm.toLowerCase();
      return (
        (m.name?.toLowerCase().includes(search) ||
          m.merchantEmail?.toLowerCase().includes(search) ||
          m.merchantPhoneNumber?.toLowerCase().includes(search)) &&
        (filterStatus === "all" || m.status === filterStatus)
      );
    });
  }, [merchants, searchTerm, filterStatus]);

  const stats = useMemo(
    () => ({
      total: merchants.length,
      pending: merchants.filter((m) => m.status === "PENDING").length,
      approved: merchants.filter((m) => m.status === "APPROVE").length,
      rejected: merchants.filter((m) => m.status === "REJECT").length,
    }),
    [merchants]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-4">
          <Store className="h-12 w-12 text-green-600" />
          Quản lý nhà hàng đối tác
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Xem chi tiết • Chỉnh sửa • Duyệt / Từ chối đăng ký
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Tổng số",
            value: stats.total,
            icon: Store,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Chờ duyệt",
            value: stats.pending,
            icon: Clock,
            color: "from-yellow-500 to-amber-600",
          },
          {
            label: "Đã duyệt",
            value: stats.approved,
            icon: Check,
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Từ chối",
            value: stats.rejected,
            icon: X,
            color: "from-red-500 to-rose-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}
            >
              <stat.icon className="h-8 w-8" />
            </div>
            <p className="text-gray-600 mt-4 text-sm font-medium">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm tên nhà hàng, email, số điện thoại..."
            className="pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nhà hàng
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Chủ sở hữu
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Liên hệ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ngày đăng ký
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-20">
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-600" />
                </td>
              </tr>
            ) : (
              filteredMerchants.map((m) => {
                const StatusIcon = statusConfig[m.status]?.icon || Store;
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                      #{m.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-gray-200 shadow"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <Store className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{m.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />{" "}
                            {m.businessModel || "Chưa có mô hình"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {m.representativeName || m.ownerName || "Chưa có"}
                      </p>
                      {m.owner && (
                        <p className="text-xs text-gray-500">{m.owner.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />{" "}
                        {m.merchantEmail || "-"}
                      </p>
                      <p className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-gray-400" />{" "}
                        {m.merchantPhoneNumber || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border ${
                          statusConfig[m.status]?.color || "bg-gray-100"
                        }`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {statusLabels[m.status] || m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetail(m)}
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(m)}
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Button>
                      {m.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(m.id, "APPROVE")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApprove(m.id, "REJECT")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog Xem chi tiết */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        {selectedMerchant && (
          <>
            <DialogHeader>
              <DialogTitle>
                <Store className="h-10 w-10 text-blue-600" />
                {selectedMerchant.name}
              </DialogTitle>
              <p className="text-gray-600 mt-2">
                ID: #{selectedMerchant.id} • Đăng ký:{" "}
                {new Date(selectedMerchant.createdAt).toLocaleString("vi-VN")}
              </p>
            </DialogHeader>
            <DialogContent className="space-y-8">
              {/* Thông tin chính */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                      <User className="h-6 w-6 text-blue-600" /> Chủ sở hữu
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                      <p>
                        <strong>Họ tên:</strong>{" "}
                        {selectedMerchant.representativeName ||
                          selectedMerchant.ownerName ||
                          "Chưa cung cấp"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedMerchant.merchantEmail || "-"}
                      </p>
                      <p>
                        <strong>SĐT:</strong>{" "}
                        {selectedMerchant.merchantPhoneNumber || "-"}
                      </p>
                      <p>
                        <strong>CMND/CCCD:</strong>{" "}
                        {selectedMerchant.ownerIdNumber || "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                      <CreditCard className="h-6 w-6 text-green-600" /> Ngân
                      hàng
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                      <p>
                        <strong>Ngân hàng:</strong>{" "}
                        {selectedMerchant.bankName || "-"}
                      </p>
                      <p>
                        <strong>Số TK:</strong>{" "}
                        {selectedMerchant.bankAccountNumber || "-"}
                      </p>
                      <p>
                        <strong>Chủ TK:</strong>{" "}
                        {selectedMerchant.bankAccountHolderName || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-purple-600" /> Pháp lý
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                    <p>
                      <strong>Tên pháp lý:</strong>{" "}
                      {selectedMerchant.legalBusinessName || "-"}
                    </p>
                    <p>
                      <strong>Mã số KD:</strong>{" "}
                      {selectedMerchant.businessRegistrationCode || "-"}
                    </p>
                    <p>
                      <strong>Ngành nghề:</strong>{" "}
                      {selectedMerchant.businessIndustry || "-"}
                    </p>
                    <p>
                      <strong>Mô hình:</strong>{" "}
                      {selectedMerchant.businessModel || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hình ảnh minh chứng */}
              {selectedMerchant.merchantImages?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-3 mb-6">
                    <Camera className="h-6 w-6 text-orange-600" /> Hình ảnh minh
                    chứng ({selectedMerchant.merchantImages.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {selectedMerchant.merchantImages.map((img, i) => (
                      <div
                        key={i}
                        className="group relative rounded-xl overflow-hidden shadow-lg"
                      >
                        <img
                          src={img.url}
                          alt={img.type}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                          <p className="text-white font-medium">
                            {img.type === "IDENTITY"
                              ? "CMND/CCCD"
                              : img.type === "BUSINESS"
                              ? "Giấy phép KD"
                              : img.type === "KITCHEN"
                              ? "Bếp"
                              : "Khác"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DialogContent>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      {/* Dialog Chỉnh sửa */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        {selectedMerchant && (
          <>
            <DialogHeader>
              <DialogTitle>
                <Edit className="h-10 w-10 text-green-600" />
                Chỉnh sửa nhà hàng: {selectedMerchant.name}
              </DialogTitle>
            </DialogHeader>
            <DialogContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên nhà hàng *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Người đại diện
                  </label>
                  <Input
                    value={formData.representativeName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        representativeName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email liên hệ
                  </label>
                  <Input
                    value={formData.merchantEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        merchantEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <Input
                    value={formData.merchantPhoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        merchantPhoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giờ mở cửa
                  </label>
                  <Input
                    value={formData.openingHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        openingHours: e.target.value,
                      }))
                    }
                    placeholder="08:00 - 22:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    {Object.entries(statusLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-purple-600" /> Thông tin
                  pháp lý & ngân hàng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên pháp lý
                    </label>
                    <Input
                      value={formData.legalBusinessName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          legalBusinessName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mã số kinh doanh
                    </label>
                    <Input
                      value={formData.businessRegistrationCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          businessRegistrationCode: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ngân hàng
                    </label>
                    <Input
                      value={formData.bankName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số tài khoản
                    </label>
                    <Input
                      value={formData.bankAccountNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankAccountNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Chủ tài khoản
                    </label>
                    <Input
                      value={formData.bankAccountHolderName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankAccountHolderName: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </div>
  );
}

export default SuperAdminRestaurant;