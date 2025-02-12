import React, { useState } from 'react';
import { Dialog, Box, Button, TextField } from '@mui/material';

function BackgroundSelector({ open, onClose, onSelectBackground }) {
  const [bgUrl, setBgUrl] = useState('');

  const handleSelect = () => {
    onSelectBackground(bgUrl);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box p={2}>
        <TextField
          label="Background Image URL"
          value={bgUrl}
          onChange={(e) => setBgUrl(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSelect} fullWidth sx={{ mt: 2 }}>
          Set Background
        </Button>
      </Box>
    </Dialog>
  );
}

export default BackgroundSelector;




















