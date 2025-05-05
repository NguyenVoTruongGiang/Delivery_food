<script></script>

<main>
  <nav class="bottom-nav">
    <div class="nav-item">
      <a href="home">
        <span class="icon">🏠</span>
        <span>Discover</span>
      </a>
    </div>
    <div class="nav-item">
      <a href="restaurant">
        <span class="icon">🍴</span>
        <span>Restaurants</span>
      </a>
    </div>
    <div class="nav-item">
      <a href="search">
        <span class="icon">🔎</span>
        <span>Search</span>
      </a>
    </div>
    <div class="nav-item active">
      <a href="favorite">
        <span class="icon">❤️</span>
        <span>Favorite</span>
      </a>
    </div>
    <div class="nav-item">
      <a href="profile">
        <span class="icon">👤</span>
        <span>Profile</span>
      </a>
    </div>
  </nav>
</main>

<style>
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
