<script>
    import { onMount } from 'svelte';
  
    // API Key của bạn (thay thế YOUR_API_KEY bằng key bạn vừa tạo)
    const GOOGLE_MAPS_API_KEY = 'AIzaSyCFu6B4T56aF8pnC2tD1RIWFzzN2Bdj0ms';
  
    // Tọa độ trung tâm (ví dụ: một vị trí giả lập)
    const center = { lat: 10.7769, lng: 106.7009 }; // Tọa độ TP. Hồ Chí Minh
  
    // Danh sách các marker (tọa độ của các điểm giao hàng)
    const markers = [
      { lat: 10.7769, lng: 106.7009, title: 'Delivery Point 1' },
      { lat: 10.7800, lng: 106.7100, title: 'Delivery Point 2' },
      { lat: 10.7700, lng: 106.6900, title: 'Delivery Point 3' },
    ];
  
    onMount(async () => {
      // Tải Google Maps JavaScript API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
  
      // Định nghĩa hàm initMap (phải là global để Google Maps gọi)
      window.initMap = () => {
        // Tạo bản đồ
        const map = new google.maps.Map(document.getElementById('map'), {
          center: center,
          zoom: 14, // Mức độ phóng to
        });
  
        // Thêm các marker vào bản đồ
        markers.forEach(marker => {
          new google.maps.Marker({
            position: { lat: marker.lat, lng: marker.lng },
            map: map,
            title: marker.title,
          });
        });
      };
    });
  </script>
  
  <div class="delivery-map">
    <h2>Delivery Map</h2>
    <div id="map" style="width: 100%; height: 400px;"></div>
  </div>
  
  <style>
    .delivery-map {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  
    h2 {
      font-size: 18px;
      margin-bottom: 15px;
    }
  </style>