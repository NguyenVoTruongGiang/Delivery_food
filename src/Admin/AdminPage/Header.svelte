<!-- src/components/Header.svelte -->
<script>
    export let adminName;
  </script>
  
  <div class="header">
    <div class="user">
      <img src="https://via.placeholder.com/40" alt="User" />
      <span>{adminName}</span>
    </div>
  </div>
  
  <style>
    .header {
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;
    }
  
    .user {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  
    .user img {
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }
  </style>