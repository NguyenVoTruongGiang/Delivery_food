<script>
  import { onMount } from "svelte";

  let orderId = "";
  let loading = true;
  let error = "";

  let subtotal = 0;
  let deliveryFee = 15000;
  let tax = 0;
  let total = 0;
  let url = "http://localhost:8080/order";
  const token = localStorage.getItem("token");

  // Các bước trạng thái đơn hàng
  let trackingSteps = [
    { status: "PENDING", label: "Đã đặt hàng", icon: "📝" },
    { status: "DELIVERING", label: "Đang giao", icon: "🚚" },
    { status: "COMPLETED", label: "Đã giao", icon: "✅" },
    { status: "CANCELLED", label: "Đã hủy", icon: "❌" }
  ];

  // Hàm mapping dữ liệu từ API về format cho UI
  function mapOrderData(apiOrder) {
    return {
      ...apiOrder,
      createdAt: apiOrder.created_at?.replace("T", " ").slice(0, 16) || "",
      address: {
        line: apiOrder.delivery_address || "",
        city: "",
        note: ""
      },
      items: (apiOrder.order_items || []).map(item => ({
        name: item.product?.name || "Sản phẩm",
        desc: item.product?.description || "",
        image: item.product?.image || "https://via.placeholder.com/60",
        price: item.price,
        qty: item.quantity
      })),
      shipper: {
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Nguyễn Văn A",
        vehicle: "Xe máy",
        rating: 4.8
      },
      estimatedDelivery: "30 phút"
    };
  }

  async function getOrderById() {
    try {
      const response = await fetch(`${url}/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải đơn hàng");
      }

      const apiOrder = await response.json();
      order = mapOrderData(apiOrder);

      subtotal = order.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
      tax = Math.round(subtotal * 0.1);
      total = subtotal + deliveryFee + tax;

      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  async function fetchOrder() {
    try {
      const response = await fetch(`${url}/my-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Không thể tải đơn hàng");
      }

      const orders = await response.json();
      if (!orders.length) throw new Error("Bạn chưa có đơn hàng nào.");
      // Lấy đơn mới nhất
      const apiOrder = orders[0];
      order = mapOrderData(apiOrder);

      subtotal = order.items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );
      tax = Math.round(subtotal * 0.1);
      total = subtotal + deliveryFee + tax;

      loading = false;
    } catch (err) {
      error = err.message;
      loading = false;
    }
  }

  async function cancelOrder() {
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        const response = await fetch(`${url}/${orderId}/cancel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể hủy đơn hàng");
        }

        alert("Đơn hàng đã được hủy thành công!");
        order.status = "CANCELLED";
      } catch (err) {
        alert(err.message);
      }
    }
  }

  onMount(async () => {
    orderId = new URLSearchParams(window.location.search).get("id");
    if (orderId) {
      await getOrderById();
    } else {
      await fetchOrder();
    }
  });
</script>

<main>
  {#if loading}
    <div class="container"><p>Đang tải đơn hàng...</p></div>
  {:else if error}
    <div class="container"><p style="color:red">{error}</p></div>
  {:else if order}
    <div class="container">
      <div class="header-new">
        <div>
          <h2>Order #{order.id}</h2>
          <p>Placed at {order.createdAt}</p>
        </div>

        <div class="steps-horizontal">
          {#each trackingSteps as step, i}
            <div
              class="step"
              class:done={trackingSteps.findIndex(
                (s) => s.status === order.status
              ) >= i}
            >
              <div class="icon">{step.icon}</div>
              <div class="label">{step.label}</div>
            </div>
            {#if i < trackingSteps.length - 1}
              <div class="line" />
            {/if}
          {/each}
        </div>

        <div
          class="badge-status"
          class:cancelled={order.status === "CANCELLED"}
        >
          {order.status}
        </div>

        <div class="card">
          {#if order.status === "DELIVERING"}
            <div class="warn-box">
              🚴 Đơn hàng đang được giao!<br />
              Dự kiến giao: <strong>{order.estimatedDelivery}</strong>
            </div>
          {/if}
          {#if order.status === "CANCELLED"}
            <div class="warn-box" style="background:#fee2e2; color:#991b1b">
              Đơn hàng đã bị hủy
            </div>
          {/if}
          {#if order.status === "PENDING"}
            <button class="cancel-btn" on:click={cancelOrder}
              >Hủy đơn hàng</button
            >
          {/if}
        </div>
      </div>

      <div class="grid">
        <!-- Left column -->
        <div class="left">
          <div class="card">
            <h3>Thông tin tài xế</h3>
            <div class="driver">
              <img src={order.shipper.avatar} alt="avatar" />
              <div>
                <div class="font-bold">{order.shipper.name}</div>
                <div class="text-sm">{order.shipper.vehicle}</div>
                <div class="text-yellow-500 text-sm">
                  ⭐ {order.shipper.rating}
                </div>
              </div>
            </div>
            <div class="driver-btns">
              <button class="call">📞 Gọi</button>
              <button class="msg">💬 Nhắn tin</button>
            </div>
          </div>

          <div class="card">
            <h3>Địa chỉ giao hàng</h3>
            <div class="address">
              📍 <div>
                <div class="font-bold">Nhà riêng</div>
                <div>{order.address.line}</div>
                <div>{order.address.city}</div>
                <div class="note">{order.address.note}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="right">
          <div class="card">
            <h3>Chi tiết đơn hàng</h3>
            {#each order.items as item}
              <div class="item">
                <img src={item.image} alt={item.name} />
                <div class="info">
                  <div class="name">{item.name}</div>
                  <div class="desc">{item.desc}</div>
                  <div class="price">{item.price.toLocaleString()}₫</div>
                </div>
                <div class="qty">x{item.qty}</div>
              </div>
            {/each}
          </div>

          <div class="card summary">
            <h3>Thanh toán</h3>
            <div>
              <span>Tạm tính</span><span>{subtotal.toLocaleString()}₫</span>
            </div>
            <div>
              <span>Phí giao hàng</span><span
                >{deliveryFee.toLocaleString()}₫</span
              >
            </div>
            <div><span>Thuế</span><span>{tax.toLocaleString()}₫</span></div>
            <div class="total">
              <span>Tổng cộng</span><span>{total.toLocaleString()}₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  .container {
    padding: 32px;
    max-width: 1200px;
    margin: auto;
    font-family: "Segoe UI", sans-serif;
    background: #f5f5f5;
  }

  .header-new {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 20px 24px;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .header-new h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }

  .header-new p {
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
  }

  .steps-horizontal {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    min-width: 300px;
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #9ca3af;
    font-size: 12px;
    text-align: center;
  }

  .step .icon {
    background-color: #e5e7eb;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  .step.done .icon {
    background-color: #10b981;
    color: white;
  }

  .step.done {
    color: #10b981;
    font-weight: bold;
  }

  .line {
    width: 30px;
    height: 2px;
    background-color: #d1d5db;
    margin: 0 6px;
  }

  .badge-status {
    background-color: #d1fae5;
    color: #065f46;
    font-weight: 600;
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 9999px;
    white-space: nowrap;
  }

  .badge-status.cancelled {
    background-color: #fee2e2;
    color: #b91c1c;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  }

  .warn-box {
    background: #fef3c7;
    color: #92400e;
    padding: 10px;
    margin-top: 16px;
    border-radius: 8px;
  }

  .cancel-btn {
    margin-top: 12px;
    background: #ef4444;
    color: white;
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }

  .driver {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 8px;
  }

  .driver img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  .driver-btns {
    margin-top: 10px;
    display: flex;
    gap: 8px;
  }

  .call,
  .msg {
    flex: 1;
    padding: 10px;
    font-weight: bold;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }

  .call {
    background: #3b82f6;
    color: white;
  }

  .msg {
    background: #e5e7eb;
    color: #111827;
  }

  .address {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .note {
    font-size: 13px;
    color: #6b7280;
    font-style: italic;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .item img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
  }

  .info {
    flex-grow: 1;
  }

  .name {
    font-weight: bold;
  }

  .desc {
    font-size: 14px;
    color: #6b7280;
  }

  .price {
    color: #ef4444;
    font-weight: 600;
  }

  .qty {
    font-size: 14px;
    color: #6b7280;
  }

  .summary div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 15px;
  }

  .summary .total {
    font-weight: bold;
    font-size: 16px;
    border-top: 1px solid #e5e7eb;
    padding-top: 10px;
    margin-top: 10px;
  }
</style>
