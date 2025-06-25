<script>
  import Sidebar from "../AdminPage/Sidebar.svelte";
  import Header from "../AdminPage/Header.svelte";
  import { onMount } from "svelte";

  let adminName = localStorage.getItem("user.name") || "Admin";
  let orders = [];
  let loading = true;
  let error = null;
  let selectedOrder = null;
  let filterStatus = "All";
  let modalLoading = false;

  onMount(async () => {
    await fetchOrders();
  });

  async function fetchOrders() {
    loading = true;
    error = null;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        error = "Authentication required. Please log in.";
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:8080/api/admin/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          error = "Session expired. Redirecting to login...";
          setTimeout(() => (window.location.href = "/login"), 20000);
          return;
        }
        if (response.status === 403) {
          error = "Admin role required to view orders.";
          return;
        }
        const errorText = await response.text();
        console.error(`Server error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      orders = await response.json();
      console.log("Orders fetched:", orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function viewOrderDetails(order) {
    selectedOrder = { ...order }; // Clone to avoid direct mutation
  }

  function closeDetails() {
    selectedOrder = null;
    modalLoading = false;
  }

  async function updateOrderStatus(orderId, newStatus) {
    if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;

    modalLoading = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        error = "Authentication required. Please log in.";
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}/status?status=${newStatus}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          error = "Session expired. Redirecting to login...";
          setTimeout(() => (window.location.href = "/login"), 2000);
          return;
        }
        if (response.status === 403) {
          error = "Admin role required to update order status.";
          return;
        }
        const errorData = await response.json();
        console.error(`Server error (${response.status}):`, errorData);
        throw new Error(errorData.message || "Failed to update order status");
      }

      const updatedOrder = await response.json();
      orders = orders.map((order) => (order.id === orderId ? updatedOrder : order));
      if (selectedOrder && selectedOrder.id === orderId) {
        selectedOrder = { ...updatedOrder };
      }
      console.log("Order status updated:", updatedOrder);
    } catch (err) {
      console.error("Error updating order status:", err);
      error = `Failed to update order: ${err.message}`;
    } finally {
      modalLoading = false;
    }
  }

  async function cancelOrder(orderId) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    modalLoading = true;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        error = "Authentication required. Please log in.";
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          error = "Session expired. Redirecting to login...";
          setTimeout(() => (window.location.href = "/login"), 2000);
          return;
        }
        if (response.status === 403) {
          error = "Admin role required to cancel order.";
          return;
        }
        if (response.status === 400) {
          error = "Cannot cancel order: Order is not in PENDING status.";
          return;
        }
        const errorText = await response.text();
        console.error(`Server error (${response.status}):`, errorText);
        throw new Error("Failed to cancel order");
      }

      orders = orders.filter((order) => order.id !== orderId);
      if (selectedOrder && selectedOrder.id === orderId) {
        selectedOrder = null;
      }
      console.log("Order cancelled:", orderId);
    } catch (err) {
      console.error("Error cancelling order:", err);
      error = `Failed to cancel order: ${err.message}`;
    } finally {
      modalLoading = false;
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "DELIVERING":
        return "status-delivering";
      case "COMPLETED":
        return "status-completed";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function formatPrice(price) {
    if (price == null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  }

  $: filteredOrders = filterStatus === "All" ? orders : orders.filter((order) => order.status === filterStatus);
</script>

<div class="app">
  <Sidebar activePage="Orders" />
  <div class="main-content">
    <Header {adminName} />
    <div class="order-manager">
      <div class="header">
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
          <button class="action-button refresh" on:click={fetchOrders}>
            <span class="icon">↻</span> Refresh
          </button>
        </div>
      </div>

      {#if loading}
        <div class="loading">
          <div class="spinner"></div>
          Loading orders...
        </div>
      {:else if error}
        <div class="error">
          <span>{error}</span>
          <button class="action-button retry" on:click={fetchOrders}>Retry</button>
        </div>
      {:else if filteredOrders.length === 0}
        <div class="empty">No orders found.</div>
      {:else}
        <div class="order-table">
          <table>
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
                  <td>{order.user?.name || "Unknown"}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td class="address">{order.delivery_address || "Not specified"}</td>
                  <td>{formatPrice(order.total_price)}</td>
                  <td>
                    <span class={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td class="action-cell">
                    <button class="action-button details" on:click={() => viewOrderDetails(order)}>
                      Details
                    </button>
                    {#if order.status !== "CANCELLED" && order.status !== "COMPLETED"}
                      <button class="action-button cancel" on:click={() => cancelOrder(order.id)}>
                        Cancel
                      </button>
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      {#if selectedOrder}
        <div class="modal">
          <div class="modal-content">
            <button class="close-button" on:click={closeDetails}>×</button>
            <h2>Order Details #{selectedOrder.id}</h2>

            <div class="order-details">
              <div class="details-section">
                <h3>Customer Information</h3>
                <div class="detail-group">
                  <label>Name:</label>
                  <span>{selectedOrder.user?.name || "N/A"}</span>
                </div>
                <div class="detail-group">
                  <label>Phone:</label>
                  <span>{selectedOrder.user?.phone || "N/A"}</span>
                </div>
                <div class="detail-group">
                  <label>Email:</label>
                  <span>{selectedOrder.user?.email || "N/A"}</span>
                </div>
                <div class="detail-group">
                  <label>Delivery Address:</label>
                  <span>{selectedOrder.delivery_address || "N/A"}</span>
                </div>
              </div>

              <div class="details-section">
                <h3>Order Items</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Image</th>
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
                          <td>
                            {#if item.product?.image}
                              <img src={item.product.image} alt={item.product.name} class="item-image" />
                            {:else}
                              N/A
                            {/if}
                          </td>
                          <td>{item.product?.name || "Unknown product"}</td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      {/each}
                    {:else}
                      <tr>
                        <td colspan="5">No items found</td>
                      </tr>
                    {/if}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4" class="total-label">Total:</td>
                      <td class="total-value">{formatPrice(selectedOrder.total_price)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div class="details-section">
                <h3>Order Status</h3>
                <div class="status-update">
                  <select bind:value={selectedOrder.status} disabled={modalLoading}>
                    <option value="PENDING">Pending</option>
                    <option value="DELIVERING">Delivering</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <button
                    class="action-button update"
                    on:click={() => updateOrderStatus(selectedOrder.id, selectedOrder.status)}
                    disabled={modalLoading}
                  >
                    {#if modalLoading}
                      <div class="spinner small"></div>
                      Updating...
                    {:else}
                      Update Status
                    {/if}
                  </button>
                </div>
                {#if error && selectedOrder}
                  <div class="error">{error}</div>
                {/if}
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
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="action-button secondary" on:click={closeDetails} disabled={modalLoading}>
                Close
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: #f4f6f9;
  }

  .app {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    background-color: #f4f6f9;
  }

  .order-manager {
    max-width: 1280px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 24px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1f2a44;
    margin: 0;
  }

  .filters {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .filters label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  .filters select {
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #1f2a44;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 48px;
    font-size: 18px;
    font-weight: 500;
    color: #6b7280;
  }

  .spinner {
    width: 28px;
    height: 28px;
    border: 4px solid #ff4d4f;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner.small {
    width: 20px;
    height: 20px;
    border-width: 3px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    text-align: center;
    padding: 24px;
    font-size: 16px;
    font-weight: 500;
    color: #dc2626;
    background: #fef2f2;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .empty {
    text-align: center;
    padding: 48px;
    font-size: 18px;
    font-weight: 500;
    color: #6b7280;
    background: #f9fafb;
    border-radius: 8px;
  }

  .order-table {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
  }

  thead {
    background: #f9fafb;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  th {
    padding: 16px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    border-bottom: 2px solid #e5e7eb;
  }

  td {
    padding: 16px;
    font-size: 14px;
    color: #1f2a44;
    border-bottom: 1px solid #f3f4f6;
  }

  .address {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .action-cell {
    display: flex;
    gap: 8px;
  }

  .action-button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .action-button.details {
    background: #3b82f6;
    color: #ffffff;
  }

  .action-button.details:hover {
    background: #2563eb;
  }

  .action-button.cancel {
    background: #ef4444;
    color: #ffffff;
  }

  .action-button.cancel:hover {
    background: #dc2626;
  }

  .action-button.refresh {
    background: #10b981;
    color: #ffffff;
  }

  .action-button.refresh:hover {
    background: #059669;
  }

  .action-button.retry {
    background: #ff4d4f;
    color: #ffffff;
  }

  .action-button.retry:hover {
    background: #e02424;
  }

  .action-button.update {
    background: #3498db;
    color: #ffffff;
  }

  .action-button.update:hover {
    background: #1e87db;
  }

  .action-button.secondary {
    background: #e5e7eb;
    color: #1f2a44;
  }

  .action-button.secondary:hover {
    background: #d1d5db;
  }

  .status-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    color: #ffffff;
  }

  .status-pending {
    background-color: #f39c12;
  }

  .status-delivering {
    background-color: #3498db;
  }

  .status-completed {
    background-color: #2ecc71;
  }

  .status-cancelled {
    background-color: #e74c3c;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .close-button:hover {
    color: #1f2a44;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1f2a44;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 8px;
  }

  .details-section {
    margin-bottom: 24px;
  }

  .detail-group {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .detail-group label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  .detail-group span {
    font-size: 14px;
    color: #1f2a44;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
  }

  .items-table th,
  .items-table td {
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 14px;
    color: #1f2a44;
  }

  .items-table th {
    background: #f9fafb;
    font-weight: 600;
    text-align: left;
  }

  .item-image {
    width: 50px;
    height: auto;
    border-radius: 6px;
  }

  .total-label {
    text-align: right;
    font-weight: 600;
  }

  .total-value {
    font-weight: 600;
    color: #e74c3c;
  }

  .status-update {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .status-update select {
    flex: 1;
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #1f2a44;
  }

  .timeline {
    position: relative;
    margin: 20px 0;
  }

  .timeline:before {
    content: "";
    position: absolute;
    left: 12px;
    top: 0;
    height: 100%;
    width: 2px;
    background-color: #e5e7eb;
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
    padding: 12px;
    background-color: #f9fafb;
    border-radius: 6px;
  }

  .timeline-date {
    color: #6b7280;
    font-size: 12px;
    margin: 0 0 4px 0;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 16px;
    }

    .order-manager {
      padding: 16px;
    }

    h1,
    h2 {
      font-size: 24px;
    }

    th,
    td {
      padding: 12px;
      font-size: 13px;
    }

    .address {
      max-width: 150px;
    }

    .modal-content {
      padding: 16px;
      max-width: 95%;
    }

    .action-button {
      padding: 6px 12px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .order-table {
      font-size: 12px;
    }

    th,
    td {
      padding: 8px;
    }

    .action-cell {
      flex-direction: column;
      gap: 4px;
    }

    .loading,
    .error,
    .empty {
      font-size: 16px;
      padding: 32px;
    }

    .item-image {
      width: 40px;
    }
  }
</style>