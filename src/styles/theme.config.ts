import { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#ff6b00'
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      headerBg: 'var(--background)'
    },
    Button: {
      defaultColor: '#000000',
      textHoverBg: '#ffffff'
    },
    Menu: {
      itemActiveBg: '#ff6b00',
      itemSelectedBg: '#ff6b00',
      itemSelectedColor: '#fff',
      itemBorderRadius: 6
    }
  }
}

export default theme
