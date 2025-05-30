<!-- src/Profile.svelte -->
<script>
  export let onLogout;
  import SlideBarHome from "../Home/SlideBarHome.svelte";
  const baseUrl = "http://localhost:8080";

  const user_id = Number(localStorage.getItem("user_id"));
  const token = localStorage.getItem("token");

  let user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
  console.log(user?.name);

  if (!user) {
    // Chưa login thì chuyển hướng
    window.location.href = "/login";
  }

  // async function fetchUser() {
  //   try {
  //     const response = await fetch(`${baseUrl}/user/${user_id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch user data");
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     return null;
  //   }
  // }

  // let menuItems = [
  //   { name: "My Profile", icon: "👤" },
  //   { name: "My Orders", icon: "📦" },
  //   { name: "Delivery Address", icon: "📍" },
  //   { name: "Payment Methods", icon: "💳" },
  //   { name: "Contact Us", icon: "📞" },
  //   { name: "Help & FAQ", icon: "❓" },
  // ];

  function logout() {
    onLogout();
    console.log("đăng xuất thành công");
  }
</script>

<main>
  <div class="profile-page">
    <!-- User Info -->
    <section class="user-info">
      <!-- <img src={user.avatar} alt="Avatar" class="avatar" /> -->
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>

    <!-- Menu Items -->
    <section class="menu">
      <div class="menu-item">
        <a href="/my-profile" class="icon">👤</a>
        <a href="/my-profile">My Profile</a>
      </div>
      <div class="menu-item">
        <a href="/my-orders">
          <span class="icon">📦</span>
          <span>My Orders</span>
        </a>
      </div>
      <div class="menu-item">
        <a href="/delivery-address">
          <span class="icon">📍</span>
          <span>Delivery Address</span>
        </a>
      </div>
      <div class="menu-item">
        <a href="/payment-methods">
          <span class="icon">💳</span>
          <span>Payment Methods</span>
        </a>
      </div>
      <div class="menu-item">
        <a href="/contact-us">
          <span class="icon">📞</span>
          <span>Contact Us</span>
        </a>
      </div>
      <div class="menu-item">
        <a href="/help-faq">
          <span class="icon">❓</span>
          <span>Help & FAQ</span>
        </a>
      </div>
    </section>

    <!-- Log out Button -->
    <button class="logout-btn" on:click={logout}>Log out</button>

    <!-- Bottom Navigation -->
    <SlideBarHome />
  </div>
</main>

<style>
  /* Reset and Global Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
  }

  .profile-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20px;
    padding-bottom: 70px; /* Space for bottom navigation */
  }

  /* Header */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  /* User Info */
  .user-info {
    text-align: center;
    margin-bottom: 30px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
  }

  .user-info h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .user-info p {
    font-size: 14px;
    color: #888;
  }

  /* Menu Items */
  .menu {
    margin-bottom: 30px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .menu-item .icon {
    font-size: 20px;
    margin-right: 15px;
    color: #ff8c00;
  }

  .menu-item span {
    font-size: 16px;
    color: #333;
  }

  /* Log out Button */
  .logout-btn {
    background-color: #ff8c00;
    color: #fff;
    border: none;
    padding: 15px;
    border-radius: 25px;
    font-size: 16px;
    font-weight: bold;
    width: 100%;
    cursor: pointer;
  }

  .logout-btn:hover {
    background-color: #e67e22;
  }
</style>
