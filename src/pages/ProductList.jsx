import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const ProductList = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search");
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
            <table className="min-w-full table-auto text-left text-xs md:text-sm">
              <thead className="bg-gray-200 uppercase text-gray-700">
                <tr>
                  <th className="px-8 py-4">STT</th>
                  <th className="px-24 py-4">Ảnh minh họa</th>
                  <th className="px-8 py-4">Tên sản phẩm</th>
                  <th className="px-2 py-4">Mô tả</th>
                  <th className="px-8 py-4">Tồn kho</th>
                  <th className="px-8 py-4">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 bg-white font-normal text-black">
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td className="px-8 py-4">{index + 1}</td>
                    <td className="px-1 py-4">
                      <img
                        src={`${apiUrl}${product.image}`}
                        alt={product.name}
                        className="mx-auto w-full max-w-[200px] rounded-md object-cover"
                      />
                    </td>
                    <td className="px-8 py-4">{product.name}</td>
                    <td className="px-2 py-4">{product.description}</td>
                    <td className="px-8 py-4">{product.stock}</td>
                    <td className="space-x-2 px-8 py-4">
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
      {/* <footer className="mt-12 w-full bg-gray-100 px-6 py-8 text-sm text-gray-600">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-semibold text-gray-700">
              © 2025 Quản lý Kho hàng
            </p>
            <p>Thiết kế bởi bạn</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">
              Chính sách
            </a>
            <a href="#" className="hover:underline">
              Điều khoản
            </a>
            <a href="#" className="hover:underline">
              Liên hệ
            </a>
          </div>
        </div>
      </footer> */}
    </div>
  );
};
