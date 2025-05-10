<!-- src/pages/product/[id].svelte -->
<script>
  import { onMount } from "svelte";

  let product = null;
  // Dữ liệu giả lập (thay thế bằng API nếu cần)
  const products = [
    {
      id: 1,
      name: "Crazy Tacko",
      description: "Deliceous tackos, appetizing snacks, fresh ingredients",
      price: "€3.00",
      originalPrice: "€4.00",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      name: "La Sala",
      description: "Fresh and tasty salads",
      price: "€2.00",
      originalPrice: "€3.00",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      name: "Cheese Burger",
      description: "Juicy beef patty with melted cheese",
      price: "€5.00",
      originalPrice: "€6.00",
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 4,
      name: "Sushi Platter",
      description: "Fresh sushi with assorted fish",
      price: "€8.00",
      originalPrice: "€10.00",
      image: "https://via.placeholder.com/300x200",
    },
  ];

  onMount(() => {
    const params = new URLSearchParams(window.location.pathname.split("/"));
    const productId = parseInt(params.get("id"), 10);
    product = products.find((p) => p.id === productId);
  });

  let addOns = [
    { name: "Parmesan cheese", price: "€2.50", selected: false },
    { name: "Sauce", price: "€1.50", selected: false },
    { name: "Package box cost", price: "€0.50", selected: false },
  ];

  let quantity = 1;
  let isFavorite = false;

  // Lấy ID từ URL và tìm sản phẩm tương ứng

  function toggleFavorite() {
    isFavorite = !isFavorite;
  }

  function toggleAddOn(index) {
    addOns[index].selected = !addOns[index].selected;
  }

  function increaseQuantity() {
    quantity += 1;
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      quantity -= 1;
    }
  }

  function addToOrder() {
    const selectedAddOns = addOns.filter((addOn) => addOn.selected);
    alert(
      `Added to order: ${product.name}, Quantity: ${quantity}, Add-ons: ${selectedAddOns.map((a) => a.name).join(", ")}`
    );
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
    <img src={product.image} alt={product.name} />
  </div>

  <!-- Product Info -->
  <div class="product-info">
    <h1>{product.name}</h1>
    <p class="description">{product.description}</p>
    <div class="price">
      <span class="current-price">{product.price}</span>
      <span class="original-price">{product.originalPrice}</span>
    </div>
  </div>

  <!-- Add More (Add-ons) -->
  <section class="add-ons">
    <h3>Add more</h3>
    {#each addOns as addOn, index}
      <div class="add-on-item">
        <label>
          <input
            type="checkbox"
            checked={addOn.selected}
            on:change={() => toggleAddOn(index)}
          />
          {addOn.name}
        </label>
        <span class="add-on-price">{addOn.price}</span>
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
    <button class="add-to-order-btn" on:click={addToOrder}>Add to order</button>
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

  .add-to-order-btn:hover {
    background-color: #e67e22;
  }
</style>
