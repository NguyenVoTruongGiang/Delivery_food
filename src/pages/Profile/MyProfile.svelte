<!-- src/pages/Profile/MyProfile.svelte -->
<script>
  import { onMount } from "svelte";
  import { router } from "tinro";

  const userId = Number(localStorage.getItem("user_id"));
  const token = localStorage.getItem("token");

  let profileDetails = {
    email: "",
    name: "",
    address: "",
    phone: "",
  };

  // Lấy thông tin user khi vào trang
  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const user = await response.json();
      // Gán dữ liệu vào profileDetails (tùy theo cấu trúc User entity của bạn)
      profileDetails.email = user.email || "";
      profileDetails.name = user.name || "";
      profileDetails.address = user.address || "";
      profileDetails.phone = user.phone || "";
    } catch (e) {
      alert("Không thể lấy thông tin user!");
    }
  });

  // Hàm lưu profile (update)
  async function saveProfile() {
    if (
      !profileDetails.email ||
      !profileDetails.name ||
      !profileDetails.address ||
      !profileDetails.phone
    ) {
      alert("Please fill in all fields!");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileDetails),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully!");
      router.goto("/profile");
    } catch (e) {
      alert("Cập nhật thất bại!");
    }
  }

  function cancel() {
    router.goto("/profile");
  }
</script>
  
  <div class="my-profile-page">
    <header>
      <button class="back-btn" on:click={() => history.back()}>⬅️</button>
      <h1>My Profile</h1>
    </header>
  
    <section class="profile-form">
      <div class="form-group">
        <label for="first-name">First Name</label>
        <input type="text" id="first-name" bind:value={profileDetails.firstName} placeholder="Name" />
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <input type="text" id="address" bind:value={profileDetails.address} placeholder="Address" />
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <input type="email" id="email" bind:value={profileDetails.email} placeholder="Email" />
      </div>
      <div class="form-group">
        <label for="postal-code">phone</label>
        <input type="text" id="postal-code" bind:value={profileDetails.phone} placeholder="phone" />
      </div>
      <div class="form-actions">
        <button class="save-btn" on:click={saveProfile}>Save Profile</button>
        <button class="cancel-btn" on:click={cancel}>Cancel</button>
      </div>
    </section>
  </div>
  
  <style>
    .my-profile-page {
      background-color: #f5f5f5;
      min-height: 100vh;
      padding: 20px;
    }
  
    header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
  
    .back-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      margin-right: 10px;
    }
  
    h1 {
      font-size: 24px;
      font-weight: bold;
    }
  
    .profile-form {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  
    .form-group {
      margin-bottom: 15px;
    }
  
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
    }
  
    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 14px;
    }
  
    .form-actions {
      display: flex;
      gap: 10px;
    }
  
    .save-btn,
    .cancel-btn {
      background-color: #ff8c00;
      color: #fff;
      border: none;
      padding: 10px;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      width: 100%;
    }
  
    .save-btn {
      background-color: #28a745;
    }
  
    .cancel-btn {
      background-color: #dc3545;
    }
  
    .save-btn:hover {
      background-color: #218838;
    }
  
    .cancel-btn:hover {
      background-color: #c82333;
    }
  </style>