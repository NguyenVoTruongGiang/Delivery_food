<script>
  import Sidebar from "../AdminPage/Sidebar.svelte";
  import Header from "../AdminPage/Header.svelte";
  import { onMount } from 'svelte';
  
  let adminName = "Admin";
  let orders = [];
  let loading = true;
  let error = null;
  let selectedOrder = null;
  
  // Filter options
  let filterStatus = "All";
  
  onMount(async () => {
    await fetchOrders();
  });
  
  async function fetchOrders() {
    loading = true;
    error = null;
    try {
      const response = await fetch("http://localhost:8080/api/admin/orders", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch orders");
      orders = await response.json();
    } catch (err) {
      console.error("Error fetching orders:", err);
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  function viewOrderDetails(order) {
    selectedOrder = order;
  }
  
  function closeDetails() {
    selectedOrder = null;
  }
  
  async function updateOrderStatus(orderId, newStatus) {
    if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}/status?status=${newStatus}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to update order status");
      
      // Update order in the list
      orders = orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      });
      
      if (selectedOrder && selectedOrder.id === orderId) {
        selectedOrder = { ...selectedOrder, status: newStatus };
      }
      
      alert("Order status updated successfully");
    } catch (err) {
      console.error("Error updating order status:", err);
      alert(`Failed to update order: ${err.message}`);
    }
  }
  
  async function cancelOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to cancel order");
      
      // Remove order from list
      orders = orders.filter(o => o.id !== orderId);
      
      if (selectedOrder && selectedOrder.id === orderId) {
        selectedOrder = null;
      }
      
      alert("Order cancelled successfully");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert(`Failed to cancel order: ${err.message}`);
    }
  }
  
  function getStatusClass(status) {
    switch(status) {
      case "PENDING": return "status-pending";
      case "DELIVERING": return "status-delivering";
      case "COMPLETED": return "status-completed";
      case "CANCELLED": return "status-cancelled";
      default: return "";
    }
  }
  
  function formatDate(dateString) {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  function formatPrice(price) {
    if (price == null) return "0 đ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
  
  // Filter orders based on status
  $: filteredOrders = filterStatus === "All" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);
</script>

<div class="app">
  <Sidebar activePage="Orders" />
  <div class="main-content">
    <Header {adminName} />
    <div class="order-manager">
      <div class="header-actions">
        <h1>Order Management</h1>
        <div class="filters">
          <label for="status-filter">Filter by Status:</label>
          <select id="status-filter" bind:value={filterStatus}>
            <option value="All">All</option>
            <option value="PENDING">Pending</option>
            <option value="DELIVERING">Delivering</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button class="refresh-button" on:click={fetchOrders}>
            <span class="material-icons">refresh</span>
          </button>
        </div>
      </div>
      
      {#if loading}
        <div class="loading">Loading orders...</div>
      {:else if error}
        <div class="error">Error: {error}</div>
      {:else if orders.length === 0}
        <div class="no-data">No orders found.</div>
      {:else}
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Delivery Address</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredOrders as order}
              <tr>
                <td>#{order.id}</td>
                <td>{order.user?.name || 'Unknown'}</td>
                <td>{formatDate(order.created_at)}</td>
                <td class="address">{order.delivery_address || 'Not specified'}</td>
                <td>{formatPrice(order.total_price)}</td>
                <td>
                  <span class={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td class="actions">
                  <button class="icon-button view" on:click={() => viewOrderDetails(order)}>
                    <span class="material-icons">visibility</span>
                  </button>
                  {#if order.status !== "CANCELLED" && order.status !== "COMPLETED"}
                    <button class="icon-button delete" on:click={() => cancelOrder(order.id)}>
                      <span class="material-icons">cancel</span>
                    </button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
      
      <!-- Order Details Modal -->
      {#if selectedOrder}
        <div class="modal">
          <div class="modal-content">
            <span class="close" on:click={closeDetails}>&times;</span>
            <h2>Order Details #{selectedOrder.id}</h2>
            
            <div class="order-details">
              <div class="details-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedOrder.user?.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                <p><strong>Delivery Address:</strong> {selectedOrder.delivery_address || 'N/A'}</p>
              </div>
              
              <div class="details-section">
                <h3>Order Items</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#if Array.isArray(selectedOrder.order_items) && selectedOrder.order_items.length > 0}
                      {#each selectedOrder.order_items as item}
                        <tr>
                          <td>{item.product?.name || 'Unknown product'}</td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      {/each}
                    {:else}
                      <tr>
                        <td colspan="4">No items found</td>
                      </tr>
                    {/if}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="total-label">Total:</td>
                      <td class="total-value">{formatPrice(selectedOrder.total_price)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div class="details-section">
                <h3>Order Status</h3>
                <div class="status-update">
                  <select bind:value={selectedOrder.status}>
                    <option value="PENDING">Pending</option>
                    <option value="DELIVERING">Delivering</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <button 
                    class="update-button"
                    on:click={() => updateOrderStatus(selectedOrder.id, selectedOrder.status)}>
                    Update Status
                  </button>
                </div>
              </div>
              
              <div class="details-section">
                <h3>Order Timeline</h3>
                <div class="timeline">
                  <div class="timeline-item">
                    <div class="timeline-point"></div>
                    <div class="timeline-content">
                      <p class="timeline-date">{formatDate(selectedOrder.created_at)}</p>
                      <p>Order placed</p>
                    </div>
                  </div>
                  
                  {#if selectedOrder.status !== "PENDING"}
                    <div class="timeline-item">
                      <div class="timeline-point"></div>
                      <div class="timeline-content">
                        <p class="timeline-date">{formatDate(selectedOrder.updated_at)}</p>
                        <p>Order {selectedOrder.status.toLowerCase()}</p>
                      </div>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
  }
  
  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .order-manager {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 24px;
    margin: 0;
  }
  
  .filters {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .filters select {
    padding: 8px 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  
  .refresh-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px;
    cursor: pointer;
  }
  
  .loading, .error, .no-data {
    padding: 20px;
    text-align: center;
  }
  
  .error {
    color: #e74c3c;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow: hidden;
  }
  
  .data-table th, .data-table td {
    padding: 12px 15px;
    text-align: left;
  }
  
  .data-table th {
    background-color: #34495e;
    color: white;
  }
  
  .data-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  .address {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .status-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
  }
  
  .status-pending {
    background-color: #f39c12;
    color: white;
  }
  
  .status-delivering {
    background-color: #3498db;
    color: white;
  }
  
  .status-completed {
    background-color: #2ecc71;
    color: white;
  }
  
  .status-cancelled {
    background-color: #e74c3c;
    color: white;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 50%;
  }
  
  .view {
    color: #3498db;
  }
  
  .delete {
    color: #e74c3c;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 700px;
    max-width: 90%;
    max-height: 90vh;
    position: relative;
    overflow-y: auto;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    cursor: pointer;
  }
  
  .order-details {
    margin-top: 20px;
  }
  
  .details-section {
    margin-bottom: 30px;
  }
  
  .details-section h3 {
    margin-top: 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
  
  .items-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .items-table th, .items-table td {
    padding: 8px 10px;
    border-bottom: 1px solid #eee;
  }
  
  .items-table th {
    background-color: #f9f9f9;
    font-weight: bold;
  }
  
  .total-label {
    text-align: right;
    font-weight: bold;
  }
  
  .total-value {
    font-weight: bold;
    color: #e74c3c;
  }
  
  .status-update {
    display: flex;
    gap: 10px;
  }
  
  .status-update select {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .update-button {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
  }
  
  .timeline {
    position: relative;
    margin: 20px 0;
  }
  
  .timeline:before {
    content: '';
    position: absolute;
    left: 12px;
    top: 0;
    height: 100%;
    width: 2px;
    background-color: #ddd;
  }
  
  .timeline-item {
    position: relative;
    padding-left: 40px;
    margin-bottom: 20px;
  }
  
  .timeline-point {
    position: absolute;
    left: 6px;
    top: 5px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: #3498db;
  }
  
  .timeline-content {
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
  }
  
  .timeline-date {
    color: #7f8c8d;
    font-size: 12px;
    margin: 0 0 5px 0;
  }
  
  .timeline-content p:last-child {
    margin-bottom: 0;
  }
</style>