import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const Profile = () => {
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return navigate("/login");

      try {
        const res = await axios.get(`${apiUrl}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          role: res.data.role || "",
        });
      } catch (err) {
        console.error("Lỗi khi tải thông tin người dùng:", err.message);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");

      await axios.put(
        `${apiUrl}/api/users/${id}`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Cập nhật người dùng thành công!");
      navigate("/users");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err.message);
    }
  };

  return (
    <div className="min-h-screen sm:ml-0 md:ml-32">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="mt-8 flex flex-1 justify-center px-4 py-4 sm:px-6 lg:ml-40 lg:justify-start">
          <div className="w-full max-w-screen-md rounded-xl bg-white bg-opacity-90 px-6 py-8 shadow-lg backdrop-blur-sm sm:px-10 lg:px-16">
            <h2 className="mb-8 flex justify-center text-center text-2xl font-medium text-gray-900 sm:text-left sm:text-3xl">
              Cập nhật người dùng
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Họ tên */}
              <div className="flex flex-col space-y-6">
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Họ tên:
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Nhập họ tên"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Email:
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Nhập email"
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Số điện thoại:
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                {/* Vai trò */}
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Vai trò:
                  </label>
                  <div className="relative">
                    <MdWork className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded-md border border-gray-400 py-2 pl-10 capitalize focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="admin / staff / user..."
                    />
                  </div>
                </div>

                {/* Nút lưu */}
                <div className="flex sm:justify-end">
                  <button
                    type="submit"
                    className="w-full rounded bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 sm:w-auto"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
