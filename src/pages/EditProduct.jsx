import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FaDollarSign, FaBox, FaBoxes } from "react-icons/fa";
import { MdNumbers } from "react-icons/md";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const EditProduct = () => {
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    name: "",
    importPrice: 0,
    sellPrice: 0,
    stock: 0,
    description: "",
    image: null,
  });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/login");
      }

      try {
        const res = await axios.get(`${apiUrl}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // gửi token trong header
          },
        });
        setForm({
          name: res.data.name,
          importPrice: res.data.importPrice,
          sellPrice: res.data.sellPrice,
          stock: res.data.stock,
          description: res.data.description,
          image: res.data.image,
        });
      } catch (error) {
        console.error("Lỗi khi sửa sản phẩm:", error.message);
      }
    };

    fetchProduct();
  }, [id]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`${apiUrl}/api/products/${id}`, form);
  //     alert("Cập nhật sản phẩm thành công!");
  //     navigate("/products");
  //   } catch (err) {
  //     alert("Lỗi khi cập nhật sản phẩm");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("importPrice", form.importPrice);
      formData.append("sellPrice", form.sellPrice);
      formData.append("stock", form.stock);
      formData.append("description", form.description);

      // Nếu đã chọn ảnh mới thì thêm ảnh
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      await axios.put(`${apiUrl}/api/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Cập nhật sản phẩm thành công!");
      navigate("/products");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  return (
    <div className="min-h-screen sm:ml-0 md:ml-32">
      <Header />

      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        {/* Main content */}
        <main className="mt-8 flex flex-1 justify-center px-4 py-4 sm:px-6 lg:ml-40 lg:justify-start">
          <div className="w-full max-w-screen-md rounded-xl bg-white bg-opacity-90 px-6 py-8 shadow-lg backdrop-blur-sm sm:px-10 lg:px-16">
            <h2 className="mb-8 flex justify-center text-center text-2xl font-medium text-gray-900 sm:text-left sm:text-3xl">
              Cập nhật thông tin sản phẩm
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-6">
                {/* Tên sản phẩm */}
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Tên sản phẩm:
                  </label>
                  <div className="relative">
                    <FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Ảnh sản phẩm:
                  </label>
                  {form.image && typeof form.image === "string" && (
                    <div>
                      <img
                        src={`${apiUrl}${form.image}`}
                        className="aspect-[3/4] w-full max-w-[250px] rounded-md object-cover"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.files[0] })
                    }
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Giá nhập */}
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Giá nhập:
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="importPrice"
                      value={form.importPrice}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Giá nhập kho"
                    />
                  </div>
                </div>

                {/* Giá bán */}
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Giá bán:
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="sellPrice"
                      value={form.sellPrice}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Giá bán"
                    />
                  </div>
                </div>

                {/* Tồn kho */}
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Tồn kho:
                  </label>
                  <div className="relative">
                    <MdNumbers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-400 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Số lượng tồn kho"
                    />
                  </div>
                </div>

                {/* Mô tả */}
                <div>
                  <label className="mb-2 flex justify-start font-medium text-gray-800">
                    Mô tả sản phẩm:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-400 py-2 pl-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Nhập mô tả"
                    />
                  </div>
                </div>

                {/* Nút submit */}
                <div className="flex sm:justify-end">
                  <button
                    type="submit"
                    className="w-full rounded bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 sm:w-auto"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
