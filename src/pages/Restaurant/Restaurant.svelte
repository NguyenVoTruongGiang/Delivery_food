<script>
    let location = "Jl. Soekarno Hatta 15A";
    let categories = [
        { name: "Brunch", places: 94, image: "https://via.placeholder.com/80" },
        { name: "Sea food", places: 43, image: "https://via.placeholder.com/80" },
        { name: "Dessert", places: 38, image: "https://via.placeholder.com/80" }
    ];
    let restaurants = [
        { 
            name: "Tasty bowl", 
            description: "Choose from a variety of bowl options and tas...", 
            price: "€1.00", 
            deliveryTime: "40-50min", 
            rating: "9.2", 
            image: "https://via.placeholder.com/300" 
        }
    ];
</script>

<main class="p-4 bg-gray-100 min-h-screen">
    <!-- Header -->
    <header class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-2">
            <span class="text-orange-500">🏠</span>
            <h1 class="text-lg font-semibold">Home</h1>
        </div>
        <p class="text-sm text-gray-500">{location} ⌄</p>
        <button class="text-gray-500">⏸️</button>
    </header>

    <!-- Title -->
    <h2 class="text-2xl font-bold mb-4">Restaurants</h2>

    <!-- Categories -->
    <section class="mb-6">
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold">Categories</h3>
            <button class="text-orange-500 text-sm">See all</button>
        </div>
        <div class="flex space-x-4 overflow-x-auto">
            {#each categories as category}
                <div class="w-28 bg-white rounded-lg shadow p-3 text-center">
                    <img src={category.image} class="rounded-lg w-full h-20 object-cover" />
                    <h4 class="text-sm font-semibold mt-2">{category.name}</h4>
                    <p class="text-xs text-gray-500">{category.places} places</p>
                </div>
            {/each}
        </div>
    </section>

    <!-- All Restaurants -->
    <section class="mb-16">
        <h3 class="text-lg font-semibold mb-2">All restaurants</h3>
        {#each restaurants as restaurant}
            <div class="bg-white rounded-lg shadow p-3 mb-3">
                <img src={restaurant.image} class="rounded-lg w-full h-32 object-cover" />
                <h4 class="text-lg font-semibold mt-2">{restaurant.name}</h4>
                <p class="text-sm text-gray-500">{restaurant.description}</p>
                <div class="flex items-center justify-between text-xs mt-1">
                    <span>{restaurant.price}</span>
                    <span>⏳ {restaurant.deliveryTime}</span>
                    <span>⭐ {restaurant.rating}</span>
                </div>
            </div>
        {/each}
    </section>

    <!-- Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 flex justify-around">
        <button class="text-gray-500 flex flex-col items-center">
            🔍 <span class="text-xs">Discover</span>
        </button>
        <button class="text-orange-500 flex flex-col items-center">
            🍽️ <span class="text-xs">Restaurants</span>
        </button>
        <button class="text-gray-500 flex flex-col items-center">
            🔎 <span class="text-xs">Search</span>
        </button>
        <button class="text-gray-500 flex flex-col items-center">
            ❤️ <span class="text-xs">Favorite</span>
        </button>
        <button class="text-gray-500 flex flex-col items-center">
            👤 <span class="text-xs">Profile</span>
        </button>
    </nav>
</main>
