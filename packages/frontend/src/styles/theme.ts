import type { ThemeConfig } from 'antd';

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#354B8C',
    colorSuccess: '#2D733E',
    colorWarning: '#F2BB77',
    colorError: '#D93A2B',
    colorBgContainer: 'rgba(255, 255, 255, 0.55)',
    colorBgElevated: 'rgba(255, 255, 255, 0.85)',
    colorBgLayout: 'transparent',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      siderBg: 'transparent',
      bodyBg: 'transparent',
      headerBg: 'transparent',
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
    },
    Table: {
      headerBg: 'rgba(53, 75, 140, 0.06)',
      rowHoverBg: 'rgba(53, 75, 140, 0.04)',
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#5B7AD4',
    colorSuccess: '#3D9E54',
    colorWarning: '#F2BB77',
    colorError: '#E5574A',
    colorBgContainer: 'rgba(30, 35, 60, 0.6)',
    colorBgElevated: 'rgba(40, 48, 80, 0.9)',
    colorBgLayout: 'transparent',
    colorText: '#F2F1F0',
    colorTextSecondary: '#b0b0c0',
    colorTextTertiary: '#808098',
    colorBorder: 'rgba(255, 255, 255, 0.1)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      siderBg: 'transparent',
      bodyBg: 'transparent',
      headerBg: 'transparent',
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemColor: '#b0b0c0',
      itemHoverColor: '#F2F1F0',
      itemSelectedColor: '#ffffff',
      itemSelectedBg: 'rgba(242, 187, 119, 0.12)',
    },
    Table: {
      headerBg: 'rgba(53, 75, 140, 0.15)',
      rowHoverBg: 'rgba(53, 75, 140, 0.08)',
      colorBgContainer: 'rgba(30, 35, 60, 0.5)',
    },
    Card: {
      colorBgContainer: 'rgba(30, 35, 60, 0.5)',
    },
    Input: {
      colorBgContainer: 'rgba(20, 25, 50, 0.6)',
    },
    Select: {
      colorBgContainer: 'rgba(20, 25, 50, 0.6)',
    },
    DatePicker: {
      colorBgContainer: 'rgba(20, 25, 50, 0.6)',
    },
    Descriptions: {
      colorBgContainer: 'rgba(30, 35, 60, 0.4)',
    },
  },
};
