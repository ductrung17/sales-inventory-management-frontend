import React, { useState } from "react";
import { FaBox, FaWarehouse, FaChartBar, FaBars } from "react-icons/fa";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="fixed left-4 top-4 z-50 rounded bg-green-600 p-2 text-white shadow-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars size={18} />
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 z-40 h-full w-48 bg-white text-gray-800 shadow-lg transition-transform duration-300 md:translate-x-0`}
      >
        <div className="mb-4 bg-green-600 py-10 text-center text-xl font-bold uppercase text-white">
          Inventory
        </div>

        <nav className="flex flex-col space-y-3 px-4 py-6">
          <a
            href="/products"
            className="ml-2 flex items-center py-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <FaBox size={16} className="me-4" />
            Sản phẩm
          </a>
          <a
            href="/inventory"
            className="ml-2 flex items-center py-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <FaWarehouse size={16} className="me-4" />
            Kho hàng
          </a>
          <a
            href="#"
            className="ml-2 flex items-center py-2 text-sm font-medium text-gray-700 hover:text-black"
          >
            <FaChartBar size={16} className="me-4" />
            Báo cáo
          </a>
        </nav>
      </aside>
    </>
  );
};
