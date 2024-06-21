// import 'dotenv/config'

const appConfig = {
  baseURL: import.meta.env.VITE_BASE_API_URL ?? '',
  tinyMCEApiKey: import.meta.env.VITE_TINY_CLOUD_API_KEY ?? '',
  public: {
    imageURL: import.meta.env.VITE_IMAGE_PUBLIC_URL ?? '',
    videoURL: import.meta.env.VITE_VIDEO_PUBLIC_URL ?? '',
    fileURL: import.meta.env.VITE_FILE_PUBLIC_URL ?? '',
    iconURL: import.meta.env.VITE_ICON_PUBLIC_URL ?? ''
  }
}

export default appConfig
