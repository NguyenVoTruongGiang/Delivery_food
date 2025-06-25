<script>
  export let adminName;
  
  let currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
</script>

<header>
  <div class="date">{currentDate}</div>
  <div class="profile">
    <span class="greeting">{adminName}</span>
    <!-- <div class="avatar">
      <span class="material-icons">account_circle</span>
    </div> -->
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
  
  .date {
    font-size: 14px;
    color: #7f8c8d;
  }
  
  .profile {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .greeting {
    padding: 10px;
    font-size: 14px;
  }
  
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #3498db;
    color: white;
    border-radius: 50%;
    cursor: pointer;
  }
</style>