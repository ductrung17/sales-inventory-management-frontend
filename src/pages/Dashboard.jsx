import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await axios.get(`${apiUrl}/api`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/5">
          <Sidebar />
        </div>

        <main className="mt-20 w-full px-4 lg:px-8">
          <h2 className="mb-8 text-xl font-semibold text-gray-700 md:text-3xl">
            Trang chủ
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="text-sm font-semibold text-gray-500">
                Tổng sản phẩm
              </h2>
              <p className="mt-2 text-2xl font-bold text-green-600">
                {stats.totalProducts}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="text-sm font-semibold text-gray-500">
                Tổng đơn hàng
              </h2>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {stats.totalOrders}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-md">
              <h2 className="text-sm font-semibold text-gray-500">
                Tổng doanh thu
              </h2>
              <p className="mt-2 text-2xl font-bold text-red-600">
                {stats.totalRevenue.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
