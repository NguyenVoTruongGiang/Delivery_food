<!-- src/Drivers.svelte -->
<script>
    import Sidebar from '../AdminPage/Sidebar.svelte';
    import Header from '../AdminPage/Header.svelte';
  
    let adminName = "John";
    let drivers = [
      { id: "DRV-001", name: "John Doe", status: "Available", ordersDelivered: 45 },
      { id: "DRV-002", name: "Jane Smith", status: "On Delivery", ordersDelivered: 32 },
      { id: "DRV-003", name: "Mike Brown", status: "Offline", ordersDelivered: 19 },
    ];
  
    function viewDriver(driverId) {
      alert(`Viewing details for driver ${driverId}`);
    }
  </script>
  
  <div class="app">
    <Sidebar activePage="Drivers" />
    <div class="main-content">
      <Header {adminName} />
      <div class="dashboard">
        <h1>Drivers</h1>
        <p>Manage all drivers here.</p>
  
        <div class="driver-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Orders Delivered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each drivers as driver}
                <tr>
                  <td>{driver.id}</td>
                  <td>{driver.name}</td>
                  <td>
                    <span class="status {driver.status.toLowerCase().replace(' ', '-')}">{driver.status}</span>
                  </td>
                  <td>{driver.ordersDelivered}</td>
                  <td>
                    <button on:click={() => viewDriver(driver.id)}>👁️</button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
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
  
    .driver-list {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
    }
  
    th, td {
      padding: 10px;
      text-align: left;
    }
  
    th {
      font-size: 14px;
      color: #888;
    }
  
    td {
      font-size: 14px;
    }
  
    .status {
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
    }
  
    .available {
      background-color: #e6ffed;
      color: #28a745;
    }
  
    .on-delivery {
      background-color: #fff3cd;
      color: #856404;
    }
  
    .offline {
      background-color: #f8d7da;
      color: #dc3545;
    }
  
    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }
  </style>