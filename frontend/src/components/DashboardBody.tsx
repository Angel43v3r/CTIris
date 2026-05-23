import { Box, Paper, Typography } from "@mui/material";
import { COLORS } from "../constants/themeColors";
import StixData from "./StixData";

export default function DashboardBody() {
    return (
        <Box sx={{ bgcolor: COLORS.backgroundContainer, minHeight: '100vh', paddingX: 8, paddingY: 2, gap: 1 }}>
            <Box sx={{ bgcolor: COLORS.backgroundDefault, padding: 4, borderRadius: 4, border: '2px solid rgba(255,255,255,0.05)' }}>
                <Typography variant="h6" sx={{ color: COLORS.textColor, fontWeight: 'bold' }}>STIX DATA</Typography>
                {/* CONTENT */}
                <StixData />
            </Box>
        </Box>
    )

}