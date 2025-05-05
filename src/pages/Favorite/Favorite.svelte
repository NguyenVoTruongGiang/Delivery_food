<!-- src/Favorite.svelte -->
<script>
  import SlideBarHome from "../Home/SlideBarHome.svelte";

  let activeTab = "Food items"; // Tab hiện tại (Food items hoặc Restaurants)

  let favoriteItems = [
    {
      name: "Shrimp pizza",
      restaurant: "Crazy Pizza",
      price: "€6.00",
      deliveryTime: "30-50 min",
      rating: "8.7",
      image: "https://via.placeholder.com/100",
    },
    {
      name: "Creme brulee",
      restaurant: "La Pasta House",
      price: "€6.00",
      deliveryTime: "40-50 min",
      rating: "9.5",
      image: "https://via.placeholder.com/100",
    },
  ];

  function toggleFavorite(item) {
    alert(`Toggled favorite for ${item.name}`);
    // Thêm logic để thêm/xóa khỏi danh sách yêu thích
  }
</script>

<main>
  <div class="favorite-page">
    <!-- Header -->
    <header>
      <div class="time">11:11</div>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search" />
      </div>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <button
        class={activeTab === "Food items" ? "tab active" : "tab"}
        on:click={() => (activeTab = "Food items")}
      >
        Food items
      </button>
      <button
        class={activeTab === "Restaurants" ? "tab active" : "tab"}
        on:click={() => (activeTab = "Restaurants")}
      >
        Restaurants
      </button>
    </div>

    <!-- Favorite Items -->
    <section class="favorite-items">
      {#each favoriteItems as item}
        <div class="favorite-item">
          <img src={item.image} alt={item.name} />
          <div class="item-info">
            <h4>{item.name}</h4>
            <p class="restaurant">{item.restaurant}</p>
            <div class="details">
              <span class="price">{item.price}</span>
              <span class="delivery-time">⏳ {item.deliveryTime}</span>
              <span class="rating">⭐ {item.rating}</span>
            </div>
          </div>
          <button class="favorite-icon" on:click={() => toggleFavorite(item)}>
            ❤️
          </button>
        </div>
      {/each}
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

  .favorite-page {
    background-color: #fff;
    min-height: 100vh;
    padding: 20px;
    padding-bottom: 70px; /* Space for bottom navigation */
  }

  /* Header */
  header {
    margin-bottom: 20px;
  }

  .time {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .search-bar {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 25px;
  }

  .search-bar .search-icon {
    font-size: 20px;
    color: #888;
    margin-right: 10px;
  }

  .search-bar input {
    flex: 1;
    border: none;
    background: none;
    font-size: 16px;
    outline: none;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .tab {
    background-color: #f5f5f5;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    color: #888;
    cursor: pointer;
  }

  .tab.active {
    background-color: #ff8c00;
    color: #fff;
  }

  /* Favorite Items */
  .favorite-items {
    margin-top: 20px;
  }

  .favorite-item {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .favorite-item img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    object-fit: cover;
    margin-right: 15px;
  }

  .item-info {
    flex: 1;
  }

  .item-info h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .item-info .restaurant {
    font-size: 12px;
    color: #888;
    margin-bottom: 5px;
  }

  .details {
    display: flex;
    gap: 10px;
    font-size: 12px;
  }

  .details .price {
    color: #ff4d4f;
    font-weight: bold;
  }

  .details .delivery-time {
    color: #888;
  }

  .details .rating {
    color: #ff4d4f;
  }

  .favorite-icon {
    background: none;
    border: none;
    font-size: 20px;
    color: #ff4d4f;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  /* Bottom Navigation */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: #888;
  }

  .nav-item.active {
    color: #ff4d4f;
  }

  .nav-item .icon {
    font-size: 20px;
    margin-bottom: 5px;
  }
</style>
