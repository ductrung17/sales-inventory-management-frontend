import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { ProductList } from "./pages/ProductList";
import { CreateProduct } from "./pages/CreateProduct";
import { EditProduct } from "./pages/EditProduct";
import { Inventory } from "./pages/Inventory";
import { AddOrder } from "./pages/AddOrder";
import { OrderList } from "./pages/OrderList";
import { PaymentList } from "./pages/PaymentList";
import { CreatePayment } from "./pages/CreatePayment";
import { RevenueReport } from "./pages/RevenueReport";
import { UserList } from "./pages/UserList";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/add-order" element={<AddOrder />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/create-payment" element={<CreatePayment />} />
        <Route path="/revenue-report" element={<RevenueReport />} />
        <Route path="/users" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;
