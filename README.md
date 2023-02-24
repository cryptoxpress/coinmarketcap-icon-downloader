# coinmarketcap-icon-downloader

Simple node script to download all cryptocurrency icons from coinmarketcap

# Running the script

1. Get the latest cryptocurrency map from https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=YOUR_FREE_API_KEY
2. Add newly downloaded cryptocurrency map to cmc.json file
3. For native nodeJs https approach, Run: `node index.js`
4. Alternative axios based approach (faster and more stable), Run: `node axiosDownloader.js`
   Note: for any icon that isn't available on coinMarketCap server, axiosDownloader will default CryptoXpress logo.
   Warning will be issued on console.
5. Send us some love on ETH/BSC: 0xb041a5b81981555656CaEecC959b42AFA0d0c0de

9000+ predownloaded icons available in branch: [icons-24-02-2023](https://github.com/cryptoxpress/coinmarketcap-icon-downloader/tree/icons-24-02-23)

Visit us at [CryptoXpress.com](https://cryptoxpress.com)
