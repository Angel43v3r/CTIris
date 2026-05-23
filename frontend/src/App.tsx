import { AppBar, Box, Container, Typography } from '@mui/material';
import { COLORS } from './constants/themeColors';
import DashboardHeader from './components/DashboardHeader';
import DashboardBody from './components/DashboardBody';

function App() {
  return (
    <Container>
      {/* HEADER */}
      <DashboardHeader />

      {/* BODY */}
      <DashboardBody />

      {/* FOOTER */}
      <Box sx={{ mt: 4, p: 4 }}>
        <Typography variant='subtitle1' sx={{ color: COLORS.textOutline}} align='center'>Footer will go here!</Typography>
      </Box>
    </Container>
  )
}

export default App