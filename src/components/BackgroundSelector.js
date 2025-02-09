// import React from 'react';
// import { useDispatch } from 'react-redux';
// import { updateElement } from '../redux/actions';

// const BackgroundSelector = () => {
//   const dispatch = useDispatch();

//   const backgrounds = [
//     'background1.jpg',
//     'background2.jpg',
//     // Add more background images
//   ];

//   const handleSelectBackground = (background) => {
//     dispatch(updateElement('background', { background }));
//   };

//   return (
//     <div className="background-selector">
//       <h3>Select Background</h3>
//       {backgrounds.map((bg, index) => (
//         <button key={index} onClick={() => handleSelectBackground(bg)}>
//           {bg}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default BackgroundSelector;
// src/components/BackgroundSelector.js
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
