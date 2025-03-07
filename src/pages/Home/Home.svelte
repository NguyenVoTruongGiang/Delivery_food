<script>
    let location = "Jl. Soekarno Hatta 15A";
</script>

<main class="p-4 bg-gray-100 min-h-screen">
    <!-- Header -->
    <header class="flex items-center justify-between mb-4">
        <h1 class="text-lg font-semibold">🏠 Home</h1>
        <p class="text-sm text-gray-500">{location} ⌄</p>
    </header>

    <!-- Banner -->
    <div class="relative bg-orange-500 rounded-lg text-white p-4">
        <h2 class="text-lg font-bold">Get your 30% daily discount now!</h2>
        <button class="mt-2 bg-black text-white px-4 py-2 rounded-lg">Order now</button>
        <div class="absolute right-4 top-1/2 -translate-y-1/2">
            <img src="https://via.placeholder.com/80" class="rounded-lg shadow-lg" />
        </div>
    </div>

    <!-- Fastest Delivery Section -->
    <section class="mt-6">
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold">Fastest delivery 🔥</h2>
            <button class="text-orange-500 text-sm">See all</button>
        </div>

        <div class="flex space-x-4 overflow-x-auto">
            <div class="w-64 bg-white rounded-lg shadow p-3">
                <img src="https://via.placeholder.com/150" class="rounded-lg w-full h-28 object-cover" />
                <h3 class="text-sm font-semibold mt-2">Crazy Tacko</h3>
                <p class="text-xs text-gray-500">Delicious tacos, fresh ingredients...</p>
                <div class="flex items-center justify-between text-xs mt-1">
                    <span>€3.00</span>
                    <span>⏳ 40-50min</span>
                    <span>⭐ 9.5</span>
                </div>
            </div>

            <div class="w-64 bg-white rounded-lg shadow p-3">
                <img src="https://via.placeholder.com/150" class="rounded-lg w-full h-28 object-cover" />
                <h3 class="text-sm font-semibold mt-2">La Salad</h3>
                <p class="text-xs text-gray-500">Fresh and tasty salads...</p>
                <div class="flex items-center justify-between text-xs mt-1">
                    <span>€2.00</span>
                    <span>⏳ 30-40min</span>
                    <span>⭐ 9.2</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Popular Items Section -->
    <section class="mt-6">
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-semibold">Popular items 👏</h2>
            <button class="text-orange-500 text-sm">See all</button>
        </div>

        <div class="grid grid-cols-3 gap-3">
            <div class="bg-white rounded-lg shadow p-3">
                <img src="https://via.placeholder.com/100" class="rounded-lg w-full h-20 object-cover" />
            </div>
            <div class="bg-white rounded-lg shadow p-3">
                <img src="https://via.placeholder.com/100" class="rounded-lg w-full h-20 object-cover" />
            </div>
            <div class="bg-white rounded-lg shadow p-3">
                <img src="https://via.placeholder.com/100" class="rounded-lg w-full h-20 object-cover" />
            </div>
        </div>
    </section>

    <!-- Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 flex justify-around">
        <button class="text-orange-500 flex flex-col items-center">
            🔍 <span class="text-xs">Discover</span>
        </button>
        <button class="text-gray-500 flex flex-col items-center">
            🍔 <span class="text-xs"><a href="/restaurant">Restaurants</a></span>
        </button>
        <button class="text-gray-500 flex flex-col items-center">
            ❤️ <span class="text-xs">Favorite</span>
        </button>
        <button class="text-gray-500 flex flex-col items-center">
            👤 <span class="text-xs">Profile</span>
        </button>
    </nav>
</main>
