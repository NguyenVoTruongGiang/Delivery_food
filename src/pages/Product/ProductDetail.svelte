<!-- src/pages/product/ProductDetail.svelte -->
<script>
  import { onMount } from "svelte";
  export let onGoHome;

  let product = null;
  let baseUrl = "http://localhost:8080";
  let isLoading = true;
  let error = null;

  async function fetchProduct(product_id) {
    try {
      const response = await fetch(`${baseUrl}/products/${product_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      const data = await response.json();
      product = data;
    } catch (error) {
      console.error("Error fetching product:", error);
      error = error.message;
      product = null;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    const pathParts = window.location.pathname.split("/");
    const productId = parseInt(pathParts[pathParts.length - 1], 10);
    if (isNaN(productId)) {
      console.error("Invalid product ID from URL:", window.location.pathname);
      error = "Invalid product ID";
      isLoading = false;
    } else {
      fetchProduct(productId);
    }
  });

  let add_ons = [
    { name: "Phô mai parmesan", price: "€2.50", selected: false },
    { name: "Nước sốt cà chua", price: "€1.50", selected: false },
    { name: "Nước sốt cay", price: "€1.50", selected: false },
    { name: "Nước sốt kem", price: "€2.50", selected: false },
  ];

  let quantity = 1;
  let isFavorite = false;
  let cartItem = null; // Define cartItem to avoid reference error

  function toggleFavorite() {
    isFavorite = !isFavorite;
  }

  function toggleAddOn(index) {
    add_ons[index].selected = !add_ons[index].selected;
  }

  function increaseQuantity() {
    quantity += 1;
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      quantity -= 1;
    }
  }

  const user_id = Number(localStorage.getItem("user_id"));
  console.log("User ID from localStorage:", user_id);

  async function addToCart() {
    const token = localStorage.getItem("token");
    const selectedAddOns = add_ons
      .filter((a) => a.selected)
      .map((a) => a.name)
      .join(", ");
    const response = await fetch(`http://localhost:8080/cart/add/${user_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: product.id, // snake_case
        quantity: quantity,
        add_ons: selectedAddOns, // snake_case
        user_id: user_id, // snake_case
      }),
    });
    if (!response.ok) throw new Error("Không thể thêm vào giỏ hàng");
    alert("Đã thêm vào giỏ hàng!");
    onGoHome();
  }
  async function updateCart() {
    const selectedAdd_ons = [];
    add_ons.forEach((add_ons) => {
      for (let i = 0; i < add_ons.count; i++) {
        selectedAdd_ons.push({ name: add_ons.name, price: add_ons.price });
      }
    });

    try {
      const response = await fetch(
        `${baseUrl}/cart/${user.id}/${cartItem.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity,
            add_ons: selectedAdd_ons,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      alert("Cart updated!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart.");
    }
  }

  function handleConfirm() {
    if (cartItem) {
      updateCart();
    } else {
      addToCart();
    }
  }
</script>

<div class="product-detail-page">
  <!-- Header -->
  <header>
    <button class="back-btn" on:click={() => history.back()}>⬅️</button>
    <button class="favorite-btn" on:click={toggleFavorite}>
      <span class={isFavorite ? "favorite-icon active" : "favorite-icon"}
        >❤️</span
      >
    </button>
  </header>

  <!-- Product Image -->
  <div class="product-image">
    {#if isLoading}
      <p>Loading product image...</p>
    {:else if error}
      <p>Error: {error}</p>
    {:else if product && product.image}
      <img src={product.image} alt={product.name} />
    {:else}
      <p>No image available</p>
    {/if}
  </div>

  <!-- Product Info -->
  <div class="product-info">
    {#if isLoading}
      <p>Loading product details...</p>
    {:else if error}
      <p>Error: {error}</p>
    {:else if product}
      <h1>{product.name}</h1>
      <p class="description">
        {product.description || "No description available"}
      </p>
      <div class="price">
        <span class="current-price">{product.price || "N/A"}</span>
        {#if product.originalPrice}
          <span class="original-price">{product.originalPrice}</span>
        {/if}
      </div>
    {:else}
      <p>Product not found</p>
    {/if}
  </div>

  <!-- Add More (Add-ons) -->
  <section class="add-ons">
    <h3>Add more</h3>
    {#each add_ons as add_on, index}
      <div class="add-on-item">
        <label>
          <input
            type="checkbox"
            checked={add_on.selected}
            on:change={() => toggleAddOn(index)}
          />
          {add_on.name}
        </label>
        <span class="add-on-price">{add_on.price}</span>
      </div>
    {/each}
  </section>

  <!-- Quantity and Add to Order -->
  <div class="order-section">
    <div class="quantity-selector">
      <button on:click={decreaseQuantity}>-</button>
      <span>{quantity}</span>
      <button on:click={increaseQuantity}>+</button>
    </div>
    <button class="add" on:click={handleConfirm}>
      {cartItem ? "Update" : "Add to Cart"}
    </button>
  </div>
</div>

<style>
  /* Reset and Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  .product-detail-page {
    background-color: #fff;
    min-height: 100vh;
    padding: 20px;
  }

  /* Header */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .back-btn,
  .favorite-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }

  .favorite-icon {
    color: #ccc;
  }

  .favorite-icon.active {
    color: #ff4d4f;
  }

  /* Product Image */
  .product-image {
    margin-bottom: 20px;
  }

  .product-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 15px;
  }

  /* Product Info */
  .product-info {
    margin-bottom: 20px;
  }

  .product-info h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .description {
    font-size: 14px;
    color: #888;
    margin-bottom: 10px;
  }

  .price {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .current-price {
    font-size: 20px;
    font-weight: bold;
    color: #ff4d4f;
  }

  .original-price {
    font-size: 16px;
    color: #888;
    text-decoration: line-through;
  }

  /* Add-ons Section */
  .add-ons {
    margin-bottom: 20px;
  }

  .add-ons h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .add-on-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
  }

  .add-on-item label {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
  }

  .add-on-item input[type="checkbox"] {
    margin-right: 10px;
    accent-color: #ff8c00;
  }

  .add-on-price {
    font-size: 14px;
    color: #ff4d4f;
  }

  /* Quantity and Add to Order */
  .order-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background-color: #fff;
    padding: 10px 0;
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #f5f5f5;
    padding: 5px 10px;
    border-radius: 20px;
  }

  .quantity-selector button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #333;
  }

  .quantity-selector span {
    font-size: 16px;
    font-weight: bold;
  }

  .add-to-order-btn {
    background-color: #ff8c00;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }

  .add-to-order-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .add-to-order-btn:hover:not(:disabled) {
    background-color: #e67e22;
  }
</style>
