<script>
  import { onMount, onDestroy } from "svelte";
  import { writable } from "svelte/store";

  let orders = writable([]);
  const storeAddress = "Trường Đại học Nông Lâm TP. Hồ Chí Minh";

  let selectedOrder = null;
  let errorMessage = "";
  const baseUrl = "http://localhost:8080"; // Thay bằng URL API thực tế

  // Lấy danh sách đơn hàng từ API
  async function fetchOrders() {
    try {
      const response = await fetch(`${baseUrl}/order/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Không thể tải đơn hàng");
      const data = await response.json();
      console.log("Đơn hàng:", data);
      orders.set(data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      errorMessage = "Không thể tải đơn hàng. Vui lòng kiểm tra kết nối.";
    }
  }

  // Cập nhật trạng thái đơn hàng
  async function updateOrderStatus(orderId, newStatus) {
    try {
      const response = await fetch(`${baseUrl}/order/${orderId}/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Cập nhật trạng thái thất bại");
      await fetchOrders(); // Làm mới danh sách
      if (selectedOrder?.id === orderId) {
        selectedOrder.status = newStatus;
      }
      errorMessage = "";
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      errorMessage = "Cập nhật trạng thái thất bại. Vui lòng thử lại.";
    }
  }

  // Mở bản đồ
  function openMap(destination) {
    const origin = encodeURIComponent(storeAddress);
    const dest = encodeURIComponent(destination);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
    window.open(url, "_blank");
  }

  // Chọn đơn hàng để xem chi tiết
  function selectOrder(order) {
    // Nếu có order_items (API trả về), map sang items cho UI
    let items = [];
    if (Array.isArray(order.items)) {
      items = order.items;
    } else if (Array.isArray(order.order_items)) {
      items = order.order_items.map((item) => ({
        name: item.product?.name || "Sản phẩm",
        quantity: item.quantity,
        price: item.price,
      }));
    }
    selectedOrder = {
      ...order,
      items,
    };
  }

  // Đóng chi tiết đơn hàng
  function closeDetails() {
    selectedOrder = null;
  }

  onMount(() => {
    fetchOrders();
  });
</script>

<main class="shipper-page">
  <header>
    <h1>Đơn hàng của bạn</h1>
    <button class="refresh-btn" on:click={fetchOrders}>Làm mới</button>
  </header>

  {#if errorMessage}
    <div class="error-alert">{errorMessage}</div>
  {/if}

  <section class="order-list">
    {#each $orders as order}
      <div
        class="order-card"
        on:click={() => selectOrder(order)}
        on:keydown={(e) => e.key === "Enter" && selectOrder(order)}
        role="button"
        tabindex="0"
      >
        <div class="order-info">
          <h3>Đơn #{order.id} - {order.user?.name}</h3>
          <p>{order.delivery_address}</p>
          <p>Ngày giao: {order.created_at}</p>
          <p>Tổng: {order.total_price?.toLocaleString()} ₫</p>
        </div>
        <div class="order-status {order.status}">
          {order.status === "PENDING"
            ? "Chờ xử lý"
            : order.status === "DELIVERING"
              ? "Đang giao"
              : "Hoàn thành"}
        </div>
      </div>
    {/each}
  </section>

  {#if selectedOrder}
    <div class="order-details">
      <div class="details-content">
        <button class="close-btn" on:click={closeDetails}>×</button>
        <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
        <p><strong>Khách hàng:</strong> {selectedOrder.user?.name}</p>
        <p><strong>Số điện thoại:</strong> {selectedOrder.user?.name}</p>
        <p><strong>Địa chỉ:</strong> {selectedOrder.delivery_address}</p>
        <p><strong>Ngày giao:</strong> {selectedOrder.created_at}</p>
        <h3>Sản phẩm</h3>
        <ul>
          {#each selectedOrder.items as item}
            <li>{item.name} x{item.quantity} - {item.price} $</li>
          {/each}
        </ul>
        <p>
          <strong>Tổng:</strong>
          {selectedOrder.total_price?.toLocaleString()} đ
        </p>
        <div class="status-actions">
          <h3>Trạng thái</h3>
          <select
            bind:value={selectedOrder.status}
            on:change={() =>
              updateOrderStatus(selectedOrder.id, selectedOrder.status)}
          >
            <option value="PENDING">Chờ xử lý</option>
            <option value="DELIVERING">Đang giao</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
        </div>
        <button
          class="map-btn"
          on:click={() => openMap(selectedOrder.delivery_address)}
        >
          Xác nhận giao hàng
        </button>
      </div>
    </div>
  {/if}
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  .shipper-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 24px;
    color: #333;
  }

  .refresh-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
  }

  .error-alert {
    background: #ffe6e6;
    color: #d32f2f;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
  }

  .order-list {
    display: grid;
    gap: 15px;
  }

  .order-card {
    background: white;
    border-radius: 10px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .order-info {
    flex: 1;
  }

  .order-info h3 {
    font-size: 16px;
    margin-bottom: 5px;
  }

  .order-info p {
    font-size: 14px;
    color: #666;
    margin-bottom: 3px;
  }

  .order-status {
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 5px;
    text-transform: capitalize;
  }

  .order-status.pending {
    background: #fff3cd;
    color: #856404;
  }

  .order-status.delivering {
    background: #d4edda;
    color: #155724;
  }

  .order-status.completed {
    background: #d1ecf1;
    color: #0c5460;
  }

  .order-details {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .details-content {
    background: white;
    border-radius: 10px;
    padding: 20px;
    max-width: 400px;
    width: 90%;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }

  .details-content h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .details-content p {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .details-content ul {
    list-style: none;
    margin-bottom: 15px;
  }

  .details-content li {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .status-actions {
    margin-bottom: 15px;
  }

  .status-actions select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }

  .map-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .shipper-page {
      padding: 15px;
    }

    h1 {
      font-size: 20px;
    }

    .refresh-btn {
      padding: 6px 12px;
      font-size: 14px;
    }

    .order-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .order-info h3 {
      font-size: 14px;
    }

    .order-info p {
      font-size: 12px;
    }

    .order-status {
      font-size: 12px;
      padding: 4px 8px;
    }

    .details-content {
      width: 95%;
      padding: 15px;
    }

    .details-content h2 {
      font-size: 18px;
    }

    .details-content p,
    .details-content li {
      font-size: 12px;
    }

    .status-actions select {
      font-size: 12px;
    }

    .map-btn {
      padding: 8px;
      font-size: 14px;
    }
  }
</style>
