export const COLORS = {
    backgroundDefault: '#090B0E',
    backgroundContainer: '#1a1e23',
    backgroundInput: '#23184a',
    accentPrimary: '#121A21',   //dark purple
    accentSecondary: '#82E4FF',
    border: '#040A12',
    textMuted: '#98a7d1',
    headerBackground: '#07131b',
    textColor: '#5359A8',
    textOutline: '#d6b1fd',
    textPrimary: '#f8f8ff',
    textSecondary: '#402e68',
    textTertiary: '#415e8f',
} as const;

export type ColorKey = keyof typeof COLORS;