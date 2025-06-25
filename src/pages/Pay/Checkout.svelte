<script>
  import { router } from "tinro";
  import { onMount } from "svelte";

  let user = { id: null, name: "", email: "", phone: "", address: "" };
  let paymentMethod = "";
  let cart = { items: [], subtotal: "0.00 đ", deliveryFee: "0.00 đ", total: "0.00 đ" };
  let loading = true;
  let error = null;

  async function fetchUser() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID not found. Please log in.");
      router.goto("/login");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          router.goto("/login");
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      user = {
        id: data.id,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      user = { id: null, name: "", email: "", phone: "", address: "" };
    }
  }

  async function fetchCart() {
    try {
      const response = await fetch("http://localhost:8080/cart/my_cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        cart.items = data.cartItems || [];

        // Tính toán subtotal, deliveryFee, total dựa trên cartItems
        if (cart.items.length > 0) {
          const subtotal = cart.items.reduce((sum, item) => {
            const price = item.product?.price ? parseFloat(item.product.price) * 10000 : 0; 
            return sum + (price * (item.quantity || 0));
          }, 0);
          cart.subtotal = `${subtotal} đ`;

          const deliveryFee = 2000; // Phí giao hàng cố định 2000
          cart.deliveryFee = `${deliveryFee} đ`;

          const total = subtotal + deliveryFee;
          cart.total = `${total} đ`;
        } else {
          cart.subtotal = "0.00 đ";
          cart.deliveryFee = "0.00 đ";
          cart.total = "0.00 đ";
        }
        console.log("Cart fetched:", cart);
      } catch (e) {
        console.error("Cart API returned non-JSON:", text);
        cart = { items: [], subtotal: "0.00 đ", deliveryFee: "0.00 đ", total: "0.00 đ" };
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      cart = { items: [], subtotal: "0.00 đ", deliveryFee: "0.00 đ", total: "0.00 đ" };
    }
  }

  onMount(async () => {
    loading = true;
    await Promise.all([fetchUser(), fetchCart()]);
    loading = false;
  });

  function goToOrderDetail() {
    if (!paymentMethod) {
      alert("Please select a payment method!");
      return;
    }
    if (!user.address) {
      alert("Please fill in your address in the Profile section.");
      return;
    }
    const params = new URLSearchParams({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      paymentMethod: paymentMethod,
      order: encodeURIComponent(JSON.stringify(cart)),
    }).toString();
    router.goto(`/productOrderDetail?${params}`);
  }

  function editAddress() {
    const params = new URLSearchParams({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    }).toString();
    router.goto(`/profile?${params}`);
  }
</script>

<main>
  <div class="checkout-page">
    {#if loading}
      <div class="loading">Loading...</div>
    {:else if error}
      <div class="error">{error}</div>
    {:else}
      <!-- Header -->
      <header>
        <button class="back-btn" on:click={() => history.back()}>⬅️</button>
        <h1>Checkout</h1>
      </header>

      <!-- User Information -->
      <section class="user-info">
        <h2>User Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address || "Not set"}</p>
        {#if !user.address}
          <p class="error">Please update your address in the Profile section.</p>
        {/if}
        <button class="edit-address-btn" on:click={editAddress}>Edit Profile</button>
      </section>

      <!-- Order Summary -->
      <section class="order-summary">
        <h2>Order Summary</h2>
        {#if cart.items.length > 0}
          {#each cart.items as item}
            <div class="item">
              <div class="item-header">
                <span class="item-name">{item.product?.name || item.name || "Unknown Item"}</span>
                <span class="item-price">{item.product?.price ? `${(item.product.price * 10000)} đ` : "0.00 đ"}</span>
              </div>
              <p class="item-quantity">Quantity: {item.quantity || 0}</p>
              {#if Array.isArray(item.add_ons) && item.add_ons.length > 0}
                <p class="item-addons">Add-ons: {item.add_ons.join(", ")}</p>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No items in cart.</p>
        {/if}
        <div class="summary-item">
          <span>Subtotal (Tổng giá sản phẩm)</span>
          <span>{cart.subtotal}</span>
        </div>
        <div class="summary-item">
          <span>Phí ship (Delivery Fee)</span>
          <span>{cart.deliveryFee}</span>
        </div>
        <div class="summary-item total">
          <span>Tổng (Total)</span>
          <span>{cart.total}</span>
        </div>
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
            value="credit-card"
            bind:group={paymentMethod}
          />
          <span>Credit Card</span>
          <span class="icon">💳</span>
        </div>
        <div
          class="method"
          on:click={() => (paymentMethod = "paypal")}
          class:selected={paymentMethod === "paypal"}
        >
          <input
            type="radio"
            name="payment"
            value="paypal"
            bind:group={paymentMethod}
          />
          <span>PayPal</span>
          <span class="icon">🌐</span>
        </div>
        <div
          class="method"
          on:click={() => (paymentMethod = "cash-on-delivery")}
          class:selected={paymentMethod === "cash-on-delivery"}
        >
          <input
            type="radio"
            name="payment"
            value="cash-on-delivery"
            bind:group={paymentMethod}
          />
          <span>Cash on Delivery</span>
          <span class="icon">💵</span>
        </div>
      </section>

      <!-- Proceed to Order Detail -->
      <button class="proceed-btn" on:click={goToOrderDetail}>Proceed to Order Detail</button>
    {/if}
  </div>
</main>

<style>
  .checkout-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .loading {
    text-align: center;
    padding: 20px;
    color: #666;
  }

  .error {
    text-align: center;
    padding: 20px;
    color: #dc3545;
  }

  header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .back-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    margin-right: 12px;
    transition: color 0.2s;
  }

  .back-btn:hover {
    color: #007bff;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
  }

  .user-info, .order-summary, .payment-method {
    background-color: #fff;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .user-info h2, .order-summary h2, .payment-method h2 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }

  .user-info p {
    font-size: 16px;
    color: #333;
    margin: 6px 0;
  }

  .error {
    color: #dc3545;
    font-size: 14px;
    font-style: italic;
    margin-top: 8px;
  }

  .edit-address-btn {
    background-color: #ff8c00;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    margin-top: 12px;
    transition: background-color 0.2s;
  }

  .edit-address-btn:hover {
    background-color: #e67e22;
  }

  .order-summary .item {
    border-bottom: 1px solid #eee;
    padding: 12px 0;
  }

  .order-summary .item:last-child {
    border-bottom: none;
  }

  .order-summary .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-summary .item-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .order-summary .item-price {
    font-size: 16px;
    font-weight: 500;
    color: #ff4d4f;
  }

  .order-summary .item-quantity,
  .order-summary .item-addons {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }

  .order-summary .summary-item {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 16px;
    color: #333;
  }

  .order-summary .summary-item.total {
    font-weight: 700;
    font-size: 18px;
    color: #ff4d4f;
  }

  .payment-method .method {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .payment-method .method:hover {
    border-color: #007bff;
    background-color: #f8f9fa;
  }

  .payment-method .method.selected {
    border-color: #007bff;
    background-color: #e7f0ff;
  }

  .payment-method .method input[type="radio"] {
    margin-right: 12px;
    accent-color: #007bff;
  }

  .payment-method .method span {
    font-size: 16px;
    color: #333;
    flex: 1;
  }

  .payment-method .method .icon {
    font-size: 20px;
  }

  .proceed-btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 16px;
    width: 100%;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .proceed-btn:hover {
    background-color: #0056b3;
  }

  @media (max-width: 640px) {
    .checkout-page {
      padding: 16px;
    }

    h1 {
      font-size: 24px;
    }

    .user-info, .order-summary, .payment-method {
      padding: 16px;
      margin-bottom: 16px;
    }

    .user-info h2, .order-summary h2, .payment-method h2 {
      font-size: 20px;
    }

    .user-info p {
      font-size: 14px;
    }

    .order-summary .item-name,
    .order-summary .item-price {
      font-size: 14px;
    }

    .order-summary .summary-item {
      font-size: 14px;
    }

    .order-summary .summary-item.total {
      font-size: 16px;
    }

    .edit-address-btn {
      padding: 8px 16px;
      font-size: 13px;
    }

    .payment-method .method {
      padding: 12px;
    }

    .payment-method .method span {
      font-size: 14px;
    }

    .proceed-btn {
      padding: 12px;
      font-size: 14px;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .checkout-page {
      padding: 20px;
    }

    h1 {
      font-size: 26px;
    }

    .user-info, .order-summary, .payment-method {
      padding: 20px;
    }

    .user-info h2, .order-summary h2, .payment-method h2 {
      font-size: 21px;
    }

    .user-info p {
      font-size: 15px;
    }

    .order-summary .item-name,
    .order-summary .item-price {
      font-size: 15px;
    }

    .order-summary .summary-item {
      font-size: 15px;
    }

    .order-summary .summary-item.total {
      font-size: 17px;
    }
  }
</style>