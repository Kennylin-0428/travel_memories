<template>
  <div id="map" style="height: 80vh;"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

let map = null;
let dataLayer = null;

// 動態載入 Google Maps JS API（使用新的 importLibrary 流程）
function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.importLibrary) {
      resolve();
      return;
    }
    const existing = document.getElementById('google-maps-js');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-js';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

onMounted(async () => {
  try {
    // 載入 Google Maps API 並使用 importLibrary
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
    await loadGoogleMaps(apiKey);
    await google.maps.importLibrary('maps');
    await google.maps.importLibrary('marker');
    
    // 創建地圖實例
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 35.6895, lng: 139.6917 }, // 預設日本
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true
    });

    // 創建 Data Layer 用於 DDS Boundaries
    dataLayer = new google.maps.Data();
    dataLayer.setMap(map);

    // 設定國家邊界的樣式
    dataLayer.setStyle({
      fillColor: '#f8f9fa',
      strokeColor: '#6c757d',
      strokeWeight: 1,
      strokeOpacity: 1,
      fillOpacity: 0.3,
      strokeDashArray: [3, 3]
    });

    // 添加懸停效果
    dataLayer.addListener('mouseover', (event) => {
      // 懸停時的樣式
      dataLayer.overrideStyle(event.feature, {
        fillColor: '#007bff',
        strokeColor: '#0056b3',
        strokeWeight: 2,
        fillOpacity: 0.6,
        strokeDashArray: null
      });
    });

    dataLayer.addListener('mouseout', (event) => {
      // 恢復原始樣式
      dataLayer.revertStyle(event.feature);
    });

    // 預先建立資訊視窗
    const infoWindow = new google.maps.InfoWindow();

    // 添加點擊事件
    dataLayer.addListener('click', (event) => {
      // 縮放到選中的國家
      const bounds = new google.maps.LatLngBounds();
      const geometry = event.feature.getGeometry();
      
      if (geometry.getType() === 'Polygon') {
        const paths = geometry.getArray();
        paths.forEach(path => {
          path.getArray().forEach(latLng => {
            bounds.extend(latLng);
          });
        });
      } else if (geometry.getType() === 'MultiPolygon') {
        const polygons = geometry.getArray();
        polygons.forEach(polygon => {
          const paths = polygon.getArray();
          paths.forEach(path => {
            path.getArray().forEach(latLng => {
              bounds.extend(latLng);
            });
          });
        });
      }
      
      map.fitBounds(bounds);

      // 顯示資訊視窗於點擊位置
      const countryName = event.feature.getProperty('name') || event.feature.getProperty('NAME') || event.feature.getProperty('name_long') || 'Selected Area';
      infoWindow.setContent(`<div><b>${countryName}</b><br>點擊查看詳細資訊</div>`);
      infoWindow.setPosition(event.latLng || map.getCenter());
      infoWindow.open({ map });
    });

    // 載入國家邊界數據
    await loadCountryBoundaries();

    // 添加城市標記
    addCityMarkers();

  } catch (error) {
    console.error('載入 Google Maps 時發生錯誤:', error);
  }
});

// 載入國家邊界數據
async function loadCountryBoundaries() {
  try {
    // 使用 Google Maps 的國家邊界數據
    // 這裡我們使用一個公開的 GeoJSON 數據源
    const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
    const worldData = await response.json();
    
    // 過濾出我們需要的國家
    const countriesData = {
      type: 'FeatureCollection',
      features: worldData.features.filter(feature => 
        ['Japan', 'South Korea', 'China', 'Taiwan'].includes(feature.properties.name)
      )
    };

    // 將數據添加到地圖
    dataLayer.addGeoJson(countriesData);

  } catch (error) {
    console.error('載入國家邊界數據時發生錯誤:', error);
    // 如果無法載入外部數據，使用備用方案
    loadFallbackBoundaries();
  }
}

