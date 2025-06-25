<!-- src/pages/product/Category.svelte -->
<script>
  export let categories = [
    "Pizza",
    "Tráng miệng",
    "Bánh mì",
    "Mì",
    "Gà",
    "Rau",
    "Burger",
    "Canh"
  ];
  export let selectedCategory = "";
  export let onCategorySelect;

  function handleCategoryClick(category) {
    selectedCategory = category;
    onCategorySelect(category);
  }
</script>

<section class="categories">
  <div class="category-list">
    {#each categories as category}
      <button
        class="category-tag"
        class:active={selectedCategory === category}
        on:click={() => handleCategoryClick(category)}
      >
        {category}
      </button>
    {/each}
  </div>
</section>

<style>
  .categories {
    margin: 20px;
  }

  .category-list {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .category-tag {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .category-tag:hover {
    background-color: #ff4d4f;
    color: #fff;
    border-color: #ff4d4f;
  }

  .category-tag.active {
    background-color: #ff4d4f;
    color: #fff;
    border-color: #ff4d4f;
  }

  /* Mobile (≤640px) */
  @media (max-width: 640px) {
    .categories {
      margin: 10px;
    }

    .category-tag {
      font-size: 12px;
      padding: 6px 12px;
    }
  }

  /* Tablet (641px–1024px) */
  @media (min-width: 641px) and (max-width: 1024px) {
    .categories {
      margin: 15px;
    }

    .category-tag {
      font-size: 13px;
      padding: 7px 14px;
    }
  }

  /* PC (≥1025px) */
  @media (min-width: 1025px) {
    .categories {
      margin: 20px;
    }

    .category-tag {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
</style>