<script>
  import { onMount } from "svelte";
  let orders = [];
  let selectedOrder = null;
  let loading = true;
  let error = "";

  onMount(async () => {
    loading = true;
    error = "";
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/order/my-orders", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Không thể lấy danh sách đơn hàng!");
      orders = await res.json();
      selectedOrder = orders[0] || null;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return dateStr.replace("T", " ").slice(0, 16);
  }

  function selectOrder(order) {
    selectedOrder = order;
  }
</script>

<main class="order-container">
  <h2>Danh sách đơn hàng của bạn</h2>
  {#if loading}
    <p class="loading">Đang tải...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if orders.length === 0}
    <p class="empty">Bạn chưa có đơn hàng nào.</p>
  {:else}
    <div class="grid-container">
      <!-- Order Details (Left) -->
      <div class="order-details">
        {#if selectedOrder}
          <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
          <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.created_at)}</p>
          <p><strong>Địa chỉ giao:</strong> {selectedOrder.delivery_address}</p>
          <p><strong>Trạng thái:</strong> <span class="status-{selectedOrder.status.toLowerCase()}">{selectedOrder.status}</span></p>
          <p><strong>Tổng tiền:</strong> {selectedOrder.total_price?.toLocaleString()}₫</p>
        {:else}
          <p class="empty">Chọn một đơn hàng để xem chi tiết.</p>
        {/if}
      </div>

      <!-- Order List (Right) -->
      <div class="order-list">
        {#each orders as order}
          <div 
            class="order-item" 
            class:selected={selectedOrder?.id === order.id}
            on:click={() => selectOrder(order)}
          >
            <p><strong>Mã đơn:</strong> {order.id}</p>
            <p><strong>Ngày đặt:</strong> {formatDate(order.created_at)}</p>
            <p><strong>Tổng tiền:</strong> {order.total_price?.toLocaleString()}₫</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</main>

<style>
.order-container {
  max-width: 1000px;
  margin: 32px auto;
  padding: 24px 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 18px;
  color: #1e3a8a;
}

.grid-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.order-details {
  background: #f0f5ff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #bfdbfe;
}

.order-details h3 {
  color: #1e40af;
  margin-bottom: 16px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #d1d5db;
}

.order-item:hover {
  background: #e0e7ff;
  border-color: #6366f1;
}

.order-item.selected {
  background: #dbeafe;
  border: 2px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.loading {
  color: #4b5563;
  font-weight: 500;
}

.error {
  color: #dc2626;
  font-weight: 500;
}

.empty {
  color: #6b7280;
}

p {
  margin: 8px 0;
  color: #111827;
}

.status-pending {
  color: #d97706;
  font-weight: 500;
}

.status-confirmed {
  color: #16a34a;
  font-weight: 500;
}

.status-cancelled {
  color: #dc2626;
  font-weight: 500;
}

.status-delivered {
  color: #1e40af;
  font-weight: 500;
}

/* Responsive Design */

/* Phone (up to 640px) */
@media (max-width: 640px) {
  .order-container {
    margin: 16px;
    padding: 16px;
  }

  .grid-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .order-details {
    padding: 12px;
  }

  .order-list {
    gap: 8px;
  }

  .order-item {
    padding: 8px;
  }

  h2 {
    font-size: 1.25rem;
  }

  .order-details h3 {
    font-size: 1rem;
  }

  p {
    font-size: 0.875rem;
  }
}

/* Tablet (641px to 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .order-container {
    max-width: 90%;
    padding: 20px;
  }

  .grid-container {
    grid-template-columns: 3fr 2fr;
    gap: 20px;
  }

  .order-details {
    padding: 16px;
  }

  .order-item {
    padding: 10px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .order-details h3 {
    font-size: 1.125rem;
  }
}

/* PC (1025px and above) */
@media (min-width: 1025px) {
  .order-container {
    max-width: 1000px;
    padding: 24px;
  }

  .grid-container {
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  .order-details {
    padding: 20px;
  }

  .order-item {
    padding: 12px;
  }

  h2 {
    font-size: 1.75rem;
  }

  .order-details h3 {
    font-size: 1.25rem;
  }
}
</style>