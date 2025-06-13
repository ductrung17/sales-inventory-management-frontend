import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

export const RevenueReport = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    try {
      if (!startDate || !endDate) return;
      const token = localStorage.getItem("jwtToken");

      const res = await axios.get(`${apiUrl}/api/revenue`, {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReport(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy báo cáo:", err.message);
    } finally {
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) window.location.href = "/login";
  }, []);

  const chartData = report
    ? Object.entries(report.revenueByDate).map(([date, amount]) => ({
        date,
        revenue: amount,
      }))
    : [];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/5">
          <Sidebar />
        </div>
        <main className="mt-20 w-full px-4 lg:ml-0 lg:mt-20 lg:w-4/5 lg:px-8">
          <h2 className="mb-8 text-xl font-semibold text-gray-700 md:text-3xl">
            Báo Cáo Doanh Thu
          </h2>

          {/* Bộ lọc thời gian */}
          <div className="mb-4 flex flex-wrap gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded border px-2 py-1"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded border px-2 py-1"
            />
            <button
              onClick={fetchReport}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Xem báo cáo
            </button>
          </div>

          {/* Thống kê tổng */}
          {report && (
            <div className="mb-6 flex flex-wrap gap-6">
              <div className="rounded-lg bg-white p-4 shadow">
                <p className="text-gray-500">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-green-600">
                  {report.totalRevenue.toLocaleString()}đ
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow">
                <p className="text-gray-500">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-blue-600">
                  {report.totalOrders}
                </p>
              </div>
            </div>
          )}

          {/* Biểu đồ doanh thu */}
          {chartData.length > 0 && (
            <div className="mb-8 h-[300px] w-full rounded bg-white p-4 shadow">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Bảng chi tiết */}
          {report && (
            <div className="w-full overflow-x-auto rounded-lg shadow-md">
              <table className="w-full min-w-[800px] table-auto text-center text-sm text-gray-700">
                <thead className="bg-gray-200 uppercase text-gray-700">
                  <tr>
                    <th className="px-4 py-3">STT</th>
                    <th className="px-2 py-3">Mã đơn</th>
                    <th className="px-2 py-3">Khách hàng</th>
                    <th className="px-2 py-3">Số tiền</th>
                    <th className="px-2 py-3">Ngày thanh toán</th>
                    <th className="px-2 py-3">Phương thức</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-white text-black">
                  {report.payments.map((p, i) => (
                    <tr key={p._id}>
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-2 py-3">
                        {p.order?.orderNumber || "N/A"}
                      </td>
                      <td className="px-2 py-3">
                        {p.order?.customerName || "N/A"}
                      </td>
                      <td className="px-2 py-3">
                        {p.order.totalAmount.toLocaleString()}đ
                      </td>
                      <td className="px-2 py-3">
                        {new Date(p.order.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-2 py-3">{p.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
