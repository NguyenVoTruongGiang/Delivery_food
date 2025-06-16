<!-- src/components/Header.svelte -->
<script>
    export let adminName;
  </script>
  
  <div class="header">
    <div class="user">
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

  </style>