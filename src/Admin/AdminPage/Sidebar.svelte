<!-- src/components/Sidebar.svelte -->
<script>
</script>

<div class="sidebar">
  <div class="logo">FoodDash</div>
  <nav>
    <ul>
      <li>
        <a href="/admin"><span>🏠</span> Dashboard</a>
      </li>
      <li>
        <a href="/admin/orders"><span>📦</span> Orders</a>
      </li>
      <li>
        <a href="/admin/restaurants"><span>🍴</span> Restaurants</a>
      </li>
      <li>
        <a href="/admin/drivers"><span>🚗</span> Drivers</a>
      </li>
      <li>
        <a href="/admin/customers"><span>👥</span> Customers</a>
      </li>
      <li>
        <a href="/admin/analytics"><span>📊</span> Analytics</a>
      </li>
    </ul>
  </nav>
</div>

<style>
  .sidebar {
    width: 200px;
    background-color: #fff;
    border-right: 1px solid #e0e0e0;
    padding: 20px;
  }

  .logo {
    font-size: 20px;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 30px;
  }

  nav ul {
    list-style: none;
    padding: 0;
  }

  nav li {
    padding: 10px 0;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  nav li span {
    margin-right: 10px;
  }

  .active {
    background-color: #e6f0ff;
    color: #007bff;
    border-radius: 5px;
    padding-left: 10px;
  }
</style>
