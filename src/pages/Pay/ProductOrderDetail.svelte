<!-- src/pages/pay/ProductOrderDetail.svelte -->
<script>
    import { router } from "tinro";
  
    let order = {
      id: "ORD-001",
      items: [
        { name: "Cheese Burger", quantity: 2, price: "€5.00", addOns: ["Parmesan cheese (€2.50)", "Sauce (€1.50)"] },
        { name: "Sushi Platter", quantity: 1, price: "€8.00", addOns: [] },
      ],
      subtotal: "€18.00",
      deliveryFee: "€2.00",
      total: "€20.00",
    };
  
    function goToCheckout() {
      const params = new URLSearchParams({
        order: JSON.stringify(order),
      }).toString();
      router.goto(`/checkout?${params}`);
    }
  </script>
  
  <main>
    <div class="order-detail-page">
      <!-- Header -->
      <header>
        <button class="back-btn" on:click={() => history.back()}>⬅️</button>
        <h1>Order Details</h1>
      </header>
  
      <!-- Order Info -->
      <section class="order-info">
        <h2>Order #{order.id}</h2>
        {#each order.items as item}
          <div class="item">
            <div class="item-header">
              <span class="item-name">{item.name}</span>
              <span class="item-price">{item.price}</span>
            </div>
            <p class="item-quantity">Quantity: {item.quantity}</p>
            {#if item.addOns.length > 0}
              <p class="item-addons">Add-ons: {item.addOns.join(", ")}</p>
            {/if}
          </div>
        {/each}
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
  
      <!-- Proceed to Checkout -->
      <button class="proceed-btn" on:click={goToCheckout}>Proceed to Checkout</button>
    </div>
  </main>
  
  <style>
    .order-detail-page {
      background-color: #f5f5f5;
      min-height: 100vh;
      padding: 20px;
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
  
    .proceed-btn {
      background-color: #ff8c00;
      color: #fff;
      border: none;
      padding: 15px;
      width: 100%;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
  
    .proceed-btn:hover {
      background-color: #e67e22;
    }
  </style>