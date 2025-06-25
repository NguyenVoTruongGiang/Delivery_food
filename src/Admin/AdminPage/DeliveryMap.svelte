<script>
    import { onMount } from 'svelte';

    const GOOGLE_MAPS_API_KEY = 'AIzaSyCFu6B4T56aF8pnC2tD1RIWFzzN2Bdj0ms';

    // Tọa độ điểm xuất phát và điểm đến
    const origin = { lat: 10.7800, lng: 106.7009 }; 
    const destination = { lat: 10.7800, lng: 106.7100 }; 

    onMount(() => {
        // Tải Google Maps JavaScript API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        // Định nghĩa hàm initMap (phải là global để Google Maps gọi)
        window.initMap = () => {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: origin,
                zoom: 14,
            });

            // Marker điểm xuất phát
            new google.maps.Marker({
                position: origin,
                map: map,
                title: 'Điểm xuất phát',
            });

            // Marker điểm đến
            new google.maps.Marker({
                position: destination,
                map: map,
                title: 'Điểm đến',
            });

            // Vẽ tuyến đường
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === 'OK') {
                        directionsRenderer.setDirections(result);
                    } else {
                        alert('Không thể vẽ tuyến đường: ' + status);
                    }
                }
            );
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