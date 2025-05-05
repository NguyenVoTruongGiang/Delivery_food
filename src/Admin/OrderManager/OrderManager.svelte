<!-- src/OrderManager.svelte -->
<script>
  import Sidebar from "../AdminPage/Sidebar.svelte";
  import Header from "../AdminPage/Header.svelte";

  let adminName = "John";
  let orders = [
    {
      id: "#ORD-001",
      customer: "Sarah Johnson",
      restaurant: "Burger King",
      status: "Delivered",
      amount: "$35.50",
    },
    {
      id: "#ORD-002",
      customer: "Mike Smith",
      restaurant: "Pizza Hut",
      status: "In Progress",
      amount: "$42.75",
    },
    {
      id: "#ORD-003",
      customer: "Emily Davis",
      restaurant: "KFC",
      status: "Cancelled",
      amount: "$28.00",
    },
  ];

  let filterStatus = "All";
  $: filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  // Xem chi tiết đơn hàng
  function viewOrder(orderId) {
    alert(`Viewing details for order ${orderId}`);
  }

  // Cập nhật trạng thái đơn hàng
  // function updateOrderStatus(orderId, newStatus) {
  //   orders = orders.map(order => {
  //     if (order.id === orderId) {
  //       return { ...order, status: newStatus };
  //     }
  //     return order;
  //   });

  //   // (Tùy chọn) Gửi yêu cầu cập nhật lên server
  //   // fetch(`/api/orders/${orderId}`, {
  //   //   method: "PATCH",
  //   //   headers: { "Content-Type": "application/json" },
  //   //   body: JSON.stringify({ status: newStatus }),
  //   // })
  //   //   .then(res => res.json())
  //   //   .then(data => console.log("Order updated:", data))
  //   //   .catch(err => console.error("Error updating order:", err));
  // }

  function updateOrderStatus(orderId, newStatus) {
    if (
      confirm(`Are you sure you want to change the status to ${newStatus}?`)
    ) {
      orders = orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
    }
  }

  // Lọc đơn hàng theo trạng thái
  function handleFilterChange(event) {
    filterStatus = event.target.value;
  }
</script>

<div class="app">
  <Sidebar activePage="Orders" />
  <div class="main-content">
    <Header {adminName} />
    <div class="dashboard">
      <h1>Order Manager</h1>
      <p>Manage all orders here.</p>

      <div class="filter">
        <label for="status">Filter by Status:</label>
        <select
          id="status"
          bind:value={filterStatus}
          on:change={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="Delivered">Delivered</option>
          <option value="In Progress">In Progress</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div class="recent-orders">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Restaurant</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredOrders as order}
              <tr>
                <td>{order.id}</td>
                <td>
                  <img src="https://via.placeholder.com/30" alt="Customer" />
                  {order.customer}
                </td>
                <td>{order.restaurant}</td>
                <td>
                  <select
                    class="status {order.status
                      .toLowerCase()
                      .replace(' ', '-')}"
                    value={order.status}
                    on:change={(e) =>
                      updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="Delivered" class="status delivered"
                      >Delivered</option
                    >
                    <option value="In Progress" class="status in-progress"
                      >In Progress</option
                    >
                    <option value="Cancelled" class="status cancelled"
                      >Cancelled</option
                    >
                  </select>
                </td>
                <td>{order.amount}</td>
                <td>
                  <button on:click={() => viewOrder(order.id)}>👁️</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
    font-family: Arial, sans-serif;
  }

  .main-content {
    flex: 1;
    padding: 20px;
    background-color: #f5f7fa;
    overflow-y: auto;
  }

  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 5px;
  }

  p {
    color: #888;
    margin-bottom: 20px;
  }

  .filter {
    margin-bottom: 20px;
  }

  .filter label {
    margin-right: 10px;
  }

  .filter select {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .recent-orders {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 10px;
    text-align: left;
  }

  th {
    font-size: 14px;
    color: #888;
  }

  td {
    font-size: 14px;
  }

  td img {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    vertical-align: middle;
    margin-right: 10px;
  }

  .status {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    border: none;
  }

  .delivered {
    background-color: #e6ffed;
    color: #28a745;
  }

  .in-progress {
    background-color: #fff3cd;
    color: #856404;
  }

  .cancelled {
    background-color: #f8d7da;
    color: #dc3545;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }
</style>
