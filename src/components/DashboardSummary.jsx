export const DashboardSummary = () => {
  // Mock data
  const products = [
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
    { id: 3, name: "Product C" },
  ];

  const warehouses = [
    { id: 1, name: "Warehouse 1" },
    { id: 2, name: "Warehouse 2" },
  ];

  const orders = [
    { id: 1, productId: 1, quantity: 5 },
    { id: 2, productId: 2, quantity: 2 },
    { id: 3, productId: 3, quantity: 1 },
    { id: 4, productId: 1, quantity: 3 },
  ];

  const totalProducts = products.length;
  const totalWarehouses = warehouses.length;
  const totalOrders = orders.length;

  return (
    <div className="flex justify-between rounded-md bg-gray-100 p-4 shadow-md">
      <div className="text-center">
        <h3 className="text-xl font-semibold">{totalProducts}</h3>
        <p>Tổng sản phẩm</p>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold">{totalWarehouses}</h3>
        <p>Tổng kho</p>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold">{totalOrders}</h3>
        <p>Tổng đơn hàng</p>
      </div>
    </div>
  );
};
