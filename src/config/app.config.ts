// import 'dotenv/config'

const appConfig = {
  baseURL: import.meta.env.VITE_BASE_URL ?? '',
  tinyMCEApiKey: import.meta.env.VITE_TINY_CLOUD_API_KEY ?? ''
}

export default appConfig
