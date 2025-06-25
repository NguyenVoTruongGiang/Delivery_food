<script>
  import Sidebar from "../AdminPage/Sidebar.svelte";
  import Header from "../AdminPage/Header.svelte";
  import { onMount } from "svelte";

  let adminName = localStorage.getItem("user.name") || "Admin";
  let products = [];
  let categories = [];
  let loading = true;
  let error = null;
  let showDetailsModal = false;
  let showEditModal = false;
  let showAddModal = false;
  let selectedProduct = null;
  let formData = { name: "", image: "", price: 0, category: "", description: "", available: true };
  let formLoading = false;
  let formError = null;

  onMount(async () => {
    await Promise.all([fetchProducts(), fetchCategories()]);
  });

  async function fetchProducts() {
    loading = true;
    error = null;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        error = "Authentication required. Please log in.";
        window.location.href = "/login";
        return;
      }

      const response = await fetch("http://localhost:8080/api/admin/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    });

      if (!response.ok) {
        if (response.status === 401) {
          error = "Session expired. Redirecting to login...";
          setTimeout(() => (window.location.href = "/login"), 2000);
          return;
        }
        const errorText = await response.text();
        console.error(`Server error (${response.status}):`, errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${errorText || response.statusText}`);
      }

      const data = await response.json();
      products = Array.isArray(data) ? data : data.data || [];
      console.log("Products fetched:", products);
    } catch (err) {
      console.error("Error fetching products:", err);
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function fetchCategories() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/admin/products/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    });

      if (!response.ok) {
        console.error("Failed to fetch categories:", response.status);
        return;
      }
      categories = await response.json();
      if (categories.length > 0 && !formData.category) {
        formData.category = categories[0]; // Default to first category
      }
      console.log("Categories fetched:", categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  function openDetails(product) {
    selectedProduct = product;
    showDetailsModal = true;
  }

  function openEdit(product) {
    selectedProduct = product;
    formData = {
      name: product.name || "",
      image: product.image || "",
      price: product.price || 0,
      category: product.category || categories[0] || "",
      description: product.description || "",
      available: product.available ?? true,
    };
    showEditModal = true;
  }

  function openAdd() {
    formData = { name: "", image: "", price: 0, category: categories[0] || "", description: "", available: true };
    showAddModal = true;
  }

  function closeModals() {
    showDetailsModal = false;
    showEditModal = false;
    showAddModal = false;
    selectedProduct = null;
    formError = null;
  }

  async function saveProduct(isAdd = false) {
    formLoading = true;
    formError = null;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        formError = "Authentication required. Please log in.";
        window.location.href = "/login";
        return;
      }

      const url = isAdd
        ? "http://localhost:8080/api/admin/products/addProduct"
        : `http://localhost:8080/api/admin/products/${selectedProduct.id}`;
      const method = isAdd ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          formError = "Session expired. Redirecting to login...";
          setTimeout(() => (window.location.href = "/login"), 20000);
          return;
        }
        const errorText = await response.text();
        console.error(`Server error (${response.status}):`, errorText);
        throw new Error(`Failed to ${isAdd ? "add" : "update"} product: ${response.status} ${errorText || response.statusText}`);
      }

      const updatedProduct = await response.json();
      await fetchProducts(); // Reload products via AJAX
      console.log(`Product ${isAdd ? "added" : "updated"}:`, updatedProduct);
      closeModals();
    } catch (err) {
      console.error(`Error ${isAdd ? "adding" : "updating"} product:`, err);
      formError = err.message;
    } finally {
      formLoading = false;
    }
  }
</script>

