import { Box, Container, Paper, Typography } from '@mui/material'

function App() {
  return (
    <Container>
      {/* HEADER */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant='h1' color='text.primary' align='center' gutterBottom>Welcome to CTIris!</Typography>
      </Box>

      {/* CONTENT */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant='h4' color='text.primary' align='center'>Content will go here!</Typography>

      </Paper>

      {/* FOOTER */}
      <Box sx={{ mt: 4, p: 4 }}>
        <Typography variant='subtitle1' color='text.secondary' align='center'>Footer will go here!</Typography>
      </Box>
    </Container>
  )
}

export default App