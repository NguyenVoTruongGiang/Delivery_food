<!-- src/components/Sidebar.svelte -->
<script>
  export let activePage;
  
  const menuItems = [
    { name: "Dashboard", icon: "", path: "/admin" },
    { name: "Users", icon: "", path: "/admin/users" },
    { name: "Products", icon: "", path: "/admin/products" },
    { name: "Orders", icon: "", path: "/admin/orders" }
  ];
  
  function navigateTo(path) {
    window.location.href = path;
  }
</script>

<div class="sidebar">
  <div class="logo">
    <h2>FoodAdmin</h2>
  </div>
  
  <nav>
    <ul>
      {#each menuItems as item}
        <li class:active={activePage === item.name}>
          <button on:click={() => navigateTo(item.path)}>
            <span class="material-icons">{item.icon}</span>
            {item.name}
          </button>
        </li>
      {/each}
    </ul>
  </nav>
  
  <div class="logout">
    <button on:click={() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }} style="display: flex; align-items: center;justify-content: center;">
      Logout
    </button>
  </div>
</div>

<style>
  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .logo {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  .logo h2 {
    margin: 0;
    font-size: 24px;
  }
  
  nav {
    flex: 1;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li button {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: #ecf0f1;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s;
  }
  
  li button:hover {
    background-color: rgba(255,255,255,0.1);
  }
  
  li.active button {
    background-color: rgba(255,255,255,0.2);
    font-weight: bold;
  }
  
  .material-icons {
    margin-right: 10px;
  }
  
  .logout {
    padding: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  
  .logout button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    background-color: rgba(231, 76, 60, 0.8);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .logout button:hover {
    background-color: rgba(231, 76, 60, 1);
  }
</style>