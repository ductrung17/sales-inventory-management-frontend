import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const Inventory = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/login");
    }

    fetchProducts();
  }, [navigate]);

  const apiUrl = import.meta.env.VITE_API_URL;

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
      console.error("Lỗi khi tải danh sách sản phẩm:", err.message);
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        const token = localStorage.getItem("jwtToken");

        await axios.delete(`${apiUrl}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        fetchProducts();
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err.message);
      }
    }
  };

  // Chuyển sang trang sửa
  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
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
        <main className="mt-20 w-full px-4 lg:ml-0 lg:mt-20 lg:w-4/5 lg:px-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h2 className="text-xl font-semibold text-gray-700 md:text-2xl">
              Danh sách sản phẩm
            </h2>

            <a
              href="/create-product"
              className="rounded-full bg-green-100 p-3 hover:bg-green-200"
            >
              <FaPlus size={20} />
            </a>
          </div>

          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full table-auto text-center text-xs text-gray-700 md:text-sm">
              <thead className="bg-gray-200 uppercase text-gray-700">
                <tr>
                  <th className="px-2 py-4">STT</th>
                  <th className="px-2 py-4">Tên sản phẩm</th>
                  <th className="px-2 py-4">Giá nhập</th>
                  <th className="px-2 py-4">Giá bán</th>
                  <th className="px-2 py-4">Tồn kho</th>
                  <th className="px-2 py-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white font-normal text-black">
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td className="px-2 py-3">{index + 1}</td>
                    <td className="px-2 py-3">{product.description}</td>
                    <td className="px-2 py-3">
                      {product.importPrice.toLocaleString()}₫
                    </td>
                    <td className="px-2 py-3">
                      {product.sellPrice.toLocaleString()}₫
                    </td>
                    <td className="px-2 py-3">{product.stock}</td>
                    <td className="space-x-2 px-2 py-3">
                      <button onClick={() => handleEdit(product._id)}>
                        <FaEdit size={11} />
                      </button>
                      <button onClick={() => handleDelete(product._id)}>
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
