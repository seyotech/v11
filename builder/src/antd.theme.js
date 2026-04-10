import { theme as antTheme } from 'antd';

const { getDesignToken } = antTheme;

const theme = {
    token: {
        fontSizeSM: 13,
        fontSize: 13,
        fontSizeHeading3: 24,
        colorBgMask: 'rgba(13, 10, 41, 0.5)',
        colorTextHeading: '#45426E',
        colorTextDescription: '#747192',
        colorLink: '#3830B3',
        colorLinkHover: '#5D54C0',
        colorLinkActive: '#221F8E',
        colorPrimary: '#3830b3',
        colorText: '#0C0A25',
        itemHeight: '32px',
        colorTextSecondary: '#747192',
        colorTextTertiary: '#A2A1B7',
        colorTextQuaternary: '#D1D0DB',
        colorBorder: '#D9D9D9',
        colorBorderSecondary: '#F0F0F0',
        colorBgLayout: '#F4F6F9',
        colorFill: '#F6F5FA',
        colorFillSecondary: '#e7e4f2',
        colorFillTertiary: '#F4F6F9',
        boxShadowSecondary:
            '0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)',
    },
    components: {
        Carousel: {
            dotWidth: 40,
        },
        Menu: {
            darkItemColor: 'rgba(217, 213, 235, 1)',
            itemHeight: 32,
            itemMarginBlock: 16,
            itemBorderRadius: 4,
        },
        Radio: {
            borderRadiusSM: 6,
            fontSize: 13,
            buttonColor: '#45426E',
        },
        Modal: {
            titleColor: '#0C0A25',
        },
        Form: {
            fontSize: 13,
            itemMarginBottom: 12,
            colorTextHeading: '#0C0A25',
        },
        Divider: {
            colorSplit: '#F0F0F0',
            lineWidth: 1,
            marginLG: 8,
        },
        Collapse: {
            colorBorder: '#F0F0F0',
            colorBgContainer: '#ffffff',
        },
        Tree: {
            controlItemBgHover: '#F4F6F9',
        },
        Card: {
            colorBorderSecondary: '#D9D9D9',
        },
        Slider: {
            trackBg: '#3830b3',
            trackHoverBg: '#3830b3',
            handleSize: 12,
            handleSizeHover: 12,
            handleLineWidthHover: 2,
            handleColor: '#3830b3',
            handleActiveColor: '#3830b3',
            railSize: 2,
        },
        InputNumber: {
            controlWidth: 70,
        },
        Segmented: {
            itemHoverBg: 'rgba(0, 0, 0, 0.06)',
            itemHoverColor: '#3830B3',
            itemColor: '#45426E',
            itemSelectedColor: '#3830B3',
        },
        Popover: {
            colorTextHeading: '#0C0A25',
        },
        Layout: {
            siderBg: '#001529',
        },
    },
};

export const antToken = getDesignToken(theme);

export default theme;
