import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export const CreatePayment = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchOrdersWithPayments = async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      const [ordersRes, paymentsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/api/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const paidOrderIds = paymentsRes.data.map((p) =>
        typeof p.order === "object"
          ? p.order._id.toString()
          : p.order.toString(),
      );

      const unpaidOrders = ordersRes.data.filter(
        (order) => !paidOrderIds.includes(order._id.toString()),
      );

      setOrders(unpaidOrders);
    } catch (err) {
      console.error(
        "Lỗi khi tải danh sách đơn hàng chưa thanh toán:",
        err.message,
      );
    }
  };

  useEffect(() => {
    fetchOrdersWithPayments();
  }, []);

  useEffect(() => {
    const found = orders.find((o) => o._id === selectedOrderId);
    setOrderInfo(found || null);
  }, [selectedOrderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrderId) return setMessage("Vui lòng chọn đơn hàng!");
    if (!selectedPaymentMethod)
      return setMessage("Vui lòng chọn phương thức thanh toán!");

    try {
      await axios.post(`${apiUrl}/api/payments`, {
        orderId: selectedOrderId,
        paymentMethod: selectedPaymentMethod, // ✅ dùng giá trị người dùng đã chọn
      });

      alert("Tạo thanh toán thành công");
      setSelectedOrderId("");
      setOrderInfo(null);
      setSelectedPaymentMethod("");
      fetchOrdersWithPayments();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tạo thanh toán");
    }
    navigate("/payments");
  };

  const [paymentMethod, setPaymentMethod] = useState([]);

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/payment-method`);
        setPaymentMethod(res.data); // res.data phải là array như ["Tiền mặt", "Chuyển khoản"]
      } catch (err) {
        console.error("Lỗi khi tải phương thức thanh toán:", err);
      }
    };

    fetchPaymentMethod();
  }, []);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  return (
    <div className="min-h-screen sm:ml-0 md:ml-32">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="mt-8 flex flex-1 justify-center px-4 py-4 sm:px-6 lg:ml-40 lg:justify-start">
          <div className="w-full max-w-screen-md rounded-xl bg-white bg-opacity-90 px-6 py-8 shadow-lg backdrop-blur-sm sm:px-10 lg:px-16">
            <h2 className="mb-6 text-2xl font-medium text-gray-900 sm:text-3xl">
              Tạo thanh toán mới
            </h2>

            {message && (
              <div className="mb-4 text-sm font-medium text-blue-600">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* Chọn đơn hàng */}
              <div>
                <label className="font-medium text-gray-800">
                  Chọn đơn hàng:
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-400 px-4 py-2"
                >
                  <option value="">-- Chọn đơn hàng chưa thanh toán --</option>
                  {orders.map((order) => (
                    <option key={order._id} value={order._id}>
                      {order.orderNumber} - {order.customerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thông tin đơn hàng */}
              {orderInfo && (
                <div className="rounded border bg-gray-50 px-4 py-3 text-sm">
                  <p>
                    <strong>Mã đơn hàng:</strong> {orderInfo.orderNumber}
                  </p>
                  <p>
                    <strong>Khách hàng:</strong> {orderInfo.customerName}
                  </p>
                  <p>
                    <strong>Ngày đặt:</strong>{" "}
                    {new Date(orderInfo.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {orderInfo.totalAmount.toLocaleString()} VND
                  </p>
                </div>
              )}

              {/* Chọn phương thức thanh toán */}
              <div>
                <label className="font-medium text-gray-800">
                  Phương thức thanh toán:
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="rounded border px-2 py-1"
                >
                  <option value="">-- Chọn phương thức --</option>
                  {paymentMethod.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
