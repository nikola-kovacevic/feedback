import type { ThemeConfig } from 'antd';

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#354B8C',
    colorSuccess: '#2D733E',
    colorWarning: '#F2BB77',
    colorError: '#D93A2B',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#e8e6e4',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      siderBg: 'transparent',
      bodyBg: '#e8e6e4',
      headerBg: 'transparent',
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#5B7AD4',
    colorSuccess: '#3D9E54',
    colorWarning: '#F2BB77',
    colorError: '#E5574A',
    colorBgContainer: '#1a1d35',
    colorBgLayout: '#0f1225',
    colorText: '#e0e0e0',
    colorTextSecondary: '#a0a0b0',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      siderBg: 'transparent',
      bodyBg: '#0f1225',
      headerBg: 'transparent',
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemColor: '#a0a0b0',
      itemSelectedColor: '#ffffff',
    },
  },
};
