<script>
    import { onMount } from "svelte";
    import mapboxgl from "mapbox-gl";

    let map;
    let start = [106.68245, 10.87002]; // Tọa độ Trường Đại học Nông Lâm TP.HCM
    let end = [106.70388, 10.77689]; // Tọa độ vị trí khách hàng (ví dụ: Bến Thành)

    const MAPBOX_ACCESS_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN"; // 🔥 Thay bằng Mapbox Token của bạn

    onMount(async () => {
        mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        
        map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v11",
            center: start,
            zoom: 13
        });

        new mapboxgl.Marker().setLngLat(start).addTo(map);
        new mapboxgl.Marker().setLngLat(end).addTo(map);

        await getRoute(start, end);
    });

    async function getRoute(start, end) {
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
        );
        const data = await query.json();
        const route = data.routes[0].geometry;

        if (!map.getSource("route")) {
            map.addSource("route", {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {},
                    geometry: route,
                },
            });

            map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#007aff",
                    "line-width": 5,
                },
            });
        } else {
            map.getSource("route").setData({
                type: "Feature",
                properties: {},
                geometry: route,
            });
        }
    }
</script>

<style>
    #map {
        width: 100%;
        height: 500px;
        border-radius: 10px;
        border: 2px solid #ccc;
    }
</style>

<main>
    <h1>🚚 Bản đồ giao hàng</h1>
    <div id="map"></div>
</main>
