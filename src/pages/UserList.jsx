import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }

    fetchUsers();
  }, [navigate, search]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const query = search ? `?search=${encodeURIComponent(search)}` : "";

      const res = await axios.get(`${apiUrl}/api/users${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
    }
  };

  const [searchUser, setSearchUser] = useState("");

  const handleSearch = (e) => {
    setSearchUser(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchUser.trim()) {
      navigate(`/users?search=${encodeURIComponent(searchUser.trim())}`);
    } else {
      navigate("/users");
    }
  };

  const [role, setRole] = useState([]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/role`);
        setRole(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách vai trò:", err);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = async (userId, newValue, field) => {
    try {
      const token = localStorage.getItem("jwtToken");

      const updatePayload = {
        [field]: newValue,
      };

      await axios.put(`${apiUrl}/api/users/${userId}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      console.error("Lỗi cập nhật vai trò:", error);
      alert("Lỗi hệ thống hoặc bạn không có quyền thực hiện chức năng này!");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/5">
          <Sidebar />
        </div>

        <main className="mt-20 w-full px-4 lg:px-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h2 className="text-xl font-semibold text-gray-700 md:text-3xl">
              Danh sách người dùng
            </h2>
            <div className="flex space-x-4">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center justify-start space-x-2"
              >
                <input
                  type="text"
                  placeholder="Tìm người dùng..."
                  value={searchUser}
                  onChange={handleSearch}
                  className="rounded border px-2 py-1"
                />
                <button
                  type="submit"
                  className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                >
                  Tìm
                </button>
              </form>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="w-full min-w-[600px] table-auto text-center text-sm text-gray-700">
              <thead className="bg-gray-200 uppercase text-gray-700">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">Tên</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Số điện thoại</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white font-normal text-black">
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value, "role")
                        }
                        className="rounded border px-2 py-1 capitalize"
                      >
                        {role.map((role) => (
                          <option
                            key={role}
                            value={role}
                            className="capitalize"
                          >
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};
