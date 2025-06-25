<script>
  import Sidebar from "./Sidebar.svelte";
  import Header from "./Header.svelte";
  import DeliveryMap from "./DeliveryMap.svelte";

  let adminName = "Admin";
  
  // Dashboard statistics
  let stats = {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenue: 0
  };
  
  async function fetchStats() {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch("http://localhost:8080/api/admin/orders"),
        fetch("http://localhost:8080/api/admin/users"),
        fetch("http://localhost:8080/api/admin/products")
      ]);
      
      if (ordersRes.ok && usersRes.ok && productsRes.ok) {
        const orders = await ordersRes.json();
        const users = await usersRes.json();
        const products = await productsRes.json();
        
        stats.totalOrders = orders.length;
        stats.pendingOrders = orders.filter(o => o.status === "PENDING").length;
        stats.completedOrders = orders.filter(o => o.status === "COMPLETED").length;
        stats.totalUsers = users.length;
        stats.totalProducts = products.length;
        stats.revenue = orders
          .filter(o => o.status === "COMPLETED")
          .reduce((sum, order) => sum + (order.total_price || 0), 0);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }
  
  import { onMount } from 'svelte';
  
  onMount(() => {
    fetchStats();
  });
</script>

<div class="app">
  <Sidebar activePage="Dashboard" />
  <div class="main-content">
    <Header {adminName} />
    <div class="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome to your admin dashboard.</p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Orders</h3>
          <p class="stat-value">{stats.totalOrders}</p>
        </div>
        <div class="stat-card">
          <h3>Pending Orders</h3>
          <p class="stat-value">{stats.pendingOrders}</p>
        </div>
        <div class="stat-card">
          <h3>Completed Orders</h3>
          <p class="stat-value">{stats.completedOrders}</p>
        </div>
        <div class="stat-card">
          <h3>Total Users</h3>
          <p class="stat-value">{stats.totalUsers}</p>
        </div>
        <div class="stat-card">
          <h3>Products</h3>
          <p class="stat-value">{stats.totalProducts}</p>
        </div>
        <div class="stat-card">
          <h3>Revenue</h3>
          <p class="stat-value">{stats.revenue.toLocaleString()} đ</p>
        </div>
      </div>
      
    </div>
  </div>
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
  }
  
  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .dashboard {
    max-width: 1200px;
    margin: 20px auto;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin: 30px 0;
  }
  
  .stat-card {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .stat-card h3 {
    font-size: 16px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
  }
</style>