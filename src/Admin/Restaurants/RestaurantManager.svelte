<script>
    import Sidebar from '../AdminPage/Sidebar.svelte';
    import Header from '../AdminPage/Header.svelte';
  
    let adminName = "John";
    let restaurants = [
      { id: "RES-001", name: "Burger King", address: "123 Main St", status: "Active" },
      { id: "RES-002", name: "Pizza Hut", address: "456 Oak Ave", status: "Inactive" },
      { id: "RES-003", name: "KFC", address: "789 Pine Rd", status: "Active" },
    ];
  
    function viewRestaurant(restaurantId) {
      alert(`Viewing details for restaurant ${restaurantId}`);
    }
  </script>
  
  <div class="app">
    <Sidebar activePage="Restaurants" />
    <div class="main-content">
      <Header {adminName} />
      <div class="dashboard">
        <h1>Restaurants</h1>
        <p>Manage all restaurants here.</p>
  
        <div class="restaurant-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each restaurants as restaurant}
                <tr>
                  <td>{restaurant.id}</td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address}</td>
                  <td>
                    <span class="status {restaurant.status.toLowerCase()}">{restaurant.status}</span>
                  </td>
                  <td>
                    <button on:click={() => viewRestaurant(restaurant.id)}>👁️</button>
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
  
    .restaurant-list {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 982px 5px rgba(0, 0, 0, 0.1);
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
  
    .active {
      background-color: #e6ffed;
      color: #28a745;
    }
  
    .inactive {
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