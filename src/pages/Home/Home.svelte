<!-- src/pages/Home/Home.svelte -->
<script>
  export let onLogout;
  export let onProductDetail; // Hàm điều hướng đến trang chi tiết sản phẩm
  import { onMount, onDestroy } from "svelte";
  import SlideBarHome from "./SlideBarHome.svelte";

  let address = "Home, Jl. Soekarno Hatta 15A";
  let user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
  console.log(user?.name);

  if (!user) {
    // Chưa login thì chuyển hướng
    window.location.href = "/login";
  }

  // Danh sách banner (giữ nguyên dữ liệu tĩnh)
  let banners = [
    {
      text: "Get your 30% daily discount now!",
      image: "https://via.placeholder.com/200x150",
      alt: "Burger",
    },
    {
      text: "Special Offer: Free Delivery Today!",
      image: "https://via.placeholder.com/200x150",
      alt: "Pizza",
    },
    {
      text: "Try Our New Menu Items!",
      image: "https://via.placeholder.com/200x150",
      alt: "Sushi",
    },
  ];

  // Dữ liệu ban đầu cho nhà hàng và món ăn (khởi tạo rỗng)
  let products = [];
  let carts = [];

  $: totalCartPrice = carts
    .reduce((sum, item) => {
      const product = products.find((p) => p.id === item.product_id);
      const productPrice = product
        ? parseFloat(product.price.replace("€", ""))
        : 0;
      const addOnsPrice = item.addOns
        ? item.addOns.reduce((addOnSum, addOn) => {
            return addOnSum + parseFloat(addOn.price.replace("€", ""));
          }, 0)
        : 0;
      return sum + (productPrice + addOnsPrice) * item.quantity;
    }, 0)
    .toFixed(2);

  let currentBannerIndex = 0;
  let intervalId;
  const baseUrl = "http://localhost:8080";

  // Hàm gọi API để lấy danh sách sản phẩm (Popular Items)
  async function fetchProduct() {
    try {
      const response = await fetch(`${baseUrl}/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      products = data; // Cập nhật danh sách sản phẩm từ API
      console.log("Products fetched:", products);
    } catch (error) {
      console.error("Error fetching popular items:", error);
    }
  }

  async function fetchCart() {
    try {
      const response = await fetch(`${baseUrl}/cart/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      const data = await response.json();
      carts = data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      carts = [];
    }
  }

  async function updateCartItem(itemId, newQuantity) {
    try {
      const response = await fetch(`${baseUrl}/cart/${user.id}/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      await fetchCart(); // Refresh cart after update
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart.");
    }
  }

  async function deleteCartItem(itemId) {
    try {
      const response = await fetch(`${baseUrl}/cart/${user.id}/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete item from cart");
      }

      await fetchCart(); // Refresh cart after deletion
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

  // Gọi API khi component được mount
  onMount(async () => {
    await Promise.all([fetchProduct(), fetchCart()]); // Gọi cả hai API song song

    // Chuyển banner tự động
    intervalId = setInterval(() => {
      currentBannerIndex = (currentBannerIndex + 1) % banners.length;
    }, 1500);
  });

  // Dừng interval khi component bị hủy
  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  // xử lý chuyển qua trang produtcDetail khi click vào product trong cart
  function goToProductDetailFromCart(cartItem) {
    const product = products.find((p) => p.id === cartItem.product_id);
    if (product) {
      onProductDetail(product); // Truyền đúng object sản phẩm
    } else {
      alert("Không tìm thấy thông tin sản phẩm!");
    }
  }

  // Xử lý khi click vào chấm (dot)
  function goToBanner(index) {
    currentBannerIndex = index;
  }

  // Điều hướng đến trang chi tiết sản phẩm
  function goToProductDetail(product) {
    onProductDetail(product); // Gọi hàm điều hướng từ props, truyền cả object product
  }

  function handleLogout() {
    localStorage.removeItem("user"); // Logout user
    onLogout(); // Gọi hàm logout từ props
  }
</script>

<main>
  <div class="home-page">
    <!-- Header -->
    <header style="display: flex; justify-content: space-around;">
      <div class="address">
        <span class="icon">🏠</span>
        <span>{address}</span>
        <span class="heart-icon">❤️</span>
      </div>

      <div class="user-info">
        <span>{user?.name}</span>
        <button on:click={handleLogout}>logout</button>

        <div class="user-cart">
          <button class="icon-cart" on:click={fetchCart}
            >🛒
            <div class="show-cart">
              {#if carts.length > 0}
                {#each carts as item}
                  <div
                    class="cart-item"
                    on:click={() => goToProductDetailFromCart(item)}
                    on:keydown={(e) =>
                      e.key === "Enter" && goToProductDetailFromCart(item)}
                    role="button"
                    tabindex="0"
                  >
                    <img
                      src={products.find((p) => p.id === item.product_id)
                        ?.image || "/placeholder.png"}
                      alt={products.find((p) => p.id === item.product_id)
                        ?.name || "Unknown"}
                      class="cart-item-image"
                    />
                    <div class="cart-item-details">
                      <p class="cart-item-name">
                        {products.find((p) => p.id === item.product_id)?.name ||
                          "Unknown"}
                      </p>
                      {#if item.addOns && item.addOns.length > 0}
                        <p class="cart-item-addons">
                          Add-ons: {item.addOns.map((a) => a.name).join(", ")}
                        </p>
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
                        Price: €{(
                          (products
                            .find((p) => p.id === item.product_id)
                            ?.price.replace("€", "") || 0) *
                            1 +
                          (item.addOns
                            ? item.addOns.reduce(
                                (sum, addOn) =>
                                  sum +
                                  parseFloat(addOn.price.replace("€", "")),
                                0
                              )
                            : 0)
                        ).toFixed(2)}
                      </p>
                      <button
                        class="delete-btn"
                        on:click={() => deleteCartItem(item.id)}>Xóa</button
                      >
                    </div>
                  </div>
                {/each}
                <div class="cart-total">
                  <p>Total: €{totalCartPrice}</p>
                  <button class="payment">Thanh toán</button>
                </div>
              {:else}
                <p>Cart is empty</p>
              {/if}
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- Banner Carousel -->
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

    <!-- Dots (Pagination for Banner) -->
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

    <!-- Fastest Delivery Section -->
    <section class="fastest-delivery">
      <div class="section-header">
        <h3>Fastest delivery 🔥</h3>
        <button class="see-all">See all</button>
      </div>
      <div class="product-list">
        {#each products as product}
          <div
            class="product-card"
            on:click={() => goToProductDetail(product)}
            on:keydown={(e) => e.key === "Enter" && goToProductDetail(product)}
            role="button"
            tabindex="0"
          >
            <img src={product.image} alt={product.name} />
            <div class="product-info">
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <div class="details">
                <span class="price">€{product.price}</span>
                <span class="category">{product.category}</span>
                <span class="available"
                  >{product.available ? "Available" : "Out of stock"}</span
                >
              </div>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Popular Items Section -->
    <section class="popular-items">
      <div class="section-header">
        <h3>Popular items 🥐</h3>
        <button class="see-all">See all</button>
      </div>
      <div class="item-list">
        {#each products as product}
          <div
            class="item-card"
            on:click={() => goToProductDetail(product)}
            on:keydown={(e) => e.key === "Enter" && goToProductDetail(product)}
            role="button"
            tabindex="0"
          >
            <img src={product.image} alt={product.name} />
            <div class="item-info">
              <h4>{product.name}</h4>
              <p>€{product.price}</p>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- Bottom Navigation -->
    <SlideBarHome />
  </div>
</main>

<style>
  /* Reset and Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  .home-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 70px; /* Space for bottom navigation */
  }

  /* Header */
  header {
    display: flex;
    justify-content: space-around;
    padding: 10px 20px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .address {
    display: flex;
    background-color: #ffedeb;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
  }

  .user-info {
    display: flex;
    justify-content: space-around;
    font-size: 14px;
  }

  .user-info span {
    padding: 10px;
  }
  .user-cart {
    display: flex;
    padding: 0 15px;
    font-size: 14px;
    position: relative;
  }

  .user-cart .show-cart {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
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

  .cart-item-quantity span {
    font-size: 12px;
    color: #888;
  }

  .cart-item-price {
    font-size: 12px;
    color: #ff4d4f;
    margin-bottom: 2px;
  }

  .delete-btn {
    background-color: #ff4d4f;
    color: #fff;
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

  .cart-total p {
    padding: 5px 10px;
  }

  .payment {
    background-color: #ff4d4f;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }

  .address .icon {
    margin-right: 5px;
  }

  .address .heart-icon {
    margin-left: 5px;
    color: #ff4d4f;
  }

  /* Banner Carousel */
  .banner-carousel {
    margin: 20px;
    overflow: hidden;
    position: relative;
  }

  .banner-wrapper {
    display: flex;
    width: 100%;
    transition: transform 0.5s ease-in-out; /* Hiệu ứng chuyển động mượt mà */
  }

  .banner {
    flex: 0 0 100%; /* Mỗi banner chiếm toàn bộ chiều rộng */
    background: linear-gradient(to right, #ff8c00, #ff4500);
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }

  .banner-text {
    color: #fff;
  }

  .banner-text h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .banner-text button {
    background-color: #000;
    color: #fff;
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

  /* Dots (Pagination) */
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
    background-color: #000;
  }

  /* Fastest Delivery Section */
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

  .restaurant-list {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .restaurant-card {
    background-color: #fff;
    border-radius: 15px;
    width: 250px;
    flex-shrink: 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    cursor: pointer; /* Thêm con trỏ để người dùng biết có thể click */
  }

  .restaurant-card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .restaurant-info {
    padding: 10px;
  }

  .restaurant-info h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .restaurant-info p {
    font-size: 12px;
    color: #888;
    margin-bottom: 5px;
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

  .details .delivery-time {
    color: #888;
  }

  .details .rating {
    background-color: #ffedeb;
    color: #ff4d4f;
    padding: 2px 5px;
    border-radius: 10px;
    font-size: 12px;
  }

  .delivery-fee {
    display: inline-block;
    background-color: #e6ffed;
    color: #28a745;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
  }

  /* Popular Items Section */
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
    background-color: #fff;
    border-radius: 15px;
    width: 150px;
    flex-shrink: 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    cursor: pointer; /* Thêm con trỏ để người dùng biết có thể click */
  }

  .item-card img {
    width: 100%;
    height: 100px;
    object-fit: cover;
  }
</style>
