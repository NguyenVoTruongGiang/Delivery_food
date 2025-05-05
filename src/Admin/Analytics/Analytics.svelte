<!-- src/Analytics.svelte -->
<script>
    import Sidebar from '../AdminPage/Sidebar.svelte';
    import Header from '../AdminPage/Header.svelte';
    import StatCard from '../AdminPage/StatCard.svelte';
  
    let adminName = "John";
    let stats = [
      { title: "Total Orders", value: "2,451", change: "+12.5% from yesterday", icon: "🛒" },
      { title: "Active Drivers", value: "156", change: "+8.2% from yesterday", icon: "🚗" },
      { title: "Revenue", value: "$24,500", change: "+15.3% from yesterday", icon: "💰" },
      { title: "Active Restaurants", value: "89", change: "+7% from yesterday", icon: "🍽️" },
    ];
  </script>
  
  <div class="app">
    <Sidebar activePage="Analytics" />
    <div class="main-content">
      <Header {adminName} />
      <div class="dashboard">
        <h1>Analytics</h1>
        <p>View your business insights here.</p>
  
        <div class="stats">
          {#each stats as stat}
            <StatCard {...stat} />
          {/each}
        </div>
  
        <div class="charts">
          <div class="chart">
            <h2>Revenue Over Time</h2>
            <div class="chart-placeholder">Revenue Chart Placeholder</div>
          </div>
          <div class="chart">
            <h2>Orders by Day</h2>
            <div class="chart-placeholder">Orders Chart Placeholder</div>
          </div>
        </div>
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
  
    h1 {
      font-size: 24px;
      margin-bottom: 5px;
    }
  
    p {
      color: #888;
      margin-bottom: 20px;
    }
  
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
  
    .charts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  
    .chart {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  
    .chart h2 {
      font-size: 18px;
      margin-bottom: 15px;
    }
  
    .chart-placeholder {
      height: 200px;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888;
      border-radius: 5px;
    }
  </style>