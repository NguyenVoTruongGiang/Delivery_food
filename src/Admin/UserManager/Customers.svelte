<!-- src/Customers.svelte -->
<script>
    import Sidebar from '../AdminPage/Sidebar.svelte';
    import Header from '../AdminPage/Header.svelte';
  
    let adminName = "Giang";
    let customers = [
      { id: "1", name: "giang", email:"giang@gmail.com", orders: 12, role: 2, totalSpent: "$450.00" },
      { id: "2", name: "kolikoli", email:"kolikoli@gmail.com", orders: 8, role: 2, totalSpent: "$320.00" },
      { id: "3", name: "giangkoli", email:"giangkoli@gmail.com", orders: 5, role: 2, totalSpent: "$180.00" },
    ];
  
    function viewCustomer(customerId) {
      alert(`Viewing details for customer ${customerId}`);
    }
  </script>
  
  <div class="app">
    <Sidebar activePage="Customers" />
    <div class="main-content">
      <Header {adminName} />
      <div class="dashboard">
        <h1>Customers</h1>
        <p>Manage all customers here.</p>
  
        <div class="customer-list">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Role</th>
                <th>Total Spent</th>
                <th>Actions</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {#each customers as customer}
                <tr>
                  <td>{customer.id}</td>
                  <td>
                    {customer.name}
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.orders}</td>
                  <td>
                    <span class="role {customer.role === 1 ? 'admin' : 'user'}">
                      {customer.role === 1 ? 'Admin' : 'User'}
                    </span>
                  <td>{customer.totalSpent}</td>
                  <td>
                    <button on:click={() => viewCustomer(customer.id)}>👁️</button>
                  </td>
                  <td>
                    <button >Edit</button>
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
  
    .customer-list {
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
  
    td img {
      border-radius: 50%;
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 10px;
    }
  
    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }
  </style>