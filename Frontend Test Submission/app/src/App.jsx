import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import ShortenerPage from './views/shortnerpage';
import StatsPage from './views/statspage.jsx';

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Router>
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ color: 'white', fontWeight: 600, mb: 4 }}
          >
            URL Shortener
          </Typography>
          <Routes>
            <Route path="/" element={<ShortenerPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Container>
      </Router>
    </Box>
  );
}

export default App;