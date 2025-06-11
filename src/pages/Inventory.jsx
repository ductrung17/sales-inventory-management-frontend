import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const Inventory = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search");

  const [searchInventory, setSearchInventory] = useState("");

  const handleSearch = (e) => {
    setSearchInventory(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInventory.trim()) {
      navigate(
        `/inventory?search=${encodeURIComponent(searchInventory.trim())}`,
      );
    } else {
      navigate("/inventory");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/login");
    }

    fetchProducts();
  }, [navigate, search]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const query = search ? `?search=${search}` : "";

      const res = await axios.get(`${apiUrl}/api/products${query}`, {
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
        <main className="mt-20 w-full px-4 lg:px-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h2 className="text-xl font-semibold text-gray-700 md:text-3xl">
              Kho hàng{" "}
            </h2>
            <div className="flex space-x-4">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center justify-start space-x-2"
              >
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  value={searchInventory}
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
                    <td className="px-2 py-3">{product.name}</td>
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
