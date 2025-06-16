<script>
  import Sidebar from "../AdminPage/Sidebar.svelte";
  import Header from "../AdminPage/Header.svelte";
  import { onMount } from 'svelte';
  
  let adminName = "Admin";
  let products = [];
  let categories = [];
  let loading = true;
  let error = null;
  
  // Form for adding/editing product
  let editingProduct = null;
  let formData = {
    name: "",
    price: 0,
    description: "",
    category: "",
    image_url: "",
    restaurant_id: 1
  };
  
  let showForm = false;
  
  onMount(async () => {
    await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);
  });
  
  async function fetchProducts() {
    loading = true;
    error = null;
    try {
      const response = await fetch("http://localhost:8080/api/admin/products", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch products");
      products = await response.json();
    } catch (err) {
      console.error("Error fetching products:", err);
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:8080/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      categories = await response.json();
    } catch (err) {
      console.error("Error fetching categories:", err);
      categories = [];
    }
  }
  
  function addNewProduct() {
    editingProduct = null;
    formData = {
      name: "",
      price: 0,
      description: "",
      category: categories.length > 0 ? categories[0].name : "",
      image_url: "",
      restaurant_id: 1
    };
    showForm = true;
  }
  
  function editProduct(product) {
    editingProduct = product;
    formData = {
      name: product.name || "",
      price: product.price || 0,
      description: product.description || "",
      category: product.category || "",
      image_url: product.image_url || "",
      restaurant_id: product.restaurant_id || 1
    };
    showForm = true;
  }
  
  async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to delete product");
      
      // Remove product from list
      products = products.filter(p => p.id !== id);
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(`Failed to delete product: ${err.message}`);
    }
  }
  
  async function saveProduct() {
    try {
      // Ensure price is a number
      formData.price = Number(formData.price);
      
      const url = editingProduct 
        ? `http://localhost:8080/api/admin/products/${editingProduct.id}` 
        : "http://localhost:8080/api/admin/products";
      
      const method = editingProduct ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("Failed to save product");
      
      const savedProduct = await response.json();
      
      if (editingProduct) {
        // Update existing product in the list
        products = products.map(p => p.id === savedProduct.id ? savedProduct : p);
      } else {
        // Add new product to the list
        products = [...products, savedProduct];
      }
      
      showForm = false;
      alert(editingProduct ? "Product updated successfully" : "Product created successfully");
    } catch (err) {
      console.error("Error saving product:", err);
      alert(`Failed to save product: ${err.message}`);
    }
  }
  
  function cancelEdit() {
    showForm = false;
  }
  
  function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
</script>

<div class="app">
  <Sidebar activePage="Products" />
  <div class="main-content">
    <Header {adminName} />
    <div class="product-manager">
      <div class="header-actions">
        <h1>Product Management</h1>
        <button class="add-button" on:click={addNewProduct}>
          <span class="material-icons">add</span> Add New Product
        </button>
      </div>
      
      {#if loading}
        <div class="loading">Loading products...</div>
      {:else if error}
        <div class="error">Error: {error}</div>
      {:else}
        <div class="product-grid">
          {#each products as product}
            <div class="product-card">
              <div class="product-image">
                {#if product.image_url}
                  <img src={product.image_url} alt={product.name} />
                {:else}
                  <div class="no-image">No Image</div>
                {/if}
              </div>
              <div class="product-info">
                <h3>{product.name}</h3>
                <p class="price">{formatPrice(product.price)}</p>
                <p class="category">{product.category || 'No Category'}</p>
                <p class="description">{product.description || 'No description'}</p>
              </div>
              <div class="product-actions">
                <button class="icon-button edit" on:click={() => editProduct(product)}>
                  <span class="material-icons">edit</span>
                </button>
                <button class="icon-button delete" on:click={() => deleteProduct(product.id)}>
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
      
      {#if showForm}
        <div class="modal">
          <div class="modal-content">
            <span class="close" on:click={cancelEdit}>&times;</span>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form on:submit|preventDefault={saveProduct}>
              <div class="form-group">
                <label for="name">Product Name</label>
                <input type="text" id="name" bind:value={formData.name} required>
              </div>
              
              <div class="form-group">
                <label for="price">Price (VND)</label>
                <input type="number" id="price" bind:value={formData.price} min="0" required>
              </div>
              
              <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" bind:value={formData.description} rows="3"></textarea>
              </div>
              
              <div class="form-group">
                <label for="category">Category</label>
                <select id="category" bind:value={formData.category}>
                  {#each categories as category}
                    <option value={category.name}>{category.name}</option>
                  {/each}
                </select>
              </div>
              
              <div class="form-group">
                <label for="image_url">Image URL</label>
                <input type="text" id="image_url" bind:value={formData.image_url}>
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
  
  .product-manager {
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
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .product-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .product-image {
    height: 200px;
    overflow: hidden;
    position: relative;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #ecf0f1;
    color: #7f8c8d;
  }
  
  .product-info {
    padding: 15px;
    flex: 1;
  }
  
  .product-info h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
  }
  
  .price {
    font-weight: bold;
    color: #e74c3c;
    margin: 5px 0;
  }
  
  .category {
    color: #7f8c8d;
    font-size: 14px;
    margin: 5px 0;
  }
  
  .description {
    margin: 10px 0;
    font-size: 14px;
    color: #34495e;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .product-actions {
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    background-color: #f9f9f9;
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
    max-height: 90vh;
    overflow-y: auto;
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
  
  input, select, textarea {
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