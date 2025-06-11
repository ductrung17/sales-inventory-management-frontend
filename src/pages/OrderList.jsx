import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

export const OrderList = () => {
  const [orders, setOrders] = useState([]);
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

    fetchOrders();
  }, [navigate, search]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      const res = await axios.get(`${apiUrl}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err.message);
    }
  };

  const ORDER_STATUSES = ["Đang xử lý", "Hoàn thành", "Đã hủy"];
  const DELIVERY_STATUSES = [
    "Đang xử lý",
    "Đã gửi hàng",
    "Giao thành công",
    "Trả hàng",
  ];
  const handleStatusChange = async (orderId, newValue, field) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(`${apiUrl}/api/orders/${orderId}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchOrders();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Không thể cập nhật. Vui lòng thử lại!");
    }
  };

  const [searchOrder, setSearchOrder] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-1/5">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="mt-20 w-full px-4 lg:px-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h2 className="text-xl font-semibold text-gray-700 md:text-3xl">
              Danh sách sản phẩm
            </h2>
            <div className="flex space-x-4">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center justify-start space-x-2"
              >
                <input
                  type="text"
                  placeholder="Tìm đơn hàng..."
                  value={searchOrder}
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
              <a
                href="/create-product"
                className="flex justify-center rounded-full bg-green-500 p-3 hover:bg-green-600"
              >
                <FaPlus size={20} className="text-white" />
              </a>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="w-full min-w-[800px] table-auto text-center text-xs text-gray-700 md:text-sm">
              <thead className="bg-gray-200 uppercase text-gray-700">
                <tr>
                  <th className="px-4 py-4">Order#</th>
                  <th className="px-4 py-4">Khách hàng</th>
                  <th className="px-4 py-4">Địa chỉ</th>
                  <th className="px-4 py-4">Tổng tiền</th>
                  <th className="px-4 py-4">Ngày đặt</th>
                  <th className="px-4 py-4">Hạn giao</th>
                  <th className="px-4 py-4">Trạng thái đơn</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 bg-white font-normal text-black">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-4">{order.orderNumber}</td>
                    <td className="px-4 py-4">{order.customerName}</td>
                    <td className="px-4 py-4">
                      {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.country}
                    </td>
                    <td className="px-4 py-4">
                      {order.totalAmount.toLocaleString()}₫
                    </td>
                    <td className="px-4 py-4">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      {order.deliveryDeadline
                        ? new Date(order.deliveryDeadline).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={order.deliveryStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value,
                            "deliveryStatus",
                          )
                        }
                        className="rounded border px-2 py-1"
                      >
                        {DELIVERY_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
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
