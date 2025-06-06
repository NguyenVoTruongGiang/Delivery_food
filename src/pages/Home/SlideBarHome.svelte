<script></script>

<main>
  <nav class="bottom-nav">
    <div class="nav-item">
      <a href="search">
        <span class="icon">🔎</span>
      </a>
    </div>
  
  </nav>
</main>

<style>
  /* Bottom Navigation */
  .bottom-nav {
    display: flex;
    justify-content: space-around;
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
