import axios from "axios";
import {
  AlertTriangle,
  Edit2,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// ==================== API CONFIG ====================
const DRONE_API = "http://localhost:3000/api/v1/drone";
const HUB_API = "http://localhost:3000/api/v1/drone-hubs"; // API hub thật

// ==================== STATUS CONFIG ====================
const statusLabels = {
  AVAILABLE: "Sẵn sàng",
  CHARGING: "Đang sạc",
  IN_MAINTENANCE: "Bảo trì",
  FLYING_TO_PICKUP: "Bay đến điểm lấy hàng",
  AT_PICKUP_POINT: "Tại điểm lấy hàng",
  OUT_FOR_DELIVERY: "Đang giao hàng",
  DROPPING_OFF: "Đang thả hàng",
  RETURNING_TO_HUB: "Đang quay về hub",
  EMERGENCY_LANDING: "Hạ cánh khẩn cấp",
};

const statusColors = {
  AVAILABLE: "bg-green-100 text-green-700",
  CHARGING: "bg-blue-100 text-blue-700",
  IN_MAINTENANCE: "bg-red-100 text-red-700",
  FLYING_TO_PICKUP: "bg-purple-100 text-purple-700",
  AT_PICKUP_POINT: "bg-yellow-100 text-yellow-700",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-700",
  DROPPING_OFF: "bg-pink-100 text-pink-700",
  RETURNING_TO_HUB: "bg-orange-100 text-orange-700",
  EMERGENCY_LANDING: "bg-red-200 text-red-800 ring-2 ring-red-500",
};

// ==================== COMPONENTS ====================
const Button = ({
  children,
  onClick,
  variant = "default",
  size = "md",
  disabled,
  loading,
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-600",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = size === "sm" ? "px-2 py-1 text-sm" : "px-4 py-2";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : children}
    </button>
  );
};

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-screen overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
export default function DroneManagement() {
  const [drones, setDrones] = useState([]);
  const [hubs, setHubs] = useState([]); // Danh sách hub thật từ API
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingDrone, setEditingDrone] = useState(null);
  const [deletingDrone, setDeletingDrone] = useState(null);

  const [form, setForm] = useState({
    serialNumber: "",
    battery: 100,
    status: "AVAILABLE",
    hubId: "",
    payloadCapacityKg: 5,
  });

  // Lấy danh sách drone
  const fetchDrones = async () => {
    try {
      const res = await axios.get(DRONE_API);
      const droneList = res.data?.data || [];
      setDrones(droneList);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải drone");
    }
  };

  // Lấy danh sách hub thật
  const fetchHubs = async () => {
    try {
      const res = await axios.get(HUB_API);
      const hubList = res.data?.data || [];
      setHubs(hubList);
      // Nếu chưa có hub nào, set mặc định
      if (hubList.length > 0 && !form.hubId) {
        setForm((prev) => ({ ...prev, hubId: hubList[0].id }));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi tải danh sách Hub");
    }
  };

  // Load dữ liệu khi mở trang
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDrones(), fetchHubs()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Lọc drone
  const filteredDrones = useMemo(() => {
    return drones.filter((drone) => {
      const term = searchTerm.toLowerCase();
      const hubName =
        drone.hub?.street ||
        hubs.find((h) => h.id === drone.hubId)?.street ||
        "";
      const matchesSearch =
        drone.serialNumber?.toLowerCase().includes(term) ||
        hubName.toLowerCase().includes(term);

      const matchesFilter =
        filterStatus === "all" || drone.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [drones, hubs, searchTerm, filterStatus]);

  // Mở modal thêm
  const openAdd = () => {
    setEditingDrone(null);
    setForm({
      serialNumber: "",
      battery: 100,
      status: "AVAILABLE",
      hubId: hubs[0]?.id || "",
      payloadCapacityKg: 5,
    });
    setIsModalOpen(true);
  };

  // Mở modal sửa
  const openEdit = (drone) => {
    setEditingDrone(drone);
    setForm({
      serialNumber: drone.serialNumber,
      battery: drone.battery,
      status: drone.status,
      hubId: drone.hubId || hubs[0]?.id || "",
      payloadCapacityKg: drone.payloadCapacityKg || 5,
    });
    setIsModalOpen(true);
  };

  // Lưu drone
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.serialNumber.trim()) return alert("Vui lòng nhập số Serial!");
    if (!form.hubId) return alert("Vui lòng chọn Hub!");

    setSaving(true);
    try {
      if (editingDrone) {
        await axios.patch(`${DRONE_API}/${editingDrone.id}`, form);
      } else {
        await axios.post(DRONE_API, form);
      }
      setIsModalOpen(false);
      fetchDrones();
    } catch (err) {
      alert(err.response?.data?.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  // Xóa drone
  const confirmDelete = (drone) => {
    setDeletingDrone(drone);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${DRONE_API}/${deletingDrone.id}`);
      fetchDrones();
      setIsDeleteOpen(false);
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  // Thống kê
  const stats = useMemo(() => {
    const ready = drones.filter((d) => d.status === "AVAILABLE").length;
    const delivering = drones.filter((d) =>
      ["OUT_FOR_DELIVERY", "FLYING_TO_PICKUP"].includes(d.status)
    ).length;
    const charging = drones.filter((d) => d.status === "CHARGING").length;
    const error = drones.filter((d) =>
      ["IN_MAINTENANCE", "EMERGENCY_LANDING"].includes(d.status)
    ).length;
    return { ready, delivering, charging, error };
  }, [drones]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Drone</h1>
            <p className="text-gray-600">
              Tổng: {drones.length} drone • {hubs.length} hub
            </p>
          </div>
          <Button
            className="!bg-green-500 !text-white hover:!bg-green-600"
            onClick={openAdd}
            disabled={hubs.length === 0}
          >
            <Plus className="w-5 h-5 mr-2" /> Thêm Drone
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm serial, địa chỉ hub..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border rounded-lg bg-white"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 12px center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "16px",
              paddingRight: "40px",
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 border border-green-300 p-5 rounded-xl">
            <p className="text-green-700 font-semibold">Sẵn sàng</p>
            <p className="text-3xl font-bold text-green-900">{stats.ready}</p>
          </div>
          <div className="bg-blue-50 border border-blue-300 p-5 rounded-xl">
            <p className="text-blue-700 font-semibold">Đang giao</p>
            <p className="text-3xl font-bold text-blue-900">
              {stats.delivering}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-300 p-5 rounded-xl">
            <p className="text-yellow-700 font-semibold">Đang sạc</p>
            <p className="text-3xl font-bold text-yellow-900">
              {stats.charging}
            </p>
          </div>
          <div className="bg-red-50 border border-red-300 p-5 rounded-xl">
            <p className="text-red-700 font-semibold">Lỗi / Bảo trì</p>
            <p className="text-3xl font-bold text-red-900">{stats.error}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Serial
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Pin
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">
                  Hub
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredDrones.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-16 text-gray-500 text-lg"
                  >
                    Không tìm thấy drone nào
                  </td>
                </tr>
              ) : (
                filteredDrones.map((drone) => {
                  const hubName =
                    drone.hub?.street ||
                    hubs.find((h) => h.id === drone.hubId)?.street ||
                    "Chưa gán";
                  return (
                    <tr key={drone.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">#{drone.id}</td>
                      <td className="px-6 py-4 font-mono">
                        {drone.serialNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {drone.battery <= 20 && (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                          <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                drone.battery <= 20
                                  ? "bg-red-500"
                                  : drone.battery <= 50
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${drone.battery}%` }}
                            />
                          </div>
                          <span className="text-xs w-10">{drone.battery}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[drone.status]
                          }`}
                        >
                          {statusLabels[drone.status] || drone.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {hubName}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(drone)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(drone)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa Drone */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDrone ? "Sửa Drone" : "Thêm Drone mới"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Số Serial {editingDrone && "(không thể sửa)"}
            </label>
            <input
              type="text"
              value={form.serialNumber}
              onChange={(e) =>
                setForm({ ...form, serialNumber: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
              disabled={!!editingDrone}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pin (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.battery}
                onChange={(e) => setForm({ ...form, battery: +e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tải trọng (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={form.payloadCapacityKg}
                onChange={(e) =>
                  setForm({ ...form, payloadCapacityKg: +e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
                paddingRight: "40px",
              }}
            >
              {Object.entries(statusLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Chọn Hub</label>
            <select
              value={form.hubId}
              onChange={(e) => setForm({ ...form, hubId: +e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
                paddingRight: "40px",
              }}
              required
            >
              {hubs.length === 0 ? (
                <option>Đang tải hub...</option>
              ) : (
                hubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.street} ({hub.droneList?.length || 0} drone)
                  </option>
                ))
              )}
            </select>
          </div>
        </form>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} loading={saving}>
            {editingDrone ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Modal>

      {/* Modal Xóa */}
      <Modal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Xóa Drone"
      >
        <div className="text-center py-6">
          <p className="text-lg">Bạn có chắc chắn muốn xóa drone?</p>
          <p className="text-2xl font-bold text-red-600 mt-3">
            {deletingDrone?.serialNumber}
          </p>
          <p className="text-sm text-gray-600 mt-4">
            Hành động này không thể hoàn tác!
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Xóa vĩnh viễn
          </Button>
        </div>
      </Modal>
    </div>
  );
}
