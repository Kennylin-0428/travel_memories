# Google Maps API 配置說明

## 設置步驟

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用以下 API：
   - Maps JavaScript API
   - Maps Datasets API (用於 DDS Boundaries)
4. 創建 API 金鑰
5. 在專案根目錄創建 `.env` 文件，內容如下：

```
VITE_GOOGLE_MAPS_API_KEY=你的API金鑰
```

6. 更新 `src/components/MapView.vue` 中的 API 金鑰：

```javascript
const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['maps']
});
```

## 功能說明

此實現使用了 Google Maps 的 Data-Driven Styling (DDS) Boundaries 功能：

- **國家邊界顯示**：使用真實的國家邊界數據
- **懸停效果**：滑鼠懸停時國家區域會變色
- **點擊縮放**：點擊國家會縮放到該國家邊界
- **資訊窗口**：顯示國家名稱和相關資訊
- **城市標記**：保留原有的城市標記功能

## 參考資料

- [Google Maps DDS Boundaries 文檔](https://developers.google.com/maps/documentation/javascript/dds-boundaries/coverage?hl=zh-tw)
- [Maps JavaScript API 文檔](https://developers.google.com/maps/documentation/javascript)


