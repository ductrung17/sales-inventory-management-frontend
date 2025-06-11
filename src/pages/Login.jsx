import { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email không hợp lệ.";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu không được để trống.";
    }

    return errors;
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      alert(errorMessages);
      return; // dừng submit nếu có lỗi
    }

    axios
      .post(`${apiUrl}/api/login`, formData)
      .then((res) => {
        // Lấy token từ response
        const token = res.data.token;
        if (token) {
          // Lưu token vào localStorage hoặc cookie
          localStorage.setItem("jwtToken", token);
          navigate("/dashboard");
        }
        setFormData({ email: "", password: "" });
        // Có thể lưu token, chuyển trang, etc.
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-xl rounded-xl bg-white bg-opacity-90 px-6 py-8 shadow-lg backdrop-blur-sm sm:px-10 lg:px-16">
        <h2 className="mb-8 text-2xl font-medium text-gray-900 sm:text-3xl">
          Đăng nhập
        </h2>
        <div className="flex flex-col items-start">
          <label className="text-md mb-3 block font-medium text-gray-800">
            Email:
          </label>
          <div className="relative mb-6 w-full">
            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <input
              type="email"
              className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              name="email"
              required
            />
          </div>

          <label className="text-md mb-3 block font-medium text-gray-800">
            Mật khẩu:
          </label>
          <div className="relative mb-6 w-full">
            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <input
              type="password"
              className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              name="password"
              required
            />
          </div>
        </div>
        <div className="my-6 text-gray-700">
          Bạn chưa có tài khoản?{" "}
          <a
            href="/register"
            className="font-semibold text-green-400 underline hover:text-green-500"
          >
            Đăng ký ngay
          </a>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 sm:w-auto"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};
