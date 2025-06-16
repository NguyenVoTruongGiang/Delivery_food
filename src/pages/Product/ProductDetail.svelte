<script>
  import { onMount } from "svelte";
  export let onGoHome;
  export let productData;

  let product = null;
  let baseUrl = "http://localhost:8080";
  let isLoading = true;
  let error = null;
  let cartItemId = "";
  let quantity = 1;
  let isFavorite = false;

  let add_ons = [
    { name: "Phô mai parmesan", price: "€2.50", selected: false },
    { name: "Nước sốt cà chua", price: "€1.50", selected: false },
    { name: "Nước sốt cay", price: "€1.50", selected: false },
    { name: "Nước sốt kem", price: "€2.50", selected: false },
  ];

  async function fetchProduct(product_id) {
    try {
      console.log(`Fetching product with ID: ${product_id}`);
      const response = await fetch(`${baseUrl}/products/${product_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      product = await response.json();
      console.log("Fetched product:", product);
    } catch (err) {
      console.error("Error fetching product:", err);
      error = err.message;
      product = null;
    } finally {
      isLoading = false;
      console.log("Fetch complete. isLoading:", isLoading, "error:", error);
    }
  }

  async function fetchFavorite (product_id) {
    const token = localStorage.getItem("token");
    try {
      console.log(`Fetching favorite status for product ID: ${product_id}`);
      const response = await fetch(`${baseUrl}/favorites/${product_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch favorite status: ${response.statusText}`);
      }
      const data = await response.json();
      isFavorite = data.isFavorite;
      console.log("Fetched favorite status:", isFavorite);
    } catch (err) {
      console.error("Error fetching favorite status:", err);
    }
  }

  onMount(() => {
    console.log("onMount triggered. productData:", productData);
    if (productData) {
      console.log("Processing productData:", productData);
      product = {
        id: productData.id,
        name: productData.name,
        image: productData.image,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        available: productData.available,
        originalPrice: productData.originalPrice
      };
      isLoading = false;
      console.log("Initialized product:", product);

      if (productData.cartItemId) {
        cartItemId = productData.cartItemId;
        quantity = productData.quantity || 1;
        console.log("From cart. cartItemId:", cartItemId, "quantity:", quantity);
        if (productData.add_ons) {
          const selectedAddOns = productData.add_ons.split(", ").filter(Boolean);
          add_ons = add_ons.map((addon) => ({
            ...addon,
            selected: selectedAddOns.includes(addon.name),
          }));
          console.log("Processed add_ons:", add_ons);
        } else {
          console.log("No add_ons in productData");
        }
      } else {
        console.log("Not from cart. Using default quantity and add_ons");
      }
    } else {
      console.log("No productData. Falling back to URL-based product ID");
      const pathParts = window.location.pathname.split("/");
      const productId = parseInt(pathParts[pathParts.length - 1], 10);
      console.log("Parsed productId from URL:", productId);
      if (isNaN(productId)) {
        console.error("Invalid product ID from URL:", window.location.pathname);
        error = "Invalid product ID";
        isLoading = false;
        console.log("Invalid product ID. error:", error, "isLoading:", isLoading);
      } else {
        fetchProduct(productId);
      }
    }
  });

  function toggleFavorite() {
    isFavorite = !isFavorite;
    console.log("Toggled favorite. isFavorite:", isFavorite);
  }

  function toggleAddOn(index) {
    add_ons[index].selected = !add_ons[index].selected;
    console.log("Toggled add-on at index", index, "add_ons:", add_ons);
  }

  function increaseQuantity() {
    quantity += 1;
    console.log("Increased quantity:", quantity);
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      quantity -= 1;
      console.log("Decreased quantity:", quantity);
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
    console.log("Adding to cart. Payload:", {
      product_id: product.id,
      quantity,
      add_ons: selectedAddOns,
      user_id
    });
    try {
      const response = await fetch(`${baseUrl}/cart/add/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          add_ons: selectedAddOns,
          user_id,
        }),
      });
      if (!response.ok) throw new Error("Không thể thêm vào giỏ hàng");
      console.log("Add to cart successful");
      alert("Đã thêm vào giỏ hàng!");
      onGoHome();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart.");
    }
  }

  async function updateCart() {
    const token = localStorage.getItem("token");
    const selectedAddOns = add_ons
      .filter((a) => a.selected)
      .map((a) => a.name)
      .join(", ");
    console.log("Updating cart. cartItemId:", cartItemId, "Payload:", {
      quantity,
      add_ons: selectedAddOns
    });
    try {
      const response = await fetch(`${baseUrl}/cart/updateItem/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity,
          add_ons: selectedAddOns,
        }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      console.log("Update cart successful");
      alert("Cart updated!");
      onGoHome();
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart.");
    }
  }

  function handleConfirm() {
    console.log("Handle confirm. cartItemId:", cartItemId);
    if (cartItemId) {
      updateCart();
    } else {
      addToCart();
    }
  }
</script>

<div class="product-detail-page">
  <header>
    <button class="back-btn" on:click={() => onGoHome()}>⬅️</button>
    <button class="favorite-btn" on:click={toggleFavorite}>
      <span class={isFavorite ? "favorite-icon active" : "favorite-icon"}>❤️</span>
    </button>
  </header>

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

  <div class="product-info">
    {#if isLoading}
      <p>Loading product details...</p>
    {:else if error}
      <p>Error: {error}</p>
    {:else if product}
      <h1>{product.name}</h1>
      <p class="description">{product.description || "No description available"}</p>
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

  <div class="order-section">
    <div class="quantity-selector">
      <button on:click={decreaseQuantity}>-</button>
      <span>{quantity}</span>
      <button on:click={increaseQuantity}>+</button>
    </div>
    <button class="add" on:click={handleConfirm}>
      {cartItemId ? "Update" : "Add to Cart"}
    </button>
  </div>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
  }

  .product-detail-page {
    /* Gradient pastel xu hướng 2025 */
    background: linear-gradient(135deg, #fefce8 0%, #d1fae5 100%);
    min-height: 100vh;
    padding: 30px;
    position: relative;
    overflow-x: hidden;
  }

  .product-detail-page::before {
    /* Hiệu ứng grain nhẹ */
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2P8z8Dwn4GBgYGBgQEA5eMC8c1MdyYAAAAASUVORK5CYII=");
    opacity: 0.04;
    pointer-events: none;
    z-index: -1;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding: 0 10px;
  }

  .favorite-btn {
    background: rgba(210, 206, 206, 0.9);
    border: 1px solid #d1d5db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
    backdrop-filter: blur(6px);
  }

  .back-btn,
  .favorite-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: #ff4d4f;
  }

  
  .favorite-icon {
    /* Mặc định trắng */
    filter: brightness(0) invert(1); /* Biến emoji thành trắng */
    transition: filter 0.3s ease-in-out;
  }

  .favorite-icon.active {
    /* Đỏ khi yêu thích */
    filter: none; /* Giữ màu đỏ gốc của emoji */
  }

  .product-image {
    margin-bottom: 25px;
    display: flex;
    justify-content: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);
  }

  .product-image img {
    width: 100%;
    max-width: 400px;
    height: 250px;
    object-fit: cover;
    border-radius: 15px;
    transition: transform 0.4s ease-in-out;
  }

  .product-image img:hover {
    transform: scale(1.05);
  }

  .product-image p {
    font-size: 16px;
    color: #6b7280;
    text-align: center;
    padding: 20px;
  }

  .product-info {
    margin-bottom: 25px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);
  }

  .product-info h1 {
    font-size: 28px;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 10px;
    line-height: 1.3;
  }

  .description {
    font-size: 15px;
    color: #4b5563;
    margin-bottom: 15px;
    line-height: 1.7;
  }

  .price {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .current-price {
    font-size: 24px;
    font-weight: 700;
    color: #ff4d4f;
  }

  .original-price {
    font-size: 18px;
    color: #6b7280;
    text-decoration: line-through;
    opacity: 0.8;
  }

  .add-ons {
    margin-bottom: 25px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);
  }

  .add-ons h3 {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 15px;
  }

  .add-on-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
    transition: background 0.3s ease-in-out;
  }

  .add-on-item:hover {
    background: #f9fafb;
  }

  .add-on-item label {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #1f2937;
    cursor: pointer;
  }

  .add-on-item input[type="checkbox"] {
    margin-right: 10px;
    accent-color: #ff4d4f;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    cursor: pointer;
  }

  .add-on-price {
    font-size: 14px;
    font-weight: 600;
    color: #ff4d4f;
  }

  .order-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.95);
    padding: 15px 20px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(8px);
    z-index: 10;
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f3f4f6;
    padding: 8px 15px;
    border-radius: 30px;
    transition: background 0.3s ease-in-out;
  }

  .quantity-selector:hover {
    background: #e5e7eb;
  }

  .quantity-selector button {
    background: none;
    border: none;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease-in-out;
  }

  .quantity-selector button:hover {
    transform: scale(1.2);
  }

  .quantity-selector span {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    min-width: 20px;
    text-align: center;
  }

  .add {
    background: linear-gradient(135deg, #ff4d4f 0%, #ff8e53 100%);
    color: #ffffff;
    border: none;
    padding: 12px 30px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }

  .add::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.5s ease-in-out, height 0.5s ease-in-out;
  }

  .add:hover::before {
    width: 200px;
    height: 200px;
  }

  .add:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  /* Keyframes */
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.08); opacity: 0.85; }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .product-detail-page {
      padding: 15px;
    }

    header {
      padding: 0 5px;
    }

    .back-btn,
    .favorite-btn {
      width: 35px;
      height: 35px;
      font-size: 16px;
    }

    .product-image {
      padding: 15px;
      margin-bottom: 20px;
    }

    .product-image img {
      max-width: 100%;
      height: 180px;
    }

    .product-info {
      padding: 15px;
      margin-bottom: 20px;
    }

    .product-info h1 {
      font-size: 24px;
    }

    .description {
      font-size: 14px;
    }

    .current-price {
      font-size: 20px;
    }

    .original-price {
      font-size: 16px;
    }

    .add-ons {
      padding: 15px;
      margin-bottom: 20px;
    }

    .add-ons h3 {
      font-size: 18px;
    }

    .add-on-item {
      padding: 10px 0;
    }

    .add-on-item label {
      font-size: 14px;
    }

    .add-on-item input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }

    .add-on-price {
      font-size: 13px;
    }

    .order-section {
      padding: 10px 15px;
      bottom: 15px;
      left: 15px;
      right: 15px;
    }

    .quantity-selector {
      padding: 6px 12px;
      gap: 10px;
    }

    .quantity-selector button {
      font-size: 16px;
      width: 25px;
      height: 25px;
    }

    .quantity-selector span {
      font-size: 14px;
    }

    .add {
      font-size: 14px;
      padding: 10px 20px;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .product-detail-page {
      padding: 20px;
    }

    .product-image img {
      max-width: 60%;
      height: 220px;
    }

    .product-info h1 {
      font-size: 26px;
    }

    .description {
      font-size: 14px;
    }

    .add-ons h3 {
      font-size: 19px;
    }

    .order-section {
      position: static;
      margin-top: 20px;
      padding: 15px;
    }
  }

  @media (min-width: 1025px) {
    .order-section {
      position: static;
      max-width: 1200px;
      margin: 30px auto 0;
      padding: 20px;
    }
  }
</style>