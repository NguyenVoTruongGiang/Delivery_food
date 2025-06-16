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
    font-family: Arial, sans-serif;
  }

  .product-detail-page {
    background-color: #fff;
    min-height: 100vh;
    padding: 20px;
  }

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

  .product-image {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }

  .product-image img {
    width: 30%;
    height: 200px;
    object-fit: cover;
    border-radius: 15px;
  }

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
    padding: 8px 0;
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

  .order-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: #f5f5f5;
    padding: 5px 15px;
    border-radius: 20px;
  }

  .quantity-selector button {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }

  .quantity-selector span {
    font-size: 16px;
    font-weight: bold;
  }

  .add {
    background-color: #ff8c00;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }

  .add:hover {
    background-color: #e67e22;
  }

  @media (max-width: 640px) {
    .product-detail-page {
      padding: 15px;
    }

    .product-image img {
      width: 100%;
      height: 150px;
    }

    .product-info h1 {
      font-size: 20px;
    }

    .description {
      font-size: 12px;
    }

    .current-price {
      font-size: 18px;
    }

    .original-price {
      font-size: 14px;
    }

    .add-ons h3 {
      font-size: 16px;
    }

    .add-on-item label {
      font-size: 14px;
    }

    .add-on-price {
      font-size: 12px;
    }

    .order-section {
      padding: 8px;
    }

    .quantity-selector span {
      font-size: 14px;
    }

    .add {
      font-size: 14px;
      padding: 8px 16px;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .product-image img {
      width: 50%;
      height: 180px;
    }

    .product-info h1 {
      font-size: 22px;
    }

    .description {
      font-size: 13px;
    }

    .add-ons h3 {
      font-size: 17px;
    }
  }
</style>