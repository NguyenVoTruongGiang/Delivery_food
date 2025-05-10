<!-- src/Home.svelte -->
<script>
  export let onLogout;
  export let onProductDetail; // Hàm điều hướng đến trang chi tiết sản phẩm
  import { onMount, onDestroy } from "svelte";
  import SlideBarHome from "./SlideBarHome.svelte";

  let address = "Home, Jl. Soekarno Hatta 15A";
  let user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
  console.log(user.name);

  if (!user) {
    // Chưa login thì chuyển hướng
    window.location.href = "/login";
  }

  // Danh sách banner
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

  // Dữ liệu chi tiết cho nhà hàng (Fastest Delivery)
  let restaurants = [
    {
      id: 1,
      name: "Crazy Tacko",
      description: "Deliceous tackos, appetizing snacks, fresh ingredients",
      price: "€3.00",
      deliveryTime: "40-50 min",
      rating: "9.5",
      deliveryFee: "€0.00",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "La Sala",
      description: "Fresh and tasty salads",
      price: "€2.00",
      deliveryTime: "30-40 min",
      rating: "8.9",
      image: "https://via.placeholder.com/150",
    },
  ];

  // Dữ liệu chi tiết cho món ăn (Popular Items)
  let popularItems = [
    {
      id: 3,
      name: "Cheese Burger",
      description: "Juicy beef patty with melted cheese",
      price: "€5.00",
      deliveryTime: "20-30 min",
      rating: "9.0",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Sushi Platter",
      description: "Fresh sushi with assorted fish",
      price: "€8.00",
      deliveryTime: "30-40 min",
      rating: "9.2",
      image: "https://via.placeholder.com/100",
    },
  ];

  let currentBannerIndex = 0;
  let intervalId;

  // Chuyển banner tự động
  onMount(() => {
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

  // Xử lý khi click vào chấm (dot)
  function goToBanner(index) {
    currentBannerIndex = index;
  }

  // Điều hướng đến trang chi tiết sản phẩm
  function goToProductDetail(productId) {
    onProductDetail(productId.id); // Gọi hàm điều hướng từ props
  }

  function handleLogout() {
    localStorage.removeItem("user"); //  logout user
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
      <div class="restaurant-list">
        {#each restaurants as restaurant}
          <div
            class="restaurant-card"
            on:click={() => goToProductDetail(restaurant.id)}
            on:keydown={(e) => e.key === "Enter" && goToProductDetail(restaurant.id)}
            role="button"
            tabindex="0"
          >
            <img src={restaurant.image} alt={restaurant.name} />
            <div class="restaurant-info">
              <h4>{restaurant.name}</h4>
              <p>{restaurant.description}</p>
              <div class="details">
                <span class="price">{restaurant.price}</span>
                <span class="delivery-time">{restaurant.deliveryTime}</span>
                <span class="rating">{restaurant.rating}</span>
              </div>
              {#if restaurant.deliveryFee}
                <span class="delivery-fee">{restaurant.deliveryFee} delivery</span>
              {/if}
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
        {#each popularItems as item}
          <div
            class="item-card"
            on:click={() => goToProductDetail(item.id)}
            on:keydown={(e) => e.key === "Enter" && goToProductDetail(item.id)}
            role="button"
            tabindex="0"
          >
            <img src={item.image} alt={item.name} />
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
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .address {
    display: flex;
    align-items: center;
    background-color: #ffedeb;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
  }

  .user-info {
    display: flex;
    align-items: center;
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