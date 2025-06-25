<script>
  import { router } from "tinro";

  let order = {
    id: null,
    items: [],
    subtotal: "0.00 đ",
    deliveryFee: "0.00 đ",
    total: "0.00 đ",
  };
  let paymentMethod = "";
  let loading = true;

  // Lấy dữ liệu từ query params khi trang load
  function parseOrderFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderString = urlParams.get("order");
    const paymentMethodParam = urlParams.get("paymentMethod");
    if (orderString) {
      const parsedOrder = JSON.parse(decodeURIComponent(orderString));
      order = {
        id: parsedOrder.id || "1",
        items: parsedOrder.items || [],
        subtotal: parsedOrder.subtotal || "0.00 đ",
        deliveryFee: parsedOrder.deliveryFee || "0.00 đ",
        total: parsedOrder.total || "0.00 đ",
      };
    }
    paymentMethod = paymentMethodParam || ""; // Lấy paymentMethod từ query params
    loading = false; // Kết thúc loading khi dữ liệu được parse
  }

  // Quay lại checkout để chỉnh sửa
  function goToCheckout() {
    const params = new URLSearchParams({
      order: encodeURIComponent(JSON.stringify(order)),
      paymentMethod: paymentMethod, // Truyền paymentMethod khi quay lại
    }).toString();
    router.goto(`/checkout?${params}`);
  }

  // Tiến hành thanh toán (giả định chuyển sang trang thanh toán)
  function proceedToPayment() {
    if (!paymentMethod) {
      alert("Please select a payment method in Checkout!");
      return;
    }
    // Logic thanh toán (chưa triển khai, có thể redirect hoặc gọi API)
    router.goto("/pay"); // Quay về home sau khi thanh toán
  }

  // Load dữ liệu khi component mount
  import { onMount } from "svelte";
  onMount(() => {
    parseOrderFromUrl();
  });
</script>

<main>
  <div class="order-detail-page">
    <!-- Header -->
    <header>
      <button class="back-btn" on:click={() => history.back()}>⬅️</button>
      <h1>Order Details</h1>
    </header>

    <!-- Loading hoặc nội dung -->
    {#if loading}
      <div class="loading">Loading...</div>
    {:else}
      <!-- Order Info -->
      <section class="order-info">
        <h2>Order #{order.id}</h2>
        {#if order.items.length > 0}
          {#each order.items as item}
            <div class="item">
              <div class="item-header">
                <span class="item-name">{item.product?.name || item.name || "Unknown Item"}</span>
                <span class="item-price">{item.product?.price ? `$${(item.product.price * 10000)}` : item.price || "0.00 đ"}</span>
              </div>
              <p class="item-quantity">Quantity: {item.quantity || 0}</p>
              {#if Array.isArray(item.add_ons) && item.add_ons.length > 0}
                <p class="item-addons">Add-ons: {item.addOns?.join(", ") || item.add_ons?.join(", ") || ""}</p>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No items in order.</p>
        {/if}
      </section>

      <!-- Payment Method -->
      <section class="payment-method">
        <h3>Payment Method</h3>
        <p>{paymentMethod || "Not selected"}</p>
      </section>

      <!-- Summary -->
      <section class="summary">
        <h3>Summary</h3>
        <div class="summary-item">
          <span>Subtotal</span>
          <span>{order.subtotal}</span>
        </div>
        <div class="summary-item">
          <span>Delivery Fee</span>
          <span>{order.deliveryFee}</span>
        </div>
        <div class="summary-item total">
          <span>Total</span>
          <span>{order.total}</span>
        </div>
      </section>

      <!-- Buttons -->
      <div class="button-group">
        <button class="edit-btn" on:click={goToCheckout}>Chỉnh sửa (Edit)</button>
        <button class="proceed-btn" on:click={proceedToPayment}>Tiến hành thanh toán (Proceed to Checkout)</button>
      </div>
    {/if}
  </div>
</main>

<style>
  .order-detail-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .back-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    margin-right: 10px;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
  }

  .order-info {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .order-info h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .item {
    border-bottom: 1px solid #f5f5f5;
    padding: 10px 0;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-name {
    font-size: 16px;
    font-weight: bold;
  }

  .item-price {
    font-size: 16px;
    color: #ff4d4f;
  }

  .item-quantity,
  .item-addons {
    font-size: 14px;
    color: #888;
    margin-top: 5px;
  }

  .payment-method {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .payment-method h3 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .payment-method p {
    font-size: 16px;
    color: #333;
  }

  .summary {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .summary h3 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .summary-item.total {
    font-weight: bold;
    font-size: 18px;
    color: #ff4d4f;
  }

  .button-group {
    display: flex;
    gap: 10px;
  }

  .edit-btn {
    background-color: #6c757d;
    color: #fff;
    border: none;
    padding: 15px;
    width: 48%;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }

  .edit-btn:hover {
    background-color: #5a6268;
  }

  .proceed-btn {
    background-color: #ff8c00;
    color: #fff;
    border: none;
    padding: 15px;
    width: 48%;
    border-radius: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }

  .proceed-btn:hover {
    background-color: #e67e22;
  }

  .loading {
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #666;
  }

  @media (max-width: 640px) {
    h1 {
      font-size: 20px;
    }

    .order-info, .payment-method, .summary {
      padding: 15px;
    }

    .order-info h2, .payment-method h3, .summary h3 {
      font-size: 18px;
    }

    .item-name, .item-price {
      font-size: 14px;
    }

    .item-quantity, .item-addons {
      font-size: 12px;
    }

    .payment-method p {
      font-size: 14px;
    }

    .summary-item {
      font-size: 14px;
    }

    .summary-item.total {
      font-size: 16px;
    }

    .edit-btn, .proceed-btn {
      padding: 12px;
      font-size: 14px;
    }

    .loading {
      font-size: 16px;
    }
  }
</style>