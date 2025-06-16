<!-- src/MainAdmin.svelte -->
<script>
    import Sidebar from './Sidebar.svelte';
    import Header from './Header.svelte';
    import StatCard from './StatCard.svelte';
    import RecentOrders from './RecentOrders.svelte';
    import DeliveryMap from './DeliveryMap.svelte';
  
    // Sample data for the dashboard (you can replace this with API calls later)
    let adminName = "Giang";
    let stats = [
      { title: "Total Orders", value: "2,451", change: "+12.5% from yesterday", icon: "🛒" },
      { title: "Active Drivers", value: "156", change: "+8.2% from yesterday", icon: "🚗" },
      { title: "Revenue", value: "$24,500", change: "+15.3% from yesterday", icon: "💰" },
      { title: "Active Restaurants", value: "89", change: "+7% from yesterday", icon: "🍽️" },
    ];
  </script>
  
  <div class="app">
    <Sidebar />
    <div class="main-content">
      <Header {adminName} />
      <div class="dashboard">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, {adminName}!</p>
        <div class="stats">
          {#each stats as stat}
            <StatCard {...stat} />
          {/each}
        </div>
        <RecentOrders />
        <DeliveryMap />
      </div>
    </div>
  </div>
  
  <style>
    .app {
      display: flex;
      height: 100vh;
      font-family: Arial, sans-serif;
    }
  
    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f7fa;
      overflow-y: auto;
    }
  
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
  
    h1 {
      font-size: 24px;
      margin-bottom: 5px;
    }
  
    p {
      color: #888;
      margin-bottom: 20px;
    }
  </style>