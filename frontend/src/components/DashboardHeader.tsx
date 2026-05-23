import { Avatar, Box, Chip, Typography } from '@mui/material';
import { COLORS } from '../constants/themeColors';
import HeaderIcon from '../assets/CTIris-Icon.png';

export default function DashboardHeader() {
    return (
        <Box sx={{ bgcolor: COLORS.headerBackground, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #82e4ff', paddingY: 2, paddingX: 8, }}>
            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                        src={HeaderIcon}
                        variant='square'
                        sx={{
                            width: 80,
                            height: 60,
                            '& img': {
                                objectFit: 'contain'
                            }
                        }}
                    />
                    <Typography variant="h3" sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>
                        CTI
                    </Typography>
                    <Typography variant="h3" sx={{ color: COLORS.textSecondary, fontWeight: 'bold' }}>RIS</Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ color: COLORS.textPrimary, fontWeight: 'semibold' }}>
                    CYBER THREAT INTELLIGENCE DASHBOARD
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Chip
                    label="STATUS: RUNNING"
                    color="success"
                    variant="outlined"
                    size="small"
                    sx={{ fontFamily: 'monospace' }}
                />
                <Chip
                    label="ACTIVE FEEDS: 3"
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ fontFamily: 'monospace' }}
                />
            </Box>
        </Box>
    )
}