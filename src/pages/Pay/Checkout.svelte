<!-- src/pages/pay/Checkout.svelte -->
<script>
  import { router } from "tinro";
  import { onMount } from "svelte";

  let userProfile = {
    firstName: "Kathy",
    lastName: "Berry",
    address: "",
    city: "",
    postalCode: "",
  };
  let profiles = [
    {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      address: "456 Oak Ave",
      city: "Los Angeles",
      postalCode: "90001",
    },
  ];
  let selectedProfileIndex = 0; // Mặc định chọn profile đầu tiên
  let paymentMethod = "";
  let order = {
    id: "ORD-001",
    items: [
      {
        name: "Cheese Burger",
        quantity: 2,
        price: "€5.00",
        addOns: ["Parmesan cheese (€2.50)", "Sauce (€1.50)"],
      },
      { name: "Sushi Platter", quantity: 1, price: "€8.00", addOns: [] },
    ],
    subtotal: "€18.00",
    deliveryFee: "€2.00",
    total: "€20.00",
  };

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    // Lấy dữ liệu profile từ query params
    userProfile.firstName = params.get("firstName") || userProfile.firstName;
    userProfile.lastName = params.get("lastName") || userProfile.lastName;
    userProfile.address = params.get("address") || userProfile.address;
    userProfile.city = params.get("city") || userProfile.city;
    userProfile.postalCode = params.get("postalCode") || userProfile.postalCode;
    // Lấy dữ liệu đơn hàng từ query params
    const orderParam = params.get("order");
    if (orderParam) {
      order = JSON.parse(orderParam);
    }
    // Nếu có profile từ params, tìm và chọn nó trong danh sách
    const defaultProfile = profiles.find(
      (p) =>
        p.firstName === userProfile.firstName &&
        p.lastName === userProfile.lastName
    );
    selectedProfileIndex =
      profiles.indexOf(defaultProfile) !== -1
        ? profiles.indexOf(defaultProfile)
        : 0;
    userProfile = { ...profiles[selectedProfileIndex] };
  });

  function changeProfile(index) {
    selectedProfileIndex = index;
    userProfile = { ...profiles[selectedProfileIndex] };
  }

  function goToPayment() {
    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }
    if (!userProfile.address || !userProfile.city || !userProfile.postalCode) {
      alert("Please fill in your address in the Profile section.");
      return;
    }
    const params = new URLSearchParams({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      address: userProfile.address,
      city: userProfile.city,
      postalCode: userProfile.postalCode,
      paymentMethod: paymentMethod,
      order: JSON.stringify(order),
    }).toString();
    router.goto(`/pay?${params}`);
  }

  function editAddress() {
    const params = new URLSearchParams({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      address: userProfile.address,
      city: userProfile.city,
      postalCode: userProfile.postalCode,
    }).toString();
    router.goto(`/profile?${params}`);
  }
</script>

<main>
  <div class="checkout-page">
    <!-- Header -->
    <header>
      <button class="back-btn" on:click={() => history.back()}>⬅️</button>
      <h1>Checkout</h1>
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
      {#if !userProfile.address || !userProfile.city || !userProfile.postalCode}
        <p class="error">Please fill in your address in the Profile section.</p>
      {/if}
      <div class="profile-select">
        <label for="profile">Select Shipping Address:</label>
        <select
          id="profile"
          bind:value={selectedProfileIndex}
          on:change={() => changeProfile(selectedProfileIndex)}
        >
          {#each profiles as profile, index}
            <option value={index}>
              {profile.firstName}
              {profile.lastName} - {profile.address}, {profile.city}, {profile.postalCode}
            </option>
          {/each}
        </select>
      </div>
      <button class="edit-address-btn" on:click={editAddress}
        >Edit Address</button
      >
    </section>

    <!-- Payment Method -->
    <section class="payment-method">
      <h2>Payment Method</h2>
      <div
        class="method"
        on:click={() => (paymentMethod = "credit-card")}
        class:selected={paymentMethod === "credit-card"}
      >
        <input
          type="radio"
          name="payment"
          checked={paymentMethod === "credit-card"}
        />
        <span>Credit Card</span>
        💳
      </div>
      <div
        class="method"
        on:click={() => (paymentMethod = "paypal")}
        class:selected={paymentMethod === "paypal"}
      >
        <input
          type="radio"
          name="payment"
          checked={paymentMethod === "paypal"}
        />
        <span>PayPal</span>
        🌐
      </div>
      <div
        class="method"
        on:click={() => (paymentMethod = "cash-on-delivery")}
        class:selected={paymentMethod === "cash-on-delivery"}
      >
        <input
          type="radio"
          name="payment"
          checked={paymentMethod === "cash-on-delivery"}
        />
        <span>Cash on Delivery</span>
        💵
      </div>
    </section>

    <!-- Proceed to Payment -->
    <button class="proceed-btn" on:click={goToPayment}
      >Proceed to Payment</button
    >
  </div>
</main>

<style>
  .checkout-page {
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
    margin-bottom: 15px;
  }

  .shipping-address p {
    font-size: 16px;
    margin: 5px 0;
  }

  .error {
    color: #dc3545;
    font-size: 14px;
    font-style: italic;
  }

  .profile-select {
    margin-top: 10px;
  }

  .profile-select label {
    font-size: 14px;
    margin-bottom: 5px;
    display: block;
  }

  .profile-select select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }

  .edit-address-btn {
    background-color: #ff8c00;
    color: #fff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }

  .edit-address-btn:hover {
    background-color: #e67e22;
  }

  .payment-method .method {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .payment-method .method.selected {
    border-color: #007bff;
    background-color: #e7f0ff;
  }

  .payment-method input[type="radio"] {
    margin-right: 10px;
  }

  .proceed-btn {
    background-color: #007bff;
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
    background-color: #0056b3;
  }
</style>
