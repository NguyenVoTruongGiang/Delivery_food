<script>
  import Sidebar from "../AdminPage/Sidebar.svelte";
  import Header from "../AdminPage/Header.svelte";
  import { onMount } from 'svelte';
  
  let adminName = "Admin";
  let users = [];
  let loading = true;
  let error = null;
  
  // Form for adding/editing user
  let editingUser = null;
  let formData = {
  name: "",
  email: "",
  address: "",
  phone: "",
  role: 2,
  status: "active" // Fake status
};
  
  let showForm = false;
  
  onMount(async () => {
  await fetchUsers();
  if (users.length === 0) {
    users = [
      { id: 1, name: "Nguyen Van Giang", email: "VanGiang@example.com", address: "Ha Noi", phone: "0901234567", role: 0, status: "active" },
      { id: 2, name: "Tran Thi Trang", email: "ThiTrang@example.com", address: "Ho Chi Minh", phone: "0912345678", role: 1, status: "inactive" },
      { id: 3, name: "Le Van Luyen", email: "Luyen@example.com", address: "Da Nang", phone: "0923456789", role: 2, status: "active" }
    ];
  }
});
  
  async function fetchUsers() {
  loading = true;
  error = null;
  try {
    const response = await fetch("http://localhost:8080/api/admin/users", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    users = await response.json();
  } catch (err) {
    console.error("Error fetching users:", err);
    error = err.message;
    if (users.length === 0) {
      users = [
        { id: 1, name: "Nguyen Van Giang", email: "VanGiang@example.com", address: "Ha Noi", phone: "0901234567", role: 0, status: "active" },
        { id: 2, name: "Tran Thi Trang", email: "ThiTrang@example.com", address: "Ho Chi Minh", phone: "0912345678", role: 1, status: "inactive" },
        { id: 3, name: "Le Van Luyen", email: "Luyen@example.com", address: "Da Nang", phone: "0923456789", role: 2, status: "active" }
      ];
    }
  } finally {
    loading = false;
  }
}
  
  function addNewUser() {
    editingUser = null;
    formData = {
      name: "",
      email: "",
      address: "",
      phone: "",
      role: 2
    };
    showForm = true;
  }
  
  function editUser(user) {
    editingUser = user;
    formData = {
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
      phone: user.phone || "",
      role: user.role || 2
    };
    showForm = true;
  }
  
  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to delete user");
      
      // Remove user from list
      users = users.filter(u => u.id !== id);
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(`Failed to delete user: ${err.message}`);
    }
  }
  
  async function saveUser() {
  try {
    const url = editingUser 
      ? `http://localhost:8080/api/admin/users/${editingUser.id}` 
      : "http://localhost:8080/api/admin/users";
    const method = editingUser ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error("Failed to save user");
    const savedUser = await response.json();
    users = editingUser ? users.map(u => u.id === savedUser.id ? savedUser : u) : [...users, savedUser];
    showForm = false;
    alert(editingUser ? "User updated successfully" : "User created successfully");
  } catch (err) {
    console.error("Error saving user:", err);
    alert(`Failed to save user: ${err.message}`);
  }
}
  
  function getUserRoleName(role) {
    switch (role) {
      case 0: return "Admin";
      case 1: return "Shipper";
      case 2: return "User";
      default: return "Unknown";
    }
  }
  
  function cancelEdit() {
    showForm = false;
  }
</script>

<div class="app">
  <Sidebar activePage="Users" />
  <div class="main-content">
    <Header {adminName} />
    <div class="user-manager">
      <div class="header-actions">
        <h1>User Management</h1>
        <button class="add-button" on:click={addNewUser}>
          <span class="material-icons">add</span> Add New User
        </button>
      </div>
      
      {#if loading}
        <div class="loading">Loading users...</div>
      {:else if error}
        <div class="error">Error: {error}</div>
      {:else}
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each users as user}
              <tr>
                <td>{user.id}</td>
                <td>{user.name || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>{user.address || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>{getUserRoleName(user.role)}</td>
                <td class="actions">
                  <button class="icon-button edit" on:click={() => editUser(user)}>
                    <span class="material-icons">edit</span>
                  </button>
                  <button class="icon-button delete" on:click={() => deleteUser(user.id)}>
                    <span class="material-icons">delete</span>
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
      
      {#if showForm}
        <div class="modal">
          <div class="modal-content">
            <span class="close" on:click={cancelEdit}>&times;</span>
            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            
            <form on:submit|preventDefault={saveUser}>
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" bind:value={formData.name} required>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" bind:value={formData.email} required>
              </div>
              
              <div class="form-group">
                <label for="address">Address</label>
                <input type="text" id="address" bind:value={formData.address}>
              </div>
              
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="text" id="phone" bind:value={formData.phone}>
              </div>
              
              <div class="form-group">
                <label for="role">Role</label>
                <select id="role" bind:value={formData.role}>
                  <option value={1}>Admin</option>
                  <option value={2}>Seller</option>
                  <option value={3}>User</option>
                </select>
              </div>

              <div class="form-group">
                  <label for="status">Status</label>
                  <select id="status" bind:value={formData.status}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
              </div>
              
              <div class="form-actions">
                <button type="button" class="cancel-button" on:click={cancelEdit}>Cancel</button>
                <button type="submit" class="save-button">Save</button>
              </div>
            </form>
          </div>
        </div>
      {/if}
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
  
  .user-manager {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 24px;
    margin: 0;
  }
  
  .add-button {
    display: flex;
    align-items: center;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 15px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .add-button .material-icons {
    margin-right: 5px;
  }
  
  .loading, .error {
    padding: 20px;
    text-align: center;
  }
  
  .error {
    color: #e74c3c;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow: hidden;
  }
  
  .data-table th, .data-table td {
    padding: 12px 15px;
    text-align: left;
  }
  
  .data-table th {
    background-color: #34495e;
    color: white;
  }
  
  .data-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 50%;
  }
  
  .edit {
    color: #3498db;
  }
  
  .delete {
    color: #e74c3c;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    max-width: 90%;
    position: relative;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 24px;
    cursor: pointer;
  }
  
  form {
    margin-top: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .form-actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .cancel-button, .save-button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .cancel-button {
    background-color: #95a5a6;
    color: white;
  }
  
  .save-button {
    background-color: #27ae60;
    color: white;
  }
</style>