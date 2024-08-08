// import 'dotenv/config'

const appConfig = {
  baseURL: import.meta.env.VITE_BASE_API_URL ?? '',
  tinyMCEApiKey: import.meta.env.VITE_TINY_CLOUD_API_KEY ?? '',
  admin: {
    email: import.meta.env.VITE_ADMIN_EMAIL ?? '',
    password: import.meta.env.VITE_ADMIN_PASSWORD ?? ''
  }
}

export default appConfig
