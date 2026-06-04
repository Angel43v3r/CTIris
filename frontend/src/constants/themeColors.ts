export const COLORS = {
    backgroundDefault: '#090B0E',
    backgroundContainer: '#1a1e23',
    backgroundInput: '#23184a',
    accentPrimary: '#8B5CF6',   //dark purple
    border: '#040A12',
    headerBackground: '#07131b',

    //TEXT COLORS
    textPrimary: '#f8f8ff',
    textSecondary: '#5359A8',
    textTertiary: '#415e8f',
    textQuaternary: '#A78BFA',
    textMuted: '#98a7d1',

    //STAT CARDS & HOVER STATES
    cardBackground: 'rgba(139, 92, 246, 0.15)',
    cardBorder: 'rgba(139, 92, 246, 0.3)',
    hoverBoxShadow: 'rgba(139, 92, 246, 0.5)',
    dataContainerBackground: 'rgba(255,255,255,0.07)',
    dataContainerBorder: 'rgba(255,255,255,0.05)',
    dataContainerBackgroundHover: '#07131b',
    dataContainerBorderHover: 'rgba(255, 255, 255, 0.15)',

    //HEATMAP COLORS
    heatmapLow: 'rgba(228, 39, 39, 0.25)', //green
    heatmapMedium: 'rgba(228, 39, 39, 0.5)', //yellow
    heatmapHigh: 'rgba(228, 39, 39, 0.75)', //red
    heatmapCritical: 'rgba(228, 39, 39, 1)', //dark red
    heatmapHover: 'rgba(139, 92, 246, 0.5)',

} as const;

export type ColorKey = keyof typeof COLORS;