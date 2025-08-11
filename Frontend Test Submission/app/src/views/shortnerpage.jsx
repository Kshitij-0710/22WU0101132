import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Typography, IconButton, CircularProgress, Link, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useLogger } from '../logging/logger';
import { Link as RouterLink } from 'react-router-dom';

const API_BASE_URL = 'http://127.0.0.1:8000';

const UrlInputRow = ({ id, value, onChange }) => {
  return (
    <Box display="flex" gap={2} mb={2} alignItems="center">
      <TextField
        label="Original Long URL"
        variant="outlined"
        fullWidth
        name="url"
        value={value.url}
        onChange={(e) => onChange(id, e)}
        required
      />
      <TextField
        label="Custom Shortcode (Optional)"
        variant="outlined"
        sx={{ width: '40%' }}
        name="shortcode"
        value={value.shortcode}
        onChange={(e) => onChange(id, e)}
      />
      <TextField
        label="Validity (mins, optional)"
        variant="outlined"
        type="number"
        sx={{ width: '30%' }}
        name="validity"
        value={value.validity}
        onChange={(e) => onChange(id, e)}
      />
    </Box>
  );
};

const ShortenerPage = () => {
  const [urlRows, setUrlRows] = useState([{ id: 1, url: '', shortcode: '', validity: '' }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { log } = useLogger();

  const handleInputChange = (id, event) => {
    const { name, value } = event.target;
    const newRows = urlRows.map(row => (row.id === id ? { ...row, [name]: value } : row));
    setUrlRows(newRows);
  };

  const addRow = () => {
    if (urlRows.length < 5) {
      setUrlRows([...urlRows, { id: Date.now(), url: '', shortcode: '', validity: '' }]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResults([]);
    log('info', 'component', 'URL shortening started');

    const promises = urlRows.map(async (row) => {

      try {
        new URL(row.url);
      } catch (_) {
        log('warn', 'validation', `invalid format: ${row.url}`);
        return { id: row.id, error: 'invalid format.' };
      }

      const body = { url: row.url };
      if (row.shortcode) body.shortcode = row.shortcode;
      if (row.validity) body.validity = parseInt(row.validity, 10);

      try {
        const response = await fetch(`${API_BASE_URL}/shorturls/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP error status: ${response.status}`);
        }

        log('info', 'api', `successfully shortened ${row.url}`);

        const existingShortcodes = JSON.parse(localStorage.getItem('shortcodes') || '[]');
        const shortcode = data.shortLink.split('/').pop();
        if (!existingShortcodes.includes(shortcode)) {
          localStorage.setItem('shortcodes', JSON.stringify([...existingShortcodes, shortcode]));
        }

        return { id: row.id, ...data };

      } catch (error) {
        log('error', 'api', `Failed to shorten ${row.url}: ${error.message}`);
        return { id: row.id, error: error.message };
      }
    });

    const settledResults = await Promise.all(promises);
    setResults(settledResults.filter(Boolean));
    setLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Create Short URLs
        </Typography>
        <form onSubmit={handleSubmit}>
          {urlRows.map(row => (
            <UrlInputRow key={row.id} id={row.id} value={row} onChange={handleInputChange} />
          ))}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button variant="outlined" onClick={addRow} disabled={urlRows.length >= 5} startIcon={<AddCircleOutlineIcon />}>
              Add URL
            </Button>
            <Button component={RouterLink} to="/stats" sx={{ ml: 2 }}>
              View Stats
            </Button>
            <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Shorten'}
            </Button>
          </Box>
        </form>

        {results.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>Results</Typography>
            {results.map(result => (
              <Box key={result.id} mb={2}>
                {result.error ? (
                  <Alert severity="error">Failed to shorten: {result.error}</Alert>
                ) : (
                  <Alert severity="success">
                    Short Link: <Link href={result.shortLink} target="_blank" rel="noopener">{result.shortLink}</Link>
                    {' - '}
                    Expires at: {new Date(result.expiry).toLocaleString()}
                  </Alert>
                )}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>

  );
};

export default ShortenerPage;