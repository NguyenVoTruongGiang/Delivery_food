<script>
  import { router } from "tinro";
  import { onMount } from "svelte";

  let userProfile = { name: "", address: "", city: "", postalCode: "" };
  let order = {
    id: null,
    items: [],
    subtotal: "0.00 đ",
    deliveryFee: "0.00 đ",
    total: "0.00 đ",
  };
  let loading = true;
  let cart = { id: null, cartItems: [] };

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
      userProfile = {
        name: data.name || "",
        address: data.address || "",
        city: data.city || "",
        postalCode: data.postalCode || "",
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      userProfile = {
        name: "Default",
        address: "123 Main St",
        city: "HCM",
        postalCode: "70000",
      };
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
        cart = data || { id: null, cartItems: [] };
        order.items = cart.cartItems || [];
        if (order.items.length > 0) {
          const subtotal = order.items.reduce((sum, item) => {
            const price = item.product?.price
              ? parseFloat(item.product.price) * 10000
              : 0;
            return sum + price * (item.quantity || 0);
          }, 0);
          order.subtotal = `${subtotal.toFixed(2)} đ`;
          const deliveryFee = 2000;
          order.deliveryFee = `${deliveryFee.toFixed(2)} đ`;
          const total = subtotal + deliveryFee;
          order.total = `${total.toFixed(2)} đ`;
        } else {
          order.subtotal = "0.00 đ";
          order.deliveryFee = "0.00 đ";
          order.total = "0.00 đ";
        }
      } catch (e) {
        console.error("Cart API returned non-JSON:", text);
        order.items = [];
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      order.items = [];
    }
  }

  async function createOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to proceed.");
      router.goto("/login");
      return;
    }

    const orderData = {
      cart_id: cart.id,
      items: order.items.map((item) => ({
        product_id: item.product?.id || item.product_id,
        quantity: item.quantity,
      })),
      delivery_address:
        `${userProfile.name}, ${userProfile.address}, ${userProfile.city}, ${userProfile.postalCode}`.trim(),
      payment_method: "VNPAY",
      total_price: parseFloat(order.total.replace(/[^\d.]/g, "")) * 10000,
    };

    try {
      const response = await fetch("http://localhost:8080/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create order: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Order created successfully:", data);
      alert("Order created successfully! Payment simulation completed.");

      // Xóa giỏ hàng sau khi thanh toán thành công
      await fetch("http://localhost:8080/cart/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart(); // Cập nhật giỏ hàng (sẽ rỗng)
      router.goto("/home");
    } catch (error) {
      console.error("Error creating order:", error);
      alert(
        `Failed to create order: ${error.message}. Please try again or contact support.`
      );
    }
  }

  onMount(async () => {
    await Promise.all([fetchUser(), fetchCart()]);
    loading = false;
  });

  function proceedToPayment() {
    if (loading) return;
    createOrder();
  }
</script>

<main>
  <div class="payment-page">
    <header>
      <button class="back-btn" on:click={() => history.back()}>⬅️</button>
      <h1>Payment Confirmation</h1>
    </header>
    {#if loading}
      <div class="loading">Loading...</div>
    {:else}
      <section class="order-summary">
        <h2>Order Summary</h2>
        {#if order.items.length > 0}
          {#each order.items as item}
            <div class="item">
              <div class="item-header">
                <span class="item-name"
                  >{item.product?.name || item.name || "Unknown Item"}</span
                >
                <span class="item-price"
                  >{item.product?.price
                    ? `$${(item.product.price * 10000).toFixed(2)} đ`
                    : item.price || "0.00 đ"}</span
                >
              </div>
              <p class="item-quantity">Quantity: {item.quantity || 0}</p>
              {#if Array.isArray(item.add_ons) && item.add_ons.length > 0}
                <p class="item-addons">
                  Add-ons: {item.addOns?.join(", ") ||
                    item.add_ons?.join(", ") ||
                    ""}
                </p>
              {/if}
            </div>
          {/each}
        {:else}
          <p>No items in order.</p>
        {/if}
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
      <section class="shipping-address">
        <h2>Shipping Address</h2>
        <p>{userProfile.name}</p>
        <p>{userProfile.address}</p>
        <p>{userProfile.city}, {userProfile.postalCode}</p>
      </section>
      <section class="payment-method">
        <h2>Payment Method</h2>
        <p>VNPAY (Simulation)</p>
      </section>
      <button class="confirm-btn" on:click={proceedToPayment}
        >Proceed to VNPay Payment (Simulation)</button
      >
    {/if}
  </div>
</main>

<style>
  .payment-page {
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
  .loading {
    text-align: center;
    padding: 20px;
    font-size: 18px;
    color: #666;
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
  @media (max-width: 640px) {
    h1 {
      font-size: 20px;
    }
    .order-summary,
    .shipping-address,
    .payment-method {
      padding: 15px;
    }
    .order-summary h2,
    .shipping-address h2,
    .payment-method h2 {
      font-size: 18px;
    }
    .item-name,
    .item-price {
      font-size: 14px;
    }
    .item-quantity,
    .item-addons {
      font-size: 12px;
    }
    .shipping-address p,
    .payment-method p {
      font-size: 14px;
    }
    .summary-item {
      font-size: 14px;
    }
    .summary-item.total {
      font-size: 16px;
    }
    .confirm-btn {
      padding: 12px;
      font-size: 14px;
    }
    .loading {
      font-size: 16px;
    }
  }
</style>
