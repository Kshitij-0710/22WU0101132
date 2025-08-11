import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import ShortenerPage from './views/shortnerpage';
import StatsPage from './views/statspage.jsx';

function App() {
  return (
    <Router>
      <Container>
        <Typography variant="h3" component="h1" gutterBottom align="center" mt={4}>
          URL Shortener
        </Typography>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;