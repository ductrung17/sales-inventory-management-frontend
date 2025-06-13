import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AddOrder = () => {
  // const getFiveDaysLater = () => {
  //   const today = new Date();
  //   today.setDate(today.getDate() + 5);
  //   return today.toISOString().split("T")[0];
  // };

  const [form, setForm] = useState({
    orderNumber: "",
    customerName: "",
    deliveryDeadline: "",
    shippingAddress: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Vietnam",
    },
    totalAmount: 0,
    items: [],
  });

  const [products, setProducts] = useState([]);

  // Lấy danh sách sản phẩm
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      const res = await axios.get(`${apiUrl}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn hàng:", err.message);
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId || selectedQuantity <= 0) return;

    const selectedProduct = products.find((p) => p._id === selectedProductId);
    const price = selectedProduct?.sellPrice || 0;

    const newItem = {
      productId: selectedProductId,
      quantity: selectedQuantity,
      price: price,
    };

    const updatedItems = [...form.items, newItem];
    setForm({ ...form, items: updatedItems });
    recalculateTotal(updatedItems);

    setSelectedProductId("");
    setSelectedQuantity(1);
    setSelectedPrice(0);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...form.items];
    updatedItems.splice(index, 1);
    setForm({ ...form, items: updatedItems });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("shippingAddress.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value,
        },
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const recalculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    setForm((prev) => ({ ...prev, totalAmount: total }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending order:", form);
    axios
      .post(`${apiUrl}/api/orders`, form)
      .then(() => alert("Tạo đơn hàng thành công"))
      .catch((err) => alert("Lỗi khi tạo đơn hàng"));
    navigate(`/orders?refresh=${Date.now()}`);
  };

  const generateOrderNumber = () => {
    return `${Date.now()}`;
  };

  const [orderNumber, setOrderNumber] = useState("");
  useEffect(() => {
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);
  }, []);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);

  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);

    const selected = products.find((p) => p._id === productId);
    if (selected) {
      setSelectedPrice(selected.price); // Lấy giá từ sản phẩm
    } else {
      setSelectedPrice(0);
    }
  };
  useEffect(() => {
    const newOrderNumber = generateOrderNumber();

    const today = new Date();
    today.setDate(today.getDate() + 5);
    const fiveDaysLater = today.toISOString().split("T")[0];

    setOrderNumber(newOrderNumber);
    setForm((prev) => ({
      ...prev,
      orderNumber: newOrderNumber,
      deliveryDeadline: fiveDaysLater,
    }));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen sm:ml-0 md:ml-32">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="mt-8 flex flex-1 justify-center px-4 py-4 sm:px-6 lg:ml-40 lg:justify-start">
          <div className="w-full max-w-screen-md rounded-xl bg-white bg-opacity-90 px-6 py-8 shadow-lg backdrop-blur-sm sm:px-10 lg:px-16">
            <h2 className="mb-6 text-2xl font-medium text-gray-900 sm:text-3xl">
              Tạo đơn hàng mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              {/* Mã đơn hàng */}
              <div>
                <label className="font-medium text-gray-800">
                  Mã đơn hàng:
                </label>
                <input
                  name="orderNumber"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-400 px-4 py-2"
                  placeholder="Mã đơn hàng"
                />
              </div>
              {/* Tên khách hàng */}
              <div>
                <label className="font-medium text-gray-800">
                  Tên khách hàng:
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-gray-400 px-4 py-2"
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              {/* Hạn giao hàng */}
              <div>
                <label className="font-medium text-gray-800">
                  Hạn giao hàng:
                </label>
                <input
                  type="date"
                  name="deliveryDeadline"
                  value={form.deliveryDeadline}
                  onChange={handleChange}
                  min={today}
                  className="mt-1 w-full rounded-md border border-gray-400 px-4 py-2"
                />
              </div>

              {/* Địa chỉ giao hàng */}
              <div>
                <label className="font-medium text-gray-800">
                  Địa chỉ giao hàng:
                </label>
                <input
                  type="text"
                  name="shippingAddress.street"
                  value={form.shippingAddress.street}
                  onChange={handleChange}
                  placeholder="Địa chỉ (số nhà, đường)"
                  className="mb-2 mt-1 w-full rounded-md border border-gray-400 px-4 py-2"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="shippingAddress.city"
                    value={form.shippingAddress.city}
                    onChange={handleChange}
                    placeholder="Tỉnh/ Thành phố"
                    className="w-full rounded-md border border-gray-400 px-4 py-2"
                  />
                  <input
                    type="text"
                    name="shippingAddress.country"
                    value={form.shippingAddress.country}
                    onChange={handleChange}
                    placeholder="Quốc gia"
                    className="w-full rounded-md border border-gray-400 px-4 py-2"
                  />
                </div>
              </div>

              {/* Chọn sản phẩm mới */}
              <div className="mt-6 border-t border-gray-300 pt-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Thêm sản phẩm vào đơn hàng
                </h3>
                <div className="mb-4 grid gap-4 sm:grid-cols-3">
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleSelectProduct(e.target.value)}
                    className="rounded border px-3 py-2"
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Số lượng"
                    value={selectedQuantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1) {
                        setSelectedQuantity(value);
                      }
                    }}
                    className="rounded border px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-black"
                  >
                    + Thêm sản phẩm
                  </button>
                </div>
              </div>

              {/* Danh sách sản phẩm đã chọn */}
              {form.items.length > 0 && (
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Danh sách sản phẩm đã thêm
                  </h3>
                  {form.items.map((item, index) => {
                    const product = products.find(
                      (p) => p._id === item.productId,
                    );
                    return (
                      <div
                        key={index}
                        className="mb-2 flex items-center justify-between rounded border bg-gray-50 p-3"
                      >
                        <span>
                          {product?.name || "Sản phẩm đã xóa"} - SL:{" "}
                          {item.quantity} - Giá: {item.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-sm text-red-500 underline"
                        >
                          Xoá
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tổng tiền */}
              <div>
                <label className="block font-semibold">
                  Tổng tiền (tự tính):
                </label>
                <input
                  type="number"
                  value={form.totalAmount}
                  disabled
                  className="w-full rounded border bg-gray-100 px-3 py-2"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
                >
                  Tạo đơn hàng
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
