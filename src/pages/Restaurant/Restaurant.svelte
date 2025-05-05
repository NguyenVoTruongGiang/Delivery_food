<!-- src/Restaurants.svelte -->
<script>
  import { onMount } from "svelte";
  import SlideBarHome from "../Home/SlideBarHome.svelte";

  let location = "Jl. Soekarno Hatta 15A";
  let categories = [
    { name: "Brunch", places: 94, image: "https://via.placeholder.com/80" },
    { name: "Sea food", places: 43, image: "https://via.placeholder.com/80" },
    { name: "Dessert", places: 38, image: "https://via.placeholder.com/80" },
  ];
  let restaurants = [
    {
      name: "Tasty bowl",
      description: "Choose from a variety of bowl options and tas...",
      price: "€1.00",
      deliveryTime: "40-50 min",
      rating: "9.2",
      image: "https://via.placeholder.com/300x150",
    },
    // Thêm các nhà hàng khác nếu cần
  ];
</script>

<main>
  <div class="restaurants-page">
    <!-- Header -->
    <header>
      <div class="address">
        <span class="icon">🏠</span>
        <span>Home, {location}</span>
        <span class="heart-icon">❤️</span>
      </div>
      <div class="icons">
        <span class="icon">🔄</span>
        <span class="icon">☰</span>
      </div>
    </header>

    <!-- Title -->
    <h1>Restaurants</h1>

    <!-- Categories -->
    <section class="categories">
      <div class="section-header">
        <h3>Categories</h3>
        <button class="see-all">See all</button>
      </div>
      <div class="category-list">
        {#each categories as category}
          <div class="category-card">
            <img src={category.image} alt={category.name} />
            <h4>{category.name}</h4>
            <p>{category.places} places</p>
          </div>
        {/each}
      </div>
    </section>

    <!-- All Restaurants -->
    <section class="all-restaurants">
      <div class="section-header">
        <h3>All restaurants</h3>
      </div>
      {#each restaurants as restaurant}
        <div class="restaurant-card">
          <img src={restaurant.image} alt={restaurant.name} />
          <div class="restaurant-info">
            <h4>{restaurant.name}</h4>
            <p>{restaurant.description}</p>
            <div class="details">
              <span class="price">{restaurant.price}</span>
              <span class="delivery-time">⏳ {restaurant.deliveryTime}</span>
              <span class="rating">⭐ {restaurant.rating}</span>
            </div>
          </div>
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

  .restaurants-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20px;
    padding-bottom: 70px; /* Space for bottom navigation */
  }

  /* Header */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .address {
    display: flex;
    align-items: center;
    background-color: #ffedeb;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 14px;
  }

  .address .icon {
    margin-right: 5px;
  }

  .address .heart-icon {
    margin-left: 5px;
    color: #ff4d4f;
  }

  .icons {
    display: flex;
    gap: 10px;
  }

  .icons .icon {
    font-size: 20px;
    color: #333;
  }

  /* Title */
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  /* Categories Section */
  .categories {
    margin-bottom: 20px;
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

  .category-list {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .category-card {
    text-align: center;
    width: 80px;
    flex-shrink: 0;
  }

  .category-card img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 5px;
  }

  .category-card h4 {
    font-size: 14px;
    font-weight: bold;
  }

  .category-card p {
    font-size: 12px;
    color: #888;
  }

  /* All Restaurants Section */
  .all-restaurants {
    margin-bottom: 20px;
  }

  .restaurant-card {
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
    overflow: hidden;
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