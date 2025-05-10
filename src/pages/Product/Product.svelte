<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
  
    let token = writable(null);
    let products = writable([]);
    let filteredProducts = writable([]);
    let searchQuery = writable("");
    let filters = writable({});
  
    onMount(async () => {
      const storedToken = await SecureStore.getItem("userToken");
      if (storedToken) {
        token.set(storedToken);
      }
      products.set(productData);
      filteredProducts.set(productData);
    });
  
    $: $products, $searchQuery, $filters, filteredProducts.set(applyFilters());
  
    function handleApplyFilter(newFilters) {
      filters.set(newFilters);
    }
  
    function applyFilters() {
      let result = [...$products];
  
      if ($searchQuery) {
        result = result.filter(product => product.name.toLowerCase().includes($searchQuery.toLowerCase()));
      }
  
      if ($filters.minPrice && $filters.maxPrice) {
        result = result.filter(product => product.price >= $filters.minPrice && product.price <= $filters.maxPrice);
      }
  
      if ($filters.category) {
        result = result.filter(product => product.category === $filters.category.name);
      }
  
      return result;
    }
  
    function handleSearch(query) {
      searchQuery.set(query);
    }
  
    function handleClearFilters() {
      searchQuery.set("");
      filters.set({});
    }
  </script>
  
  <main style="flex: 1; width: 100%;">
    <!-- <div style="display: flex; margin-left: 10px; margin: 2%; width: 100%; align-items: center;">
      <SearchBar onSearch={handleSearch} />
      <SortBar onApplyFilter={handleApplyFilter} onClearFilters={handleClearFilters} />
    </div> -->
  
    <div style="flex: 1; width: 100%;">
    </div>
  
    <!-- <button style="position: absolute; bottom: 10px; right: 10px; border-radius: 50%; z-index: 1; background-color: #704F38;" on:click={() => navigate("Favorites")}>
      <Ionicons name="heart" />
    </button> -->
  </main>