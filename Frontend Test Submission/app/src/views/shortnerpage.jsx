// In src/pages/ShortenerPage.jsx

import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Typography, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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

  const handleInputChange = (id, event) => {
    const { name, value } = event.target;
    const newRows = urlRows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setUrlRows(newRows);
  };

  const addRow = () => {
    if (urlRows.length < 5) {
      setUrlRows([...urlRows, { id: Date.now(), url: '', shortcode: '', validity: '' }]);
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitting:", urlRows);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Create Short URLs
        </Typography>
        <form onSubmit={handleSubmit}>
          {urlRows.map(row => (
            <UrlInputRow
              key={row.id}
              id={row.id}
              value={row}
              onChange={handleInputChange}
            />
          ))}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              variant="outlined"
              onClick={addRow}
              disabled={urlRows.length >= 5}
              startIcon={<AddCircleOutlineIcon />}
            >
              Add URL
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Shorten
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShortenerPage;