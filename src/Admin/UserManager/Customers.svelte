<script>
  import Sidebar from "../AdminPage/Sidebar.svelte";
  import Header from "../AdminPage/Header.svelte";
  import { onMount } from "svelte";

  let adminName = localStorage.getItem("user.name") || "Admin";
  let users = [];
  let url = "http://localhost:8080/api/admin/users";
  let loading = true;
  let error = null;

  // Form for adding/editing user
  let updateUser = null;
  let formData = {
    name: "",
    email: "",
    address: "",
    phone: "",
    role: 2,
    status: "active",
  };
  let showForm = false;
  let formLoading = false;
  let formError = null;

  onMount(async () => {
    await fetchUsers();
  });

  async function fetchUsers() {
    loading = true;
    error = null;
    try {
      const response = await fetch(`${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      users = await response.json();
      console.log("Fetched users:", users);
    } catch (err) {
      console.error("Error fetching users:", err);
      error = err.message;
    } finally {
      console.log("Users loaded:", users);
      loading = false;
    }
  }

  function openAdd() {
    updateUser = null;
    formData = {
      name: "",
      email: "",
      address: "",
      phone: "",
      role: 2,
      status: "active",
    };
    showForm = true;
  }

  function openEdit(user) {
    updateUser = user;
    formData = {
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
      phone: user.phone || "",
      role: user.role ,
      status: user.status || "active",
    };
    showForm = true;
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      users = users.filter((u) => u.id !== id);
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(`Failed to delete user: ${err.message}`);
    }
  }

  async function saveUser() {
    formLoading = true;
    formError = null;
    try {
      const url = updateUser
        ? `http://localhost:8080/api/admin/users/${updateUser.id}`
        : "http://localhost:8080/api/admin/users";
      const method = updateUser ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save user");
      const savedUser = await response.json();
      users = updateUser
        ? users.map((u) => (u.id === savedUser.id ? savedUser : u))
        : [...users, savedUser];
      showForm = false;
      alert(
        updateUser ? "User updated successfully" : "User created successfully"
      );
    } catch (err) {
      console.error("Error saving user:", err);
      formError = err.message;
    } finally {
      formLoading = false;
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
      <div class="header">
        <h1>User Management</h1>
        <button class="add-button" on:click={openAdd}>
          <span class="icon">＋</span> Add User
        </button>
      </div>

      {#if loading}
        <div class="loading">
          <div class="spinner"></div>
          Loading users...
        </div>
      {:else if error}
        <div class="error">
          <span>{error}</span>
          <button on:click={fetchUsers}>Retry</button>
        </div>
      {:else if users.length > 0}
        <div class="user-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each users as user}
                <tr>
                  <td>{user.id}</td>
                  <td>{user.name || "-"}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.address || "-"}</td>
                  <td>{user.phone || "-"}</td>
                  <td>{user.role}</td>
                  <td>
                    <span class={user.status === "active" ? "available" : "unavailable"}>
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td class="action-cell">
                    <button class="action-button edit" on:click={() => openEdit(user)}>
                      Edit
                    </button>
                    <button class="action-button delete" on:click={() => deleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="empty">No users found.</div>
      {/if}

      {#if showForm}
        <div class="modal">
          <div class="modal-content">
            <button class="close-button" on:click={cancelEdit}>×</button>
            <h2>{updateUser ? "Edit User" : "Add User"}</h2>
            <form on:submit|preventDefault={saveUser}>
              <div class="form-group">
                <label for="name">Name</label>
                <input id="name" type="text" bind:value={formData.name} required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" type="email" bind:value={formData.email} required />
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <input type="text" id="address" bind:value={formData.address} />
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="text" id="phone" bind:value={formData.phone} />
              </div>
              <div class="form-group">
                <label for="role">Role</label>
                <select id="role" bind:value={formData.role}>
                  <option value={1}>ADMIN</option>
                  <option value={2}>CUSTOMER</option>
                  <option value={3}>SHIPPER</option>
                </select>
              </div>
              <div class="form-group">
                <label for="status">Status</label>
                <select id="status" bind:value={formData.status}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              {#if formError}
                <div class="error">{formError}</div>
              {/if}
              <div class="modal-actions">
                <button type="button" class="action-button secondary" on:click={cancelEdit} disabled={formLoading}>
                  Cancel
                </button>
                <button type="submit" class="action-button primary" disabled={formLoading}>
                  {#if formLoading}
                    <div class="spinner small"></div>
                    Saving...
                  {:else}
                    {updateUser ? "Save" : "Create"}
                  {/if}
                </button>
              </div>
            </form>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: #f4f6f9;
  }

  .app {
    display: flex;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    background-color: #f4f6f9;
  }

  .user-manager {
    max-width: 1280px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 24px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1f2a44;
    margin: 0;
  }

  .add-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #30866f;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .add-button:hover {
    background: #e02424;
  }

  .add-button .icon {
    font-size: 20px;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 48px;
    font-size: 18px;
    font-weight: 500;
    color: #6b7280;
  }

  .spinner {
    width: 28px;
    height: 28px;
    border: 4px solid #ff4d4f;
    border-top: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .spinner.small {
    width: 20px;
    height: 20px;
    border-width: 3px;
    margin-right: 8px;
    display: inline-block;
    vertical-align: middle;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    text-align: center;
    padding: 48px;
    font-size: 18px;
    font-weight: 500;
    color: #dc2626;
    background: #fef2f2;
    border-radius: 8px;
  }

  .error button {
    margin-top: 16px;
    padding: 10px 24px;
    background: #ff4d4f;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: background 0.3s ease;
  }

  .error button:hover {
    background: #e02424;
  }

  .empty {
    text-align: center;
    padding: 48px;
    font-size: 18px;
    font-weight: 500;
    color: #6b7280;
    background: #f9fafb;
    border-radius: 8px;
  }

  .user-table {
    overflow-x: auto;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
  }

  thead {
    background: #f9fafb;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  th {
    padding: 16px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    border-bottom: 2px solid #e5e7eb;
  }

  td {
    padding: 16px;
    font-size: 14px;
    color: #1f2a44;
    border-bottom: 1px solid #f3f4f6;
  }

  .action-cell {
    display: flex;
    gap: 8px;
  }

  .action-button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .action-button.edit {
    background: #10b981;
    color: #ffffff;
  }

  .action-button.edit:hover {
    background: #059669;
  }

  .action-button.delete {
    background: #ef4444;
    color: #ffffff;
  }

  .action-button.delete:hover {
    background: #dc2626;
  }

  .available {
    color: #22c55e;
    font-weight: 600;
  }

  .unavailable {
    color: #ef4444;
    font-weight: 600;
  }

  tr:hover {
    background: #f9fafb;
    transition: background 0.2s ease;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    position: relative;
  }

  .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .close-button:hover {
    color: #1f2a44;
  }

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1f2a44;
    margin-bottom: 16px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #1f2a44;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus,
  .form-group select:focus {
    border-color: #ff4d4f;
    outline: none;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  .action-button.primary {
    background: #ff4d4f;
    color: #ffffff;
  }

  .action-button.primary:hover {
    background: #e02424;
  }

  .action-button.secondary {
    background: #e5e7eb;
    color: #1f2a44;
  }

  .action-button.secondary:hover {
    background: #d1d5db;
  }

  .action-button:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 16px;
    }

    .user-manager {
      padding: 16px;
    }

    h1,
    h2 {
      font-size: 24px;
    }

    th,
    td {
      padding: 12px;
      font-size: 13px;
    }

    .action-cell {
      flex-direction: column;
      gap: 4px;
    }

    .action-button {
      padding: 6px 12px;
      font-size: 12px;
    }

    .loading,
    .error,
    .empty {
      font-size: 16px;
      padding: 32px;
    }

    .modal-content {
      padding: 16px;
      max-width: 95%;
    }

    .add-button {
      padding: 8px 16px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .user-table {
      font-size: 12px;
    }

    th,
    td {
      padding: 8px;
    }

    .action-cell {
      flex-direction: column;
      gap: 4px;
    }

    .action-button {
      padding: 6px 12px;
      font-size: 12px;
    }

    .loading,
    .error,
    .empty {
      font-size: 16px;
      padding: 32px;
    }

    .add-button {
      padding: 6px 12px;
      font-size: 13px;
    }
  }
</style>