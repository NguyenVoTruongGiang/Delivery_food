<!-- src/components/RecentOrders.svelte -->
<script>
    let orders = [
      { id: "1", customer: "giangkoli", restaurant: "Burger King", status: "Delivered", amount: "$35.50" },
      { id: "2", customer: "kolikoli", restaurant: "Pizza Hut", status: "In Progress", amount: "$42.75" },
    ];
  
    function viewOrder(orderId) {
      alert(`Viewing details for order ${orderId}`);
      // Add logic to navigate to order details page or show a modal
    }
  </script>
  
  <div class="recent-orders">
    <h2>Recent Orders</h2>
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
        {#each orders as order}
          <tr>
            <td>{order.id}</td>
            <td>
              {order.customer}
            </td>
            <td>{order.restaurant}</td>
            <td>
              <span class="status {order.status.toLowerCase().replace(' ', '-')}">{order.status}</span>
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
  
  <style>
    .recent-orders {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
  
    h2 {
      font-size: 18px;
      margin-bottom: 15px;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
    }
  
    th, td {
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
    }
  
    .delivered {
      background-color: #e6ffed;
      color: #28a745;
    }
  
    .in-progress {
      background-color: #fff3cd;
      color: #856404;
    }
  
    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }
  </style>