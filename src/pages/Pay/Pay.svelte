<!-- src/pages/Pay/Pay.svelte -->
<script>
    import { router } from "tinro";
    import { onMount } from "svelte";
  
    let userProfile = { firstName: "Kathy", lastName: "Berry", address: "", city: "", postalCode: "" };
    let paymentMethod = "";
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
    let cardNumber = "";
    let expiryDate = "";
    let cvv = "";
    let paypalEmail = "";
  
    onMount(() => {
      const params = new URLSearchParams(window.location.search);
      userProfile.firstName = params.get("firstName") || userProfile.firstName;
      userProfile.lastName = params.get("lastName") || userProfile.lastName;
      userProfile.address = params.get("address") || userProfile.address;
      userProfile.city = params.get("city") || userProfile.city;
      userProfile.postalCode = params.get("postalCode") || userProfile.postalCode;
      paymentMethod = params.get("paymentMethod") || paymentMethod;
      const orderParam = params.get("order");
      if (orderParam) {
        order = JSON.parse(orderParam);
      }
    });
  
    function validateCardDetails() {
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        alert("Card Number must be 16 digits!");
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        alert("Expiry Date must be in MM/YY format (e.g., 12/25)!");
        return false;
      }
      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be 3 digits!");
        return false;
      }
      return true;
    }
  
    function validatePaypalEmail() {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(paypalEmail)) {
        alert("Please enter a valid PayPal email address!");
        return false;
      }
      return true;
    }
  
    function confirmPayment() {
      if (paymentMethod === "credit-card") {
        if (!cardNumber || !expiryDate || !cvv) {
          alert("Please fill in all card details!");
          return;
        }
        if (!validateCardDetails()) {
          return;
        }
      } else if (paymentMethod === "paypal") {
        if (!paypalEmail) {
          alert("Please enter your PayPal email address!");
          return;
        }
        if (!validatePaypalEmail()) {
          return;
        }
      }
      alert(`Payment confirmed with ${paymentMethod}! Your order has been placed successfully.`);
      router.goto("/home");
    }
  
    // Format card number input (thêm khoảng cách sau mỗi 4 chữ số)
    function formatCardNumber(value) {
      const cleaned = value.replace(/\D/g, ""); // Chỉ giữ số
      const match = cleaned.match(/.{1,4}/g); // Chia thành nhóm 4 chữ số
      cardNumber = match ? match.join(" ") : cleaned; // Thêm khoảng cách
    }
  </script>
  
  <main>
    <div class="payment-page">
      <!-- Header -->
      <header>
        <button class="back-btn" on:click={() => history.back()}>⬅️</button>
        <h1>Payment Confirmation</h1>
      </header>
  
      <!-- Order Summary -->
      <section class="order-summary">
        <h2>Order Summary</h2>
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
  
      <!-- Shipping Address -->
      <section class="shipping-address">
        <h2>Shipping Address</h2>
        <p>{userProfile.firstName} {userProfile.lastName}</p>
        <p>{userProfile.address}</p>
        <p>{userProfile.city}, {userProfile.postalCode}</p>
      </section>
  
      <!-- Payment Method -->
      <section class="payment-method">
        <h2>Payment Method</h2>
        <p>
          {paymentMethod === "credit-card"
            ? "Credit Card"
            : paymentMethod === "paypal"
              ? "PayPal"
              : paymentMethod === "cash-on-delivery"
                ? "Cash on Delivery"
                : "Not selected"}
        </p>
        {#if paymentMethod === "credit-card"}
          <div class="form-group">
            <label for="card-number">Card Number</label>
            <input
              type="text"
              id="card-number"
              bind:value={cardNumber}
              on:input={(e) => formatCardNumber(e.target.value)}
              placeholder="**** **** **** ****"
              maxlength="19"
            />
          </div>
          <div class="form-group">
            <label for="expiry-date">Expiry Date</label>
            <input
              type="text"
              id="expiry-date"
              bind:value={expiryDate}
              placeholder="MM/YY"
              maxlength="5"
            />
          </div>
          <div class="form-group">
            <label for="cvv">CVV</label>
            <input
              type="password"
              id="cvv"
              bind:value={cvv}
              placeholder="***"
              maxlength="3"
            />
          </div>
        {/if}
        {#if paymentMethod === "paypal"}
          <div class="form-group">
            <label for="paypal-email">PayPal Email</label>
            <input type="email" id="paypal-email" bind:value={paypalEmail} placeholder="example@paypal.com" />
          </div>
        {/if}
        {#if paymentMethod === "cash-on-delivery"}
          <p class="info">You will pay upon delivery.</p>
        {/if}
      </section>
  
      <!-- Confirm Payment -->
      <button class="confirm-btn" on:click={confirmPayment}>Confirm Payment</button>
    </div>
  </main>
  
  <style>
    .payment-page {
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
  
    .order-summary {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
  
    .order-summary h2 {
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
  
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 16px;
    }
  
    .summary-item.total {
      font-weight: bold;
      font-size: 18px;
      color: #ff4d4f;
    }
  
    .shipping-address,
    .payment-method {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
  
    .shipping-address h2,
    .payment-method h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
  
    .shipping-address p,
    .payment-method p {
      font-size: 16px;
      color: #333;
      margin: 5px 0;
    }
  
    .info {
      font-size: 14px;
      color: #888;
      margin-top: 10px;
    }
  
    .form-group {
      margin-bottom: 15px;
    }
  
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
      color: #333;
    }
  
    .form-group input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 16px;
      color: #333;
      background-color: #f9f9f9;
    }
  
    .form-group input::placeholder {
      color: #aaa;
      font-size: 14px;
    }
  
    .form-group input:focus {
      border-color: #007bff;
      outline: none;
      background-color: #fff;
    }
  
    .confirm-btn {
      background-color: #28a745;
      color: #fff;
      border: none;
      padding: 15px;
      width: 100%;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
  
    .confirm-btn:hover {
      background-color: #218838;
    }
  </style>