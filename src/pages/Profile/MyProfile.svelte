<!-- src/pages/Profile/MyProfile.svelte -->
<script>
    import { router } from "tinro";
    import { onMount } from "svelte";
  
    let profileDetails = {
      firstName: "Kathy",
      lastName: "Berry",
      address: "",
      city: "",
      postalCode: "",
    };
  
    onMount(() => {
      const params = new URLSearchParams(window.location.search);
      profileDetails.firstName = params.get("firstName") || profileDetails.firstName;
      profileDetails.lastName = params.get("lastName") || profileDetails.lastName;
      profileDetails.address = params.get("address") || profileDetails.address;
      profileDetails.city = params.get("city") || profileDetails.city;
      profileDetails.postalCode = params.get("postalCode") || profileDetails.postalCode;
    });
  
    function saveProfile() {
      if (!profileDetails.firstName || !profileDetails.lastName || !profileDetails.address || !profileDetails.city || !profileDetails.postalCode) {
        alert("Please fill in all fields!");
        return;
      }
      const params = new URLSearchParams({
        firstName: profileDetails.firstName,
        lastName: profileDetails.lastName,
        address: profileDetails.address,
        city: profileDetails.city,
        postalCode: profileDetails.postalCode,
      }).toString();
      alert("Profile updated successfully!");
      router.goto(`/profile?${params}`);
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
        <input type="text" id="first-name" bind:value={profileDetails.firstName} placeholder="First Name" />
      </div>
      <div class="form-group">
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" bind:value={profileDetails.lastName} placeholder="Last Name" />
      </div>
      <div class="form-group">
        <label for="address">Address</label>
        <input type="text" id="address" bind:value={profileDetails.address} placeholder="Address" />
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <input type="text" id="city" bind:value={profileDetails.city} placeholder="City" />
      </div>
      <div class="form-group">
        <label for="postal-code">Postal Code</label>
        <input type="text" id="postal-code" bind:value={profileDetails.postalCode} placeholder="Postal Code" />
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