import {
  AlertTriangle,
  Edit,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AddressPartner from "../../customers/components/Address/AddressPartner";

// ==================== API ====================
const API_URL = "http://localhost:3000/api/v1";

const api = {
  getHubs: async () => {
    const res = await fetch(`${API_URL}/drone-hubs`);
    return res.json();
  },
  createHub: async (data) => {
    const res = await fetch(`${API_URL}/drone-hubs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateHub: async (id, data) => {
    const res = await fetch(`${API_URL}/drone-hubs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  deleteHub: async (id) => {
    await fetch(`${API_URL}/drone-hubs/${id}`, { method: "DELETE" });
  },
};

// ==================== COMPONENTS ====================
const Button = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    outline: "border border-green-300 bg-white hover:bg-green-50",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    default: "h-10 px-4 text-sm",
    sm: "h-9 px-3 text-xs",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = (props) => (
  <input
    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    {...props}
  />
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 border-b">{children}</div>
);
const CardContent = ({ children }) => <div className="p-6">{children}</div>;
const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

const Table = ({ children }) => (
  <table className="w-full text-sm">{children}</table>
);
const TableHeader = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableRow = ({ children, ...props }) => (
  <tr className="border-b hover:bg-gray-50" {...props}>
    {children}
  </tr>
);
const TableHead = ({ children }) => (
  <th className="h-12 px-4 text-left font-medium text-gray-600">{children}</th>
);
const TableCell = ({ children, ...props }) => (
  <td className="p-4" {...props}>
    {children}
  </td>
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
export default function DroneHub() {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHub, setEditingHub] = useState(null);
  const [selectedHub, setSelectedHub] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [hubToDelete, setHubToDelete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Load dữ liệu
  //   const fetchHubs = useCallback(async () => {
  //     try {
  //       setLoading(true);
  //       const data = await api.getHubs();
  //       setHubs(Array.isArray(data) ? data : []);
  //     } catch (err) {
  //       console.error(err);
  //       setHubs([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, []);

  const fetchHubs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getHubs(); // { success: true, data: [...] }
      const hubList = response?.data || response || [];
      setHubs(Array.isArray(hubList) ? hubList : []);
    } catch (err) {
      console.error("Lỗi load hub:", err);
      setHubs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHubs();
  }, [fetchHubs]);

  const filteredHubs = hubs.filter((hub) =>
    hub.street?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    if (!selectedLocation?.street || !selectedLocation?.location) {
      alert("Vui lòng chọn địa chỉ trên bản đồ!");
      return;
      return;
    }

    const payload = {
      street: selectedLocation.street,
      location: selectedLocation.location,
    };

    try {
      if (editingHub) {
        await api.updateHub(editingHub.id, payload);
      } else {
        await api.createHub(payload);
      }
      setIsDialogOpen(false);
      setSelectedLocation(null);
      fetchHubs();
    } catch (err) {
      alert("Lưu thất bại!");
    }
  };

  const handleDelete = async () => {
    if (!hubToDelete) return;
    try {
      await api.deleteHub(hubToDelete.id);
      setIsDeleteOpen(false);
      setHubToDelete(null);
      fetchHubs();
      if (selectedHub?.id === hubToDelete.id) setSelectedHub(null);
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Drone Hub</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các trung tâm điều phối drone
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingHub(null);
            setSelectedLocation(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm Hub
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Tìm kiếm địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Danh sách */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">
              Danh sách Hub ({filteredHubs.length})
            </h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHubs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-12 text-gray-500"
                      >
                        {searchTerm
                          ? "Không tìm thấy hub nào"
                          : "Chưa có hub nào"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHubs.map((hub) => (
                      <TableRow
                        key={hub.id}
                        className={
                          selectedHub?.id === hub.id
                            ? "bg-blue-50"
                            : "cursor-pointer hover:bg-gray-50"
                        }
                        onClick={() => setSelectedHub(hub)}
                      >
                        <TableCell className="font-mono">{hub.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            {hub.street}
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingHub(hub);
                              setSelectedLocation({
                                street: hub.street,
                                location: hub.location,
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHubToDelete(hub);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Chi tiết */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Chi tiết Hub</h2>
            {selectedHub ? (
              <Card>
                <CardHeader>
                  <CardTitle>Hub ID: {selectedHub.id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Địa chỉ
                      </p>
                      <p>{selectedHub.street}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tọa độ
                      </p>
                      <p className="font-mono text-sm">
                        {selectedHub.location?.coordinates?.join(", ") ||
                          "Chưa có"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-16 text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Chọn một hub để xem chi tiết</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Dialog Thêm/Sửa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">
            {editingHub ? "Chỉnh sửa Hub" : "Thêm Hub mới"}
          </h3>
          <button onClick={() => setIsDialogOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <AddressPartner
          onLocationSelected={(data) => {
            console.log("Đã chọn địa chỉ:", data); // để debug
            setSelectedLocation(data);
          }}
          restaurant={
            editingHub
              ? {
                  address: {
                    latitude: editingHub.location?.coordinates?.[1],
                    longitude: editingHub.location?.coordinates?.[0],
                  },
                }
              : {
                  address: {
                    latitude: 10.7758, // Trung tâm TP.HCM
                    longitude: 106.7005,
                  },
                }
          }
        />

        {selectedLocation ? (
          <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg">
            <p className="text-sm text-green-800">
              Đã chọn: <strong>{selectedLocation.street}</strong>
            </p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
            Vui lòng chọn vị trí trên bản đồ hoặc tìm địa chỉ
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedLocation}
            className={!selectedLocation ? "opacity-50 cursor-not-allowed" : ""}
          >
            {editingHub ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Dialog>

      {/* Dialog Xóa */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <div className="text-center py-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold">Xác nhận xóa</h3>
          <p className="mt-2">
            Xóa hub <strong>{hubToDelete?.street}</strong>?
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
