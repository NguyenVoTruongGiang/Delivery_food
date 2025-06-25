<script>
  import { onMount } from 'svelte';
  export let onProductDetail;
  
  // State variables
  let favorites = [];
  let loading = true;
  let error = null;
  let token = localStorage.getItem('token') || '';

  function goToProductDetail(product) {
    onProductDetail(product);
  }
  
  // Fetches the user's favorite products
  async function fetchFavorites() {
    loading = true;
    error = null;
    
    try {
      if (!token) {
        console.log("No authentication token available");
        favorites = [];
        return;
      }
      
      const response = await fetch('http://localhost:8080/favorite/take-product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Log the response to see its structure
      
      // Handle the data based on its actual structure
      if (data && Array.isArray(data)) {
        // If data is already an array
        favorites = data;
      } else if (data && data.products && Array.isArray(data.products)) {
        // If data has a products array
        favorites = data.products;
      } else if (data && typeof data === 'object') {
        // If data is an object but not structured as expected
        const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          favorites = possibleArrays[0];
        } else {
          favorites = []; // Empty array if no arrays found in response
          console.warn("Response doesn't contain an array of favorites:", data);
        }
      } else {
        // Fallback to empty array
        favorites = [];
        console.warn("Unexpected response format:", data);
      }
      
      console.log("Processed favorites:", favorites);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      error = err.message;
      favorites = [];
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    fetchFavorites();
  });
</script>

<main>
  <div class="favorite-page">
    <!-- Header -->
    <header>
      <div class="time">{new Date().toLocaleTimeString()}</div>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search favorites" />
      </div>
    </header>

    <!-- Favorite Items -->
    <section class="favorite-items">
      {#if loading}
        <p>Loading favorites...</p>
      {:else if error}
        <p>Error: {error}</p>
      {:else if favorites.length === 0}
        <p>No favorites found</p>
      {:else}
        <!-- Render your favorites here -->
        <div class="favorites-grid">
          {#each favorites as favorite (favorite.id)}
            <div class="favorite-item" 
            on:click={() => goToProductDetail(favorite)}
            on:keydown={(e) => e.key === "Enter" && goToProductDetail(favorite)}
            role="button"
            tabindex="0">
              <img src="{favorite.image}" alt="">
              <h3>{favorite.name || "Unknown Product"}</h3>
              <p>{favorite.description}</p>
              <p>
                {favorite.price ? `${favorite.price}đ` : "Price not available"}
              </p>
              <!-- Add more fields based on your actual data structure -->
            </div>
          {/each}
        </div>
      {/if}
    </section>
  </div>
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Inter var", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .favorite-page {
    background: linear-gradient(135deg, #e6f0fa 0%, #f5f7fa 70%, #e0eaff 100%);
    min-height: 100vh;
    padding: 32px 48px;
    padding-bottom: 90px;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
    overflow-x: hidden;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 12px 0;
  }

  .time {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    background: rgba(255, 255, 255, 0.85);
    padding: 6px 16px;
    border-radius: 16px;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(209, 213, 219, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  }

  .search-bar {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 14px 18px;
    border-radius: 20px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(209, 213, 219, 0.4);
    width: 360px;
    transition: box-shadow 0.3s ease, transform 0.2s ease, border-color 0.3s ease;
  }

  .search-bar:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
    border-color: rgba(156, 163, 175, 0.6);
  }

  .search-bar .search-icon {
    font-size: 22px;
    color: #6b7280;
    margin-right: 14px;
    transition: color 0.3s ease;
  }

  .search-bar:hover .search-icon {
    color: #4b5563;
  }

  .search-bar input {
    flex: 1;
    border: none;
    background: none;
    font-size: 16px;
    color: #1f2937;
    outline: none;
    width: 100%;
    font-weight: 400;
  }

  .search-bar input::placeholder {
    color: #9ca3af;
    font-weight: 400;
    transition: color 0.3s ease;
  }

  .search-bar:hover input::placeholder {
    color: #6b7280;
  }

  .favorite-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin-top: 20px;
  }

  .favorite-item {
    background: rgba(255, 255, 255, 0.98);
    padding: 20px;
    border-radius: 14px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(209, 213, 219, 0.15);
    overflow: hidden;
    position: relative; /* Ensure proper positioning context */
  }

  .favorite-item:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .favorite-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(209, 213, 219, 0.2);
    transition: transform 0.3s ease;
  }

  .favorite-item:hover img {
    transform: scale(1.05);
  }

  .favorite-item h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
    line-height: 1.4;
    transition: color 0.3s ease;
  }

  .favorite-item:hover h3 {
    color: #111827;
  }

  .favorite-item p {
    font-size: 15px;
    color: #4b5563;
    margin: 0;
    line-height: 1.6;
    opacity: 0.9;
    transition: opacity 0.3s ease;
  }

  .favorite-item:hover p {
    opacity: 1;
  }

  .favorite-item p:last-child {
    font-size: 18px;
    color: #b91c1c;
    font-weight: 500;
    margin-top: 12px;
    background: linear-gradient(90deg, #b91c1c, #ef4444);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: transform 0.3s ease, opacity 0.3s ease; /* Added opacity transition */
    position: relative; /* Ensure proper positioning */
    z-index: 1; /* Bring price above any potential overflow */
  }

  .favorite-item:hover p:last-child {
    transform: scale(1.02);
    opacity: 1; /* Ensure opacity remains fully visible */
  }

  .loading,
  .error,
  .empty {
    text-align: center;
    font-size: 18px;
    color: #6b7280;
    padding: 28px;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 14px;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(209, 213, 219, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .error {
    color: #b91c1c;
  }

  @media (max-width: 1024px) {
    .favorite-page {
      padding: 24px 32px;
      padding-bottom: 70px;
    }

    .search-bar {
      width: 100%;
      padding: 12px 16px;
    }

    .favorite-items {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .favorite-item img {
      height: 160px;
    }

    .favorite-item h3 {
      font-size: 18px;
    }

    .favorite-item p {
      font-size: 14px;
    }
  }

  @media (max-width: 640px) {
    .favorite-page {
      padding: 16px 20px;
      padding-bottom: 60px;
    }

    header {
      flex-direction: column;
      gap: 16px;
    }

    .search-bar {
      padding: 10px 14px;
    }

    .favorite-items {
      grid-template-columns: 1fr;
    }

    .favorite-item {
      padding: 16px;
    }

    .favorite-item img {
      height: 140px;
    }

    .favorite-item h3 {
      font-size: 16px;
    }

    .favorite-item p {
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    .favorite-page {
      padding: 12px 16px;
    }

    .search-bar {
      padding: 8px 12px;
    }

    .favorite-item img {
      height: 120px;
    }

    .favorite-item p:last-child {
      font-size: 16px;
    }
  }
</style>