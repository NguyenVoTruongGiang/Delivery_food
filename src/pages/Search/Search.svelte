<!-- src/Search.svelte -->
<script>
  import { onMount } from "svelte";
  import SlideBarHome from "../Home/SlideBarHome.svelte";

  // Danh sách từ khóa gợi ý
  let searchKeywords = [
    "burger",
    "vegetarian",
    "healthy",
    "fast food",
    "salad",
    "snacks",
    "sandwich",
    "sushi",
    "pizza",
    "kebab",
    "thai",
    "lunch",
    "wings",
    "desserts",
  ];

  // Dữ liệu giả lập cho nhà hàng/món ăn
  let items = [];
  let searchTerm = "";
  let searchResults = [];
  let categories = []; // Lấy từ API
  let selectedCategory = "";
  const baseUrl = "http://localhost:8080";

  // Lấy danh sách danh mục
  async function fetchCategories() {
    try {
      const response = await fetch(`${baseUrl}/products/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      categories = await response.json();
      console.log("Categories fetched:", categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      categories = [];
    }
  }

  // call api search
  // Hàm tìm kiếm
  async function performSearch(term) {
    if (!term) {
      searchResults = [];
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/products/search?keyword=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Giả sử API trả về danh sách sản phẩm trực tiếp
      searchResults = data;
    } catch (error) {
      console.error("Lỗi khi gọi API tìm kiếm:", error);
      searchResults = [];
    }
  }

  async function getProductsByCategory(category) {
    try {
      const response = await fetch(`${baseUrl}/products/category?category=${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      searchResults = data;
    } catch (error) {
      console.error("Lỗi khi gọi API danh mục:", error);
      searchResults = [];
    }
  }

  // Xử lý tìm kiếm khi người dùng nhập vào thanh tìm kiếm
  function handleInputSearch() {
    selectedCategory = "";
    performSearch(searchTerm);
  }

  // Xử lý tìm kiếm khi người dùng click vào thẻ từ khóa
  function handleKeywordSearch(keyword) {
    selectedCategory = "";
    searchTerm = keyword;
    performSearch(keyword);
  }

  function handleCategorySelect(category) {
    selectedCategory = category;
    searchTerm = "";
    getProductsByCategory(category);
  }

  onMount(async () => {
    await fetchCategories();
  });
</script>

<div class="search-page">
  <!-- Header -->
  <header>
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        placeholder="Search"
        bind:value={searchTerm}
        on:input={handleInputSearch}
      />
    </div>
  </header>

  <!-- Search Keywords (hiển thị khi chưa có từ khóa tìm kiếm) -->
  {#if !searchTerm}
    <section class="search-keywords">
      {#each searchKeywords as keyword}
        <button
          class="keyword-tag"
          on:click={() => handleKeywordSearch(keyword)}
        >
          {keyword}
        </button>
      {/each}
    </section>
  {/if}

  <!-- Search Results -->
  {#if searchResults.length > 0}
    <section class="search-results">
      <h3>Search Results</h3>
      {#each searchResults as result}
        <div class="result-item">
          <img src={result.image} alt={result.name} />
          <div class="result-info">
            <h4>{result.name}</h4>
            <p>{result.price}</p>
          </div>
        </div>
      {/each}
    </section>
  {/if}

  <!-- No Results -->
  {#if searchTerm && searchResults.length === 0}
    <section class="no-results">
      <p>No results found for "{searchTerm}".</p>
    </section>
  {/if}

  <!-- Bottom Navigation -->
  <!-- <SlideBarHome /> -->
</div>

<style>
  /* Reset and Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  .search-page {
    background-color: #fff;
    min-height: 100vh;
    padding: 20px;
    padding-bottom: 70px; /* Space for bottom navigation */
  }

  /* Header */
  header {
    margin-bottom: 20px;
  }

  .search-bar {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 25px;
  }

  .search-bar .search-icon {
    font-size: 20px;
    color: #888;
    margin-right: 10px;
  }

  .search-bar input {
    flex: 1;
    border: none;
    background: none;
    font-size: 16px;
    outline: none;
  }

  /* Search Keywords */
  .search-keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .keyword-tag {
    background-color: #ff8c00;
    color: #fff;
    border: none;
    padding: 8px 15px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
  }

  .keyword-tag:hover {
    background-color: #e67e22;
  }

  /* Search Results */
  .search-results {
    margin-top: 20px;
  }

  .search-results h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .result-item {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .result-item img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
    margin-right: 15px;
  }

  .result-info h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .result-info p {
    font-size: 14px;
    color: #ff4d4f;
  }

  /* No Results */
  .no-results {
    margin-top: 20px;
    text-align: center;
  }

  .no-results p {
    font-size: 16px;
    color: #888;
  }

  /* Bottom Navigation */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: #888;
  }

  .nav-item.active {
    color: #ff4d4f;
  }

  .nav-item .icon {
    font-size: 20px;
    margin-bottom: 5px;
  }
</style>
