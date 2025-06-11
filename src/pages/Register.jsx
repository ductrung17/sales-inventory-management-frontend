import { MdEmail, MdLock, MdPhone, MdPerson } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Register = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmedPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Họ tên là bắt buộc";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    if (formData.confirmedPassword !== formData.password) {
      newErrors.confirmedPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      alert(errorMessages);
      return;
    }

    axios
      .post(`${apiUrl}/api/register`, formData)
      .then((res) => {
        alert(res.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmedPassword: "",
          phone: "",
        });
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        alert("Có lỗi xảy ra khi đăng ký.");
      });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-xl rounded-xl bg-white bg-opacity-90 px-6 py-8 shadow-lg backdrop-blur-sm sm:px-10 lg:px-16">
        <h2 className="mb-8 text-2xl font-medium text-gray-900 sm:text-3xl">
          Đăng ký
        </h2>
        <div className="flex flex-col items-start">
          <label className="text-md mb-3 block font-medium text-gray-800">
            Email:
          </label>
          <div className="relative mb-6 w-full">
            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <input
              type="email"
              className="form-controll w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              name="email"
              required
            />
          </div>

          <label className="text-md mb-3 block font-medium text-gray-800">
            Họ và tên:
          </label>
          <div className="relative mb-6 w-full">
            <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nhập tên của bạn"
              value={formData.name}
              onChange={handleChange}
              name="name"
              required
            />
          </div>

          <label className="text-md mb-3 block font-medium text-gray-800">
            Số điện thoại:
          </label>
          <div className="relative mb-6 w-full">
            <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <input
              type="tel"
              className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nhập số điện thoại của bạn"
              value={formData.phone}
              onChange={handleChange}
              name="phone"
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

          <label className="text-md mb-3 block font-medium text-gray-800">
            Xác nhận mật khẩu:
          </label>
          <div className="relative mb-6 w-full">
            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <input
              type="password"
              className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Nhập lại mật khẩu của bạn"
              value={formData.confirmedPassword}
              onChange={handleChange}
              name="confirmedPassword"
              required
            />
          </div>
        </div>
        <div className="my-6 text-gray-700">
          Bạn đã có tài khoản?{" "}
          <a
            href="/login"
            className="font-semibold text-green-400 underline hover:text-green-500"
          >
            Đăng nhập ngay
          </a>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 sm:w-auto"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};
