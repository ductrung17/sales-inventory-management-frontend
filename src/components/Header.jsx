import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("jwtToken");
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    alert("Bạn đã đăng xuất!");
    navigate("/login");
  };

  return (
    <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center bg-white px-4 pl-16 shadow-md md:pl-64">
      {/* Tiêu đề nhỏ */}
      <div className="hidden text-lg font-bold text-green-600 md:block">
        Sales Inventory Management
      </div>

      {/* Các nút bên phải */}
      <div className="ml-auto flex items-center space-x-4">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center pr-4 text-3xl leading-none text-gray-600 hover:text-black"
          >
            <FaUserCircle />
          </button>

          {open && (
            <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border bg-white shadow-lg">
              <button
                onClick={() => {
                  navigate(`/profile/${userId}`);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Hồ sơ cá nhân
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