// 備用邊界數據
function loadFallbackBoundaries() {
  // 使用簡化的邊界數據作為備用方案
  const fallbackData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Japan' },
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [129.0, 31.0], [130.0, 31.2], [131.0, 31.5], [131.5, 32.0], 
                [132.0, 32.5], [132.5, 33.0], [133.0, 33.5], [133.5, 34.0], 
                [134.0, 34.5], [134.5, 35.0], [135.0, 35.5], [135.5, 36.0], 
                [136.0, 36.5], [136.5, 37.0], [137.0, 37.5], [137.5, 38.0], 
                [138.0, 38.5], [138.5, 39.0], [139.0, 39.5], [139.5, 40.0], 
                [140.0, 40.5], [140.5, 41.0], [141.0, 41.5], [141.5, 42.0], 
                [142.0, 42.5], [142.5, 43.0], [143.0, 43.5], [143.5, 44.0], 
                [144.0, 44.5], [144.5, 45.0], [144.0, 45.5], [143.5, 45.0], 
                [143.0, 44.5], [142.5, 44.0], [142.0, 43.5], [141.5, 43.0], 
                [141.0, 42.5], [140.5, 42.0], [140.0, 41.5], [139.5, 41.0], 
                [139.0, 40.5], [138.5, 40.0], [138.0, 39.5], [137.5, 39.0], 
                [137.0, 38.5], [136.5, 38.0], [136.0, 37.5], [135.5, 37.0], 
                [135.0, 36.5], [134.5, 36.0], [134.0, 35.5], [133.5, 35.0], 
                [133.0, 34.5], [132.5, 34.0], [132.0, 33.5], [131.5, 33.0], 
                [131.0, 32.5], [130.5, 32.0], [130.0, 31.5], [129.5, 31.0], 
                [129.0, 31.0]
              ]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'South Korea' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [124.0, 33.0], [124.5, 33.1], [125.0, 33.3], [125.5, 33.6], 
              [126.0, 34.0], [126.5, 34.4], [127.0, 34.8], [127.5, 35.2], 
              [128.0, 35.6], [128.5, 36.0], [129.0, 36.4], [129.5, 36.8], 
              [130.0, 37.2], [130.5, 37.6], [131.0, 38.0], [131.5, 38.4], 
              [132.0, 38.8], [131.5, 39.2], [131.0, 38.8], [130.5, 38.4], 
              [130.0, 38.0], [129.5, 37.6], [129.0, 37.2], [128.5, 36.8], 
              [128.0, 36.4], [127.5, 36.0], [127.0, 35.6], [126.5, 35.2], 
              [126.0, 34.8], [125.5, 34.4], [125.0, 34.0], [124.5, 33.6], 
              [124.0, 33.2], [124.0, 33.0]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'China' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [73.0, 18.0], [75.0, 18.2], [77.0, 18.5], [79.0, 19.0], 
              [81.0, 19.5], [83.0, 20.0], [85.0, 20.5], [87.0, 21.0], 
              [89.0, 21.5], [91.0, 22.0], [93.0, 22.5], [95.0, 23.0], 
              [97.0, 23.5], [99.0, 24.0], [101.0, 24.5], [103.0, 25.0], 
              [105.0, 25.5], [107.0, 26.0], [109.0, 26.5], [111.0, 27.0], 
              [113.0, 27.5], [115.0, 28.0], [117.0, 28.5], [119.0, 29.0], 
              [121.0, 29.5], [123.0, 30.0], [125.0, 30.5], [127.0, 31.0], 
              [129.0, 31.5], [131.0, 32.0], [133.0, 32.5], [135.0, 33.0], 
              [137.0, 33.5], [139.0, 34.0], [141.0, 34.5], [143.0, 35.0], 
              [145.0, 35.5], [147.0, 36.0], [149.0, 36.5], [151.0, 37.0], 
              [153.0, 37.5], [155.0, 38.0], [157.0, 38.5], [159.0, 39.0], 
              [161.0, 39.5], [159.0, 40.0], [157.0, 40.5], [155.0, 41.0], 
              [153.0, 41.5], [151.0, 42.0], [149.0, 42.5], [147.0, 43.0], 
              [145.0, 43.5], [143.0, 44.0], [141.0, 44.5], [139.0, 45.0], 
              [137.0, 45.5], [135.0, 46.0], [133.0, 46.5], [131.0, 47.0], 
              [129.0, 47.5], [127.0, 48.0], [125.0, 48.5], [123.0, 49.0], 
              [121.0, 49.5], [119.0, 50.0], [117.0, 50.5], [115.0, 51.0], 
              [113.0, 51.5], [111.0, 52.0], [109.0, 52.5], [107.0, 53.0], 
              [105.0, 53.5], [103.0, 54.0], [101.0, 54.5], [99.0, 55.0], 
              [97.0, 54.5], [95.0, 54.0], [93.0, 53.5], [91.0, 53.0], 
              [89.0, 52.5], [87.0, 52.0], [85.0, 51.5], [83.0, 51.0], 
              [81.0, 50.5], [79.0, 50.0], [77.0, 49.5], [75.0, 49.0], 
              [73.0, 48.5], [73.0, 46.0], [73.0, 44.0], [73.0, 42.0], 
              [73.0, 40.0], [73.0, 38.0], [73.0, 36.0], [73.0, 34.0], 
              [73.0, 32.0], [73.0, 30.0], [73.0, 28.0], [73.0, 26.0], 
              [73.0, 24.0], [73.0, 22.0], [73.0, 20.0], [73.0, 18.0]
            ]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { name: 'Taiwan' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [119.0, 22.0], [119.5, 22.1], [120.0, 22.3], [120.5, 22.6], 
              [121.0, 23.0], [121.5, 23.4], [122.0, 23.8], [122.5, 24.2], 
              [123.0, 24.6], [123.5, 25.0], [123.0, 25.4], [122.5, 25.0], 
              [122.0, 24.6], [121.5, 24.2], [121.0, 23.8], [120.5, 23.4], 
              [120.0, 23.0], [119.5, 22.6], [119.0, 22.2], [119.0, 22.0]
            ]
          ]
        }
      }
    ]
  };

  dataLayer.addGeoJson(fallbackData);
}

// 添加城市標記
function addCityMarkers() {
  const cities = [
    { name: 'Tokyo', lat: 35.6895, lng: 139.6917 },
    { name: 'Kyoto', lat: 35.0116, lng: 135.7681 }
  ];

  cities.forEach(city => {
    const marker = new google.maps.Marker({
      position: { lat: city.lat, lng: city.lng },
      map: map,
      title: city.name
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<div><b>${city.name}</b><br><a href="/city/${city.name}">查看回憶</a></div>`
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  });
}

onUnmounted(() => {
  // 清理資源
  if (dataLayer) {
    dataLayer.setMap(null);
  }
  if (map) {
    map = null;
  }
});
</script>