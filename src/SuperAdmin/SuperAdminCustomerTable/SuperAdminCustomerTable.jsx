

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Edit, Trash2, Check, X, Loader2 } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// ──────────────────────────────────────────────
// ĐỔI URL NÀY THÀNH BACKEND CỦA BẠN
// ──────────────────────────────────────────────
const API_BASE = "http://localhost:3000/api/v1"; // ← SỬA NẾU CẦN

// ==================== SHADCN/UI STUBS ====================
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  onClick,
  disabled,
  type = "button",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    outline: "border border-green-300 text-gray-700 hover:bg-green-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-green-100 text-gray-800 hover:bg-green-200",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-4 py-2 text-sm h-10",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Input = ({
  className = "",
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  required,
}) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    required={required}
  />
);

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
  >
    {children}
  </span>
);

const Table = ({ children }) => (
  <table className="w-full caption-bottom text-sm">{children}</table>
);
const TableHeader = ({ children }) => (
  <thead className="[&_tr]:border-b bg-gray-50">{children}</thead>
);
const TableBody = ({ children }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);
const TableRow = ({ children }) => (
  <tr className="border-b transition-colors hover:bg-gray-50">{children}</tr>
);
const TableHead = ({ children, className = "" }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-gray-500 ${className}`}
  >
    {children}
  </th>
);
const TableCell = ({ children, className = "", colSpan }) => (
  <td colSpan={colSpan} className={`p-4 align-middle ${className}`}>
    {children}
  </td>
);

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogHeader = ({ children }) => (
  <div className="mb-4 space-y-1.5">{children}</div>
);
const DialogTitle = ({ children }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);
const DialogFooter = ({ children }) => (
  <div className="flex justify-end gap-2 border-t pt-4 mt-4">{children}</div>
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium">
    {children}
  </label>
);

const Switch = ({ checked, onCheckedChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition-colors ${
      checked ? "bg-indigo-600" : "bg-gray-200"
    }`}
  >
    <span
      className={`block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// ==================== MAIN COMPONENT ====================
export default function SuperAdminCustomerTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  // Dialog Add/Edit
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    isActive: true,
  });
  const [validationError, setValidationError] = useState("");

  // Delete confirm
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/user`);
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error("Không tải được danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterActive === "all" ||
        (filterActive === "active" && user.isActive) ||
        (filterActive === "inactive" && !user.isActive);

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterActive]);

  const openAdd = () => {
    setEditingUser(null);
    setFormData({ email: "", username: "", phone: "", isActive: true });
    setValidationError("");
    setIsDialogOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      username: user.username || "",
      phone: user.phone || "",
      isActive: user.isActive,
    });
    setValidationError("");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.email) {
      setValidationError("Email là bắt buộc");
      return;
    }

    try {
      if (editingUser) {
        await axios.patch(`${API_BASE}/user/${editingUser.id}`, formData);
        toast.success("Cập nhật thành công!");
      } else {
        await axios.post(`${API_BASE}/user/register`, {
          ...formData,
          password: "123456", // mật khẩu mặc định khi tạo mới
          confirmPassword: "123456",
        });
        toast.success("Thêm người dùng thành công!");
      }
      setIsDialogOpen(false);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra";
      setValidationError(msg);
      toast.error(msg);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      // Backend chưa có API xóa → dùng patch để vô hiệu hóa
      await axios.patch(`${API_BASE}/user/${userToDelete.id}`, {
        isActive: false,
      });
      toast.success("Đã vô hiệu hóa tài khoản");
      fetchUsers();
    } catch (err) {
      toast.error("Vô hiệu hóa thất bại");
    } finally {
      setIsDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6 rounded-xl bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="flex flex-col justify-between border-b pb-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Quản lý người dùng
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Thêm, sửa, vô hiệu hóa tài khoản người dùng
              </p>
            </div>
            <Button onClick={openAdd}>
              <Plus className="mr-2 size-4" />
              Thêm người dùng
            </Button>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm email, username, số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "active", "inactive"].map((f) => (
                <Button
                  key={f}
                  variant={filterActive === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActive(f)}
                >
                  {f === "all"
                    ? "Tất cả"
                    : f === "active"
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border shadow-sm">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="size-10 animate-spin text-indigo-600" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Số ĐT</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center text-gray-500"
                      >
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell className="text-indigo-600">
                          {user.email}
                        </TableCell>
                        <TableCell>{user.username || "-"}</TableCell>
                        <TableCell>{user.phone || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map((r, i) => (
                              <Badge
                                key={i}
                                className={
                                  r.name === "admin"
                                    ? "bg-red-100 text-red-800"
                                    : r.name === "merchant"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-700"
                                }
                              >
                                {r.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="mr-1 size-3" /> Hoạt động
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <X className="mr-1 size-3" /> Không hoạt động
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(user)}
                          >
                            <Edit className="size-4 text-indigo-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmDelete(user)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Dialog Add/Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            {validationError && (
              <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                {validationError}
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <Label>Trạng thái hoạt động</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) =>
                  setFormData({ ...formData, isActive: v })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </Dialog>

        {/* Dialog Xác nhận vô hiệu hóa */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Xác nhận vô hiệu hóa
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Bạn có chắc muốn vô hiệu hóa tài khoản{" "}
            <strong>{userToDelete?.email}</strong>? Tài khoản sẽ không thể đăng
            nhập nữa.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Vô hiệu hóa
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
}

