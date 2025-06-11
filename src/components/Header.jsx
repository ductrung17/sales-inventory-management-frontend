import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    alert("Bạn đã đăng xuất!");
    navigate("/login");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center bg-white px-4 pl-16 shadow-md md:pl-64">
      {/* Tiêu đề nhỏ */}
      <div className="hidden text-lg font-bold text-green-600 md:block">
        Sales Inventory Management
      </div>

      {/* Các nút bên phải */}
      <div className="ml-auto flex items-center space-x-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
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

        <button
          onClick={() => navigate("/profile")}
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          Hồ sơ cá nhân
        </button>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};
