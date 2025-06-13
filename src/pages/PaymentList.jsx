import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";

export const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search");

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const query = search ? `?search=${search}` : "";

      const res = await axios.get(`${apiUrl}/api/payments${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayments(res.data); // => res.data là mảng chứa cả order
    } catch (error) {
      console.error("Lỗi khi fetch danh sách payment:", error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }

    fetchPayments();
  }, [navigate, search]);

  const [searchPayment, setSearchPayment] = useState("");

  const handleSearch = (e) => {
    setSearchPayment(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchPayment.trim()) {
      navigate(`/payments?search=${encodeURIComponent(searchPayment.trim())}`);
    } else {
      navigate("/payments");
    }
  };

  const [statuses, setStatuses] = useState([]);
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/payment-statuses`);
        setStatuses(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách trạng thái thanh toán:", err);
      }
    };

    fetchStatuses();
  }, []);

  const handleStatusChange = async (paymentId, newValue, field) => {
    try {
      const token = localStorage.getItem("jwtToken");

      const updatePayload = {
        [field]: newValue,
      };

      await axios.put(`${apiUrl}/api/payments/${paymentId}`, updatePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchPayments();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Không thể cập nhật. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn thanh toán này?")) {
      try {
        const token = localStorage.getItem("jwtToken");

        await axios.delete(`${apiUrl}/api/payments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        fetchPayments();
      } catch (err) {
        console.error("Lỗi khi xóa đơn thanh toán:", err.message);
      }
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
              Danh sách thanh toán
            </h2>
            <div className="flex space-x-4">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center justify-start space-x-2"
              >
                <input
                  type="text"
                  placeholder="Tìm đơn thanh toán..."
                  value={searchPayment}
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
                href="/create-payment"
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
                  <th className="px-4 py-4">Ngày đặt</th>
                  <th className="px-4 py-4">Trạng thái</th>
                  <th className="px-4 py-4">Tổng tiền</th>
                  <th className="px-4 py-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 bg-white font-normal text-black">
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-4 py-4">{payment.order?.orderNumber}</td>
                    <td className="px-4 py-4">{payment.order?.customerName}</td>
                    <td className="px-4 py-4">
                      {new Date(payment.order?.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={payment.status}
                        disabled={payment.status === "Đã thanh toán"}
                        onChange={(e) =>
                          handleStatusChange(
                            payment._id,
                            e.target.value,
                            "status",
                          )
                        }
                        className="rounded border px-2 py-1"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-4">{payment.order?.totalAmount}đ</td>
                    <td className="px-2 py-4">
                      <button onClick={() => handleDelete(payment._id)}>
                        <FaTrash size={11} />
                      </button>
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
