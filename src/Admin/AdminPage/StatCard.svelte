<!-- src/components/StatCard.svelte -->
<script>
    export let title;
    export let value;
    export let change;
    export let icon;
  </script>
  
  <div class="stat-card">
    <div class="icon">{icon}</div>
    <div class="info">
      <h3>{title}</h3>
      <p class="value">{value}</p>
      <p class="change">{change}</p>
    </div>
  </div>
  
  <style>
    .stat-card {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 15px;
    }
  
    .icon {
      font-size: 24px;
    }
  
    .info h3 {
      font-size: 14px;
      color: #888;
      margin: 0;
    }
  
    .value {
      font-size: 24px;
      font-weight: bold;
      margin: 5px 0;
    }
  
    .change {
      font-size: 12px;
      color: #28a745;
      margin: 0;
    }
  </style>