<script>
  export let onLogout;
  export let onProductDetail;
  export let onPayment;
  import { onMount, onDestroy } from "svelte";
  import SlideBarHome from "./SlideBarHome.svelte";
  import Category from "../Product/Category.svelte";
  import Chatbox from "./Chatbox.svelte";

  let nameRes = "Delivery Food";
  let user = JSON.parse(localStorage.getItem("user"));
  console.log(user?.name);
  let profile = localStorage.getItem("user");
  console.log("Profile:", profile);

  if (!user) {
    window.location.href = "/login";
  }

  let banners = [
    {
      text: "Get your 30% daily discount now!",
      image: "/assets/food_img/food_img/burgerthit.jpg",
      alt: "Burger",
    },
    {
      text: "Special Offer: Free Delivery Today!",
      image: "/assets/food_img/food_img/pizzaNam.jpg",
      alt: "Pizza",
    },
    {
      text: "Try Our New Menu Items!",
      image: "/assets/food_img/food_img/sushi.jpg",
      alt: "Sushi",
    },
  ];

  let currentTime = new Date().toLocaleTimeString();
  let products = [];
  let carts = [];
  let cart_Id = user?.cart_id || 0;
  let searchTerm = "";
  let searchResults = [];

  $: totalCartPrice = carts.reduce((sum, item) => {
    let price = 0;
    if (item.product && item.product.price) {
      price = parseInt(item.product.price + "");
    } else {
      const product = products.find(
        (p) => p.id === (item.product_id || item.productId)
      );
      price = product ? parseInt(product.price + "") : 0;
    }
    return sum + price * item.quantity * 10000;
  }, 0);

  let currentBannerIndex = 0;
  let intervalId;
  let filteredProducts = [];
  let categories = [];
  let selectedCategory = "";
  let isMenuOpen = false;

  const baseUrl = "http://localhost:8080";

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  async function fetchCategories() {
    try {
      const response = await fetch(`${baseUrl}/products/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      categories = await response.json();
      console.log("Categories fetched:", categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      categories = [];
    }
  }

  async function fetchProduct() {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      products = data;
      filteredProducts = products;
      console.log("Products fetched:", products);
    } catch (error) {
      console.error("Error fetching popular items:", error);
    }
  }

  async function performSearch(term) {
    if (!term) {
      searchResults = [];
      selectedCategory = "";
      filteredProducts = products;
      return;
    }
    try {
      const response = await fetch(
        `${baseUrl}/products/search?keyword=${encodeURIComponent(term)}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      searchResults = await response.json();
      selectedCategory = "";
      filteredProducts = products;
    } catch (error) {
      console.error("Error searching products:", error);
      searchResults = [];
    }
  }

  function handleInputSearch() {
    performSearch(searchTerm);
  }

  function handleKeywordSearch(keyword) {
    searchTerm = keyword;
    performSearch(keyword);
  }

  function filterByCategory(category) {
    selectedCategory = category;
    searchTerm = "";
    searchResults = [];
    if (category === "") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }
  }

  async function fetchCart() {
    try {
      const response = await fetch(`${baseUrl}/cart/my_cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        carts = await Promise.all(
          (data.cartItems || []).map(async (item) => {
            if (!item.product && item.product_id) {
              const productResponse = await fetch(
                `${baseUrl}/products/${item.product_id}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );
              item.product = await productResponse.json();
            }
            return item;
          })
        );
        cart_Id = data.id;
        console.log("Cart fetched:", carts);
      } catch (e) {
        console.error("Cart API returned non-JSON:", text);
        carts = [];
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      carts = [];
    }
  }

  async function handlePayment() {
    try {
      onPayment();
      console.log("Navigated to payment page");
    } catch (error) {
      console.error("Error handling payment:", error);
      alert("Failed to process payment.");
    }
  }

  async function updateCartItem(cartItemId, newQuantity) {
    try {
      const response = await fetch(`${baseUrl}/cart/updateItem/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      await fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart.");
    }
  }

  async function deleteCartItem(cartItemId) {
    try {
      const response = await fetch(`${baseUrl}/cart/deleteItem/${cartItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete item from cart");
      await fetchCart();
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      alert("Failed to delete item from cart.");
    }
  }

  function increaseQuantity(itemId) {
    const item = carts.find((item) => item.id === itemId);
    if (item) {
      updateCartItem(itemId, item.quantity + 1);
    }
  }

  function decreaseQuantity(itemId) {
    const item = carts.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      updateCartItem(itemId, item.quantity - 1);
    }
  }

  function goToProductDetailFromCart(cartItem) {
    const productData = {
      ...cartItem.product,
      cartItemId: cartItem.id,
      quantity: cartItem.quantity,
      add_ons: cartItem.add_ons,
    };
    console.log(
      "Navigating to product detail from cart with data:",
      productData
    );
    onProductDetail(productData);
  }

  function goToBanner(index) {
    currentBannerIndex = index;
  }

  function goToProductDetail(product) {
    onProductDetail(product);
  }

  let showAllProducts = false;
  let productPage = 0;
  const productsPerPage = 4;

  $: maxProductPage = Math.ceil(filteredProducts.length / productsPerPage) - 1;
  $: displayedProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(
        productPage * productsPerPage,
        (productPage + 1) * productsPerPage
      );

  function handleSeeAll() {
    showAllProducts = !showAllProducts;
    if (!showAllProducts) productPage = 0;
  }

  function setProductPage(page) {
    productPage = page;
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.clear();
    onLogout();
  }

  onMount(async () => {
    await Promise.all([fetchProduct(), fetchCart(), fetchCategories()]);
    intervalId = setInterval(() => {
      currentBannerIndex = (currentBannerIndex + 1) % banners.length;
    }, 1500);

    let localTime = setInterval(() => {
      currentTime = new Date().toLocaleTimeString();
    }, 1000);
    return () => clearInterval(localTime);
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<main>
  <div class="home-page">
    <!-- Header -->
    <header>
      <div class="logo">
        <div class="time">{currentTime}</div>
        <br />
        <a href="/" class="brand">{nameRes}</a>
      </div>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search"
          bind:value={searchTerm}
          on:input={handleInputSearch}
        />
      </div>
      <button class="menu-toggle" on:click={toggleMenu}>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
      <nav class="nav-links" class:open={isMenuOpen}>
        <a href="/home" on:click={toggleMenu}>Home</a>
        <a href="/about" on:click={toggleMenu}>About</a>
        <a href="/order" on:click={toggleMenu}>Orders</a>
      </nav>
      <div class="user-info">
        <SlideBarHome />
        <a href="/profile" class="user-name">{user?.name}</a>
        <button class="logout-btn" on:click={handleLogout}>Logout</button>
        <div class="user-cart">
          <button class="icon-cart" on:click={fetchCart}>🛒</button>
          <div class="show-cart">
            {#if carts.length > 0}
              {#each carts as item}
                <div class="cart-item">
                  <div
                    on:click={() => goToProductDetailFromCart(item)}
                    on:keydown={(e) =>
                      e.key === "Enter" && goToProductDetailFromCart(item)}
                    role="button"
                    tabindex="0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      class="cart-item-image"
                    />
                  </div>
                  <div class="cart-item-details">
                    <p class="cart-item-name">{item.product.name}</p>
                    {#if item.add_ons}
                      <p class="cart-item-addons">Add-ons: {item.add_ons}</p>
                    {/if}
                    <div class="cart-item-quantity">
                      <button on:click={() => decreaseQuantity(item.id)}
                        >-</button
                      >
                      <span>{item.quantity}</span>
                      <button on:click={() => increaseQuantity(item.id)}
                        >+</button
                      >
                    </div>
                    <p class="cart-item-price">
                      {item.product.price * item.quantity * 10000} đ
                    </p>
                    <button
                      class="delete-btn"
                      on:click={() => deleteCartItem(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              {/each}
              <div class="cart-total">
                <p>Tổng: {totalCartPrice} đ</p>
                <button class="payment" on:click={handlePayment}
                  >Thanh toán</button
                >
              </div>
            {:else}
              <p>Cart is empty</p>
            {/if}
          </div>
        </div>
      </div>
    </header>

    <Chatbox />

    <!-- Categories -->
    <!-- <Category
      {categories}
      {selectedCategory}
      on:categorySelect={filterByCategory}
    /> -->

    <!-- Search Results -->
    {#if searchResults.length > 0}
      <section class="search-results">
        <h3>Search Results</h3>
        {#each searchResults as result}
          <div
            class="result-item"
            on:click={() => goToProductDetail(result)}
            on:keydown={(e) => e.key === "Enter" && goToProductDetail(result)}
            role="button"
            tabindex="0"
          >
            <img src={result.image} alt={result.name} />
            <div class="result-info">
              <h4>{result.name}</h4>
              <p>{result.price * 10000} đ</p>
            </div>
          </div>
        {/each}
      </section>
    {/if}

    <!-- No Results -->
    {#if searchTerm && searchResults.length === 0}
      <section class="no-results">
        <p>No results found for "{searchTerm}".</p>
      </section>
    {/if}

    <!-- Banner Carousel -->
    {#if !searchResults.length && !searchTerm}
      <div class="banner-carousel">
        <div
          class="banner-wrapper"
          style="transform: translateX(-{currentBannerIndex * 100}%);"
        >
          {#each banners as banner}
            <div class="banner">
              <div class="banner-text">
                <h2>{banner.text}</h2>
                <button>Order now</button>
              </div>
              <img src={banner.image} alt={banner.alt} class="banner-image" />
            </div>
          {/each}
        </div>
      </div>

      <!-- Dots -->
      <div class="dots">
        {#each banners as _, index}
          <span
            class={currentBannerIndex === index ? "dot active" : "dot"}
            on:click={() => goToBanner(index)}
            on:keydown={(e) => e.key === "Enter" && goToBanner(index)}
            role="button"
            tabindex="0"
          ></span>
        {/each}
      </div>
    {/if}

    <!-- Fastest Delivery Section -->
    {#if !searchResults.length && !searchTerm}
      <section class="fastest-delivery">
        <div class="section-header">
          <h3>Fastest delivery 🔥</h3>
          <button class="see-all" on:click={handleSeeAll}>
            {showAllProducts ? "Thu gọn lại" : "See all"}
          </button>
        </div>
        <div class="product-list">
          {#each displayedProducts as product}
            <div
              class="product-card"
              on:click={() => goToProductDetail(product)}
              on:keydown={(e) =>
                e.key === "Enter" && goToProductDetail(product)}
              role="button"
              tabindex="0"
            >
              <img
                style="width: 80px; height: 80px;"
                src={product.image}
                alt={product.name}
              />
              <div class="product-info">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <div class="details">
                  <span class="price">{product.price * 10000} đ</span>
                  <span class="category">{product.category}</span>
                  <span class="available"
                    >{product.available ? "Available" : "Out of stock"}</span
                  >
                </div>
              </div>
            </div>
          {/each}
        </div>
        {#if !showAllProducts}
          <div class="pagination">
            {#each Array(maxProductPage + 1) as _, i}
              <button
                class:active={i === productPage}
                on:click={() => setProductPage(i)}
              >
                {i + 1}
              </button>
            {/each}
          </div>
        {/if}
      </section>

      <!-- Popular Items Section -->
      <section class="popular-items">
        <div class="section-header">
          <h3>Popular items 🥐</h3>
          <button class="see-all">See all</button>
        </div>
        <div class="item-list">
          {#each filteredProducts as product}
            <div
              class="item-card"
              on:click={() => goToProductDetail(product)}
              on:keydown={(e) =>
                e.key === "Enter" && goToProductDetail(product)}
              role="button"
              tabindex="0"
            >
              <img src={product.image} alt={product.name} />
              <div class="item-info">
                <h4>{product.name}</h4>
                <p>{product.price * 10000} đ</p>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Footer -->
    <footer>
      <div class="footer-container">
        <div class="footer-section">
          <h4>About Us</h4>
          <p>
            Delivery Food is your go-to platform for fast and delicious meals
            delivered to your door.
          </p>
          <a href="/about">Learn More</a>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: support@deliveryfood.com</p>
          <p>Phone: +84 123 456 789</p>
          <a href="/contact">Get in Touch</a>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/orders">Orders</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="https://facebook.com" target="_blank">Facebook</a>
            <a href="https://twitter.com" target="_blank">Twitter</a>
            <a href="https://instagram.com" target="_blank">Instagram</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Delivery Food. All rights reserved.</p>
      </div>
    </footer>
  </div>
</main>

<style>
  * {
    text-decoration: none;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  .home-page {
    background-color: #f5f5f5;
    min-height: 100vh;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 30px;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .logo .brand {
    font-size: 24px;
    font-weight: bold;
    color: #ff4d4f;
  }

  .search-bar {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 8px 12px;
    border-radius: 25px;
    flex: 1;
    max-width: 400px;
    margin: 0 20px;
  }

  .search-bar .search-icon {
    font-size: 18px;
    color: #888;
    margin-right: 8px;
  }

  .search-bar input {
    flex: 1;
    border: none;
    background: none;
    font-size: 14px;
    outline: none;
  }

  .nav-links {
    display: flex;
    gap: 20px;
  }

  .nav-links a {
    color: #333;
    font-size: 16px;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  .nav-links a:hover {
    color: #ff4d4f;
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 20px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .bar {
    width: 100%;
    height: 3px;
    background-color: #333;
    border-radius: 2px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .user-name {
    margin-left: 10px;
    color: #333;
    font-size: 16px;
    font-weight: 500;
  }

  .logout-btn {
    background: #ff4d4f;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }

  .user-cart {
    position: relative;
  }

  .icon-cart {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }

  .show-cart {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: 350px;
  }

  .user-cart:hover .show-cart {
    display: block;
  }

  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #f5f5f5;
    padding-bottom: 5px;
  }

  .cart-item-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 10px;
  }

  .cart-item-details {
    flex: 1;
  }

  .cart-item-name {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 2px;
  }

  .cart-item-addons {
    font-size: 12px;
    color: #555;
    margin-bottom: 2px;
  }

  .cart-item-quantity {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 2px;
  }

  .cart-item-quantity button {
    background: none;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 2px 8px;
    cursor: pointer;
  }

  .cart-item-price {
    font-size: 12px;
    color: #ff4d4f;
    margin-bottom: 2px;
  }

  .delete-btn {
    background-color: #ff4d4f;
    color: white;
    border: none;
    padding: 2px 8px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  }

  .cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #ff4d4f;
    margin-top: 10px;
  }

  .payment {
    background-color: #ff4500;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }

  .search-results {
    margin: 20px;
  }

  .search-results h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .result-item {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .result-item img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
    margin-right: 15px;
  }

  .result-info h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .result-info p {
    font-size: 14px;
    color: #ff4d4f;
  }

  .no-results {
    margin: 20px;
    text-align: center;
  }

  .no-results p {
    font-size: 16px;
    color: #888;
  }

  .banner-carousel {
    margin: 20px;
    overflow: hidden;
    position: relative;
  }

  .banner-wrapper {
    display: flex;
    width: 100%;
    transition: transform 0.5s ease-in-out;
  }

  .banner {
    flex: 0 0 100%;
    background: linear-gradient(to right, #ff8c00, #ff4500);
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }

  .banner-text {
    color: white;
  }

  .banner-text h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .banner-text button {
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
  }

  .banner-image {
    width: 150px;
    height: 120px;
    object-fit: cover;
  }

  .dots {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }

  .dot {
    width: 8px;
    height: 8px;
    background-color: #ccc;
    border-radius: 50%;
    margin: 0 5px;
    cursor: pointer;
  }

  .dot.active {
    background-color: black;
  }

  .fastest-delivery {
    margin: 20px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .section-header h3 {
    font-size: 18px;
    font-weight: bold;
  }

  .see-all {
    background: none;
    border: none;
    color: #ff4d4f;
    font-size: 14px;
    cursor: pointer;
  }

  .product-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .pagination button {
    margin: 0 4px;
    padding: 4px 10px;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .pagination button.active {
    background: #ff4d4f;
    color: white;
    border-color: #ff4d4f;
  }

  .product-card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .product-card img {
    object-fit: cover;
    display: block;
    margin: 0 auto;
  }

  .product-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }

  .product-info h4 {
    height: 35px;
    font-size: 16px;
    font-weight: bold;
    margin: 5px 0;
  }

  .product-info p {
    height: 35px;
    font-size: 12px;
    color: #888;
    margin: 5px 0;
  }

  .details {
    display: flex;
    gap: 10px;
    margin-bottom: 5px;
  }

  .details .price {
    color: #ff4d4f;
    font-weight: bold;
  }

  .details .category {
    color: #888;
  }

  .details .available {
    color: #28a745;
  }

  .popular-items {
    margin: 20px;
  }

  .item-list {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .item-card {
    background-color: white;
    border-radius: 15px;
    width: 150px;
    flex-shrink: 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    cursor: pointer;
  }

  .item-card img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }

  .footer-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 40px 30px;
    background-color: #333;
    color: white;
  }

  .footer-section {
    margin: 30px;
  }

  .footer-section h4 {
    font-size: 16px;
    margin-bottom: 15px;
    color: #ff4d4f;
  }

  .footer-section p,
  .footer-section a {
    font-size: 14px;
    color: #ccc;
    margin-bottom: 10px;
  }

  .footer-section a:hover {
    color: #ff4d4f;
  }

  .footer-section ul {
    padding: 0;
  }

  .footer-section li {
    margin-bottom: 10px;
  }

  .social-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .footer-bottom {
    background-color: #222;
    text-align: center;
    padding: 15px;
    color: #ccc;
    font-size: 14px;
  }

  @media (max-width: 640px) {
    .home-page {
      padding: 0 15px;
    }

    header {
      padding: 10px 15px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .logo {
      flex: 1;
    }

    .search-bar {
      order: 3;
      width: 100%;
      margin: 10px 0 0;
      max-width: none;
    }

    .menu-toggle {
      display: flex;
    }

    .nav-links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: white;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      z-index: 99;
    }

    .nav-links.open {
      display: flex;
    }

    .nav-links a {
      font-size: 14px;
      padding: 10px 0;
    }

    .user-info {
      gap: 8px;
    }

    .user-name,
    .logout-btn {
      margin-left: 7px;
      font-size: 14px;
    }

    .show-cart {
      width: 350px;
      max-width: 100%;
    }

    .banner-carousel {
      margin: 0;
    }

    .banner-carousel .banner-text {
      margin: 10px;
    }

    .banner-text h2 {
      font-size: 16px;
    }

    .banner-image {
      width: 100px;
      height: 80px;
    }

    .fastest-delivery,
    .popular-items {
      margin: 10px;
    }

    .section-header h3 {
      font-size: 16px;
    }

    .product-list {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .product-card img {
      width: 60px;
      height: 60px;
    }

    .product-info h4 {
      font-size: 12px;
    }

    .product-info p {
      font-size: 10px;
    }

    .item-card {
      width: 120px;
    }

    .result-item img {
      width: 50px;
      height: 50px;
    }

    .result-info h4 {
      font-size: 14px;
    }

    .result-info p {
      font-size: 12px;
    }

    .footer-container {
      grid-template-columns: 1fr;
      padding: 20px;
      margin: 20px 0;
    }

    .footer-section h4 {
      margin: 14px;
    }

    .footer-section p,
    .footer-section a {
      font-size: 12px;
    }

    .footer-bottom {
      font-size: 12px;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .home-page {
      padding: 0 20px;
    }

    header {
      padding: 10px 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .logo {
      flex: 1;
    }

    .search-bar {
      flex: 2;
      margin: 0 15px;
    }

    .menu-toggle {
      display: flex;
    }

    .nav-links {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: white;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      z-index: 100;
    }

    .nav-links.open {
      display: flex;
    }

    .nav-links a {
      font-size: 16px;
      padding: 10px 0;
    }

    .user-info {
      gap: 10px;
    }

    .user-name,
    .logout-btn {
      margin-left: 10px;
      font-size: 14px;
    }

    .show-cart {
      width: 300px;
    }

    .banner-carousel {
      margin: 15px;
    }

    .banner-text h2 {
      font-size: 18px;
    }

    .banner-image {
      width: 300px;
    }

    .fastest-delivery,
    .popular-items {
      margin: 10px;
    }

    .section-header h3 {
      font-size: 17px;
    }

    .product-list {
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .product-card img {
      width: 70px;
      height: 70px;
    }

    .product-info h4 {
      font-size: 14px;
    }

    .product-info p {
      font-size: 12px;
    }

    .item-card {
      width: 130px;
    }

    .result-item {
      width: 55px;
    }

    .result-info h4 {
      font-size: 15px;
    }

    .result-info p {
      font-size: 13px;
    }

    .footer-container {
      grid-template-columns: repeat(2, 1fr);
      padding: 20px;
      margin: 20px 0;
    }

    .footer-section h4 {
      font-size: 14px;
    }

    .footer-section p,
    .footer-section a {
      font-size: 13px;
      margin: 10px;
    }

    .footer-bottom {
      font-size: 13px;
    }
  }

  @media (min-width: 1025px) {
    .home-page {
      padding: 0 30px;
    }

    header {
      padding: 15px 30px;
    }

    .menu-toggle {
      display: none;
    }

    .nav-links {
      display: flex !important;
    }

    .nav-links a {
      font-size: 16px;
    }

    .user-info {
      gap: 15px;
    }

    .user-name,
    .logout-btn {
      font-size: 16px;
    }

    .show-cart {
      width: 350px;
    }

    .banner-carousel {
      margin: 20px;
    }

    .banner-text h2 {
      font-size: 20px;
    }

    .banner-image {
      width: 150px;
      height: 120px;
    }

    .fastest-delivery,
    .popular-items {
      margin: 20px;
    }

    .section-header h3 {
      font-size: 18px;
    }

    .product-list {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .product-card img {
      width: 80px;
      height: 80px;
    }

    .product-info h4 {
      font-size: 16px;
    }

    .product-info p {
      font-size: 12px;
    }

    .item-card {
      width: 150px;
    }

    .footer-container {
      grid-template-columns: repeat(4, 1fr);
      padding: 40px 30px;
      margin: 40px 0;
    }

    .footer-section h4 {
      font-size: 16px;
    }

    .footer-section p,
    .footer-section a {
      font-size: 14px;
    }

    .footer-bottom {
      font-size: 14px;
    }
  }
</style>