<div class="app">
  <Sidebar activePage="Products" />
  <div class="main-content">
    <Header {adminName} />
    <div class="product-manager">
      <div class="header">
        <h1>Product Management</h1>
        <button class="add-button" on:click={openAdd}>
          <span class="icon">＋</span> Add Product
        </button>
      </div>

      {#if loading}
        <div class="loading">
          <div class="spinner"></div>
          Loading products...
        </div>
      {:else if error}
        <div class="error">
          <span>{error}</span>
          <button on:click={fetchProducts}>Retry</button>
        </div>
      {:else if products.length > 0}
        <div class="product-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Description</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each products as product}
                <tr>
                  <td>{product.name}</td>
                  <td>€{product.price.toFixed(2)}</td>
                  <td>{product.category || "N/A"}</td>
                  <td class="description-cell">{product.description || "N/A"}</td>
                  <td>
                    <span class={product.available ? "available" : "unavailable"}>
                      {product.available ? "Yes" : "No"}
                    </span>
                  </td>
                  <td class="action-cell">
                    <button class="action-button details" on:click={() => openDetails(product)}>
                      Details
                    </button>
                    <button class="action-button edit" on:click={() => openEdit(product)}>
                      Edit
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="empty">No products found.</div>
      {/if}

      {#if showDetailsModal && selectedProduct}
        <div class="modal">
          <div class="modal-content">
            <button class="close-button" on:click={closeModals}>×</button>
            <h2>Product Details</h2>
            <div class="detail-group">
              <label>Name:</label>
              <span>{selectedProduct.name}</span>
            </div>
            {#if selectedProduct.image}
              <div class="detail-group">
                <label>Image:</label>
                <img src={selectedProduct.image} alt={selectedProduct.name} class="detail-image" />
              </div>
            {/if}
            <div class="detail-group">
              <label>Price:</label>
              <span>€{selectedProduct.price.toFixed(2)}</span>
            </div>
            <div class="detail-group">
              <label>Category:</label>
              <span>{selectedProduct.category || "N/A"}</span>
            </div>
            <div class="detail-group">
              <label>Description:</label>
              <span>{selectedProduct.description || "N/A"}</span>
            </div>
            <div class="detail-group">
              <label>Available:</label>
              <span>{selectedProduct.available ? "Yes" : "No"}</span>
            </div>
            <div class="modal-actions">
              <button class="action-button secondary" on:click={closeModals}>Close</button>
            </div>
          </div>
        </div>
      {/if}

      {#if (showEditModal || showAddModal) && (selectedProduct || showAddModal)}
        <div class="modal">
          <div class="modal-content">
            <button class="close-button" on:click={closeModals}>×</button>
            <h2>{showAddModal ? "Add Product" : "Edit Product"}</h2>
            <form on:submit|preventDefault={() => saveProduct(showAddModal)}>
              <div class="form-group">
                <label for="name">Name</label>
                <input id="name" type="text" bind:value={formData.name} required />
              </div>
              <div class="form-group">
                <label for="image">Image URL</label>
                <input id="image" type="text" bind:value={formData.image} />
              </div>
              <div class="form-group">
                <label for="price">Price (€)</label>
                <input id="price" type="number" min="0" step="0.01" bind:value={formData.price} required />
              </div>
              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" bind:value={formData.category} required>
                  {#each categories as category}
                    <option value={category}>{category}</option>
                  {/each}
                </select>
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" bind:value={formData.description} rows="4" />
              </div>
              <div class="form-group">
                <label for="available">Available</label>
                <input id="available" type="checkbox" bind:checked={formData.available} />
              </div>
              {#if formError}
                <div class="error">{formError}</div>
              {/if}
              <div class="modal-actions">
                <button type="button" class="action-button secondary" on:click={closeModals} disabled={formLoading}>
                  Cancel
                </button>
                <button type="submit" class="action-button primary" disabled={formLoading}>
                  {#if formLoading}
                    <div class="spinner small"></div>
                    Saving...
                  {:else}
                    {showAddModal ? "Create" : "Save"}
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

  .product-manager {
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

  .product-table {
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

  .description-cell {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

  .action-button.details {
    background: #3b82f6;
    color: #ffffff;
  }

  .action-button.details:hover {
    background: #2563eb;
  }

  .action-button.edit {
    background: #10b981;
    color: #ffffff;
  }

  .action-button.edit:hover {
    background: #059669;
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

  .detail-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-group label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  .detail-group span {
    font-size: 14px;
    color: #1f2a44;
  }

  .detail-image {
    width: 100%;
    max-width: 200px;
    height: auto;
    border-radius: 8px;
    margin-top: 8px;
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
  .form-group textarea,
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
  .form-group textarea:focus,
  .form-group select:focus {
    border-color: #ff4d4f;
    outline: none;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
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

    .product-manager {
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

    .description-cell {
      max-width: 200px;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border-width: 3px;
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
    .product-table {
      font-size: 12px;
    }

    th,
    td {
      padding: 8px;
    }

    .description-cell {
      max-width: 150px;
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

    .detail-image {
      max-width: 150px;
    }

    .add-button {
      padding: 6px 12px;
      font-size: 13px;
    }
  }
</style>