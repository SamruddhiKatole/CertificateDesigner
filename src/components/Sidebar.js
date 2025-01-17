import React, { useState } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { FontDownload } from '@mui/icons-material'; // For the font button icon

const Sidebar = () => {
  const [anchorElSize, setAnchorElSize] = useState(null);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [selectedSize, setSelectedSize] = useState('H1');
  const [selectedFont, setSelectedFont] = useState('Arial');
  
  // Open and close handlers for text size and font menus
  const handleSizeMenuClick = (event) => setAnchorElSize(event.currentTarget);
  const handleFontMenuClick = (event) => setAnchorElFont(event.currentTarget);
  const handleCloseSizeMenu = (size) => {
    setSelectedSize(size);
    setAnchorElSize(null);
  };
  const handleCloseFontMenu = (font) => {
    setSelectedFont(font);
    setAnchorElFont(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Certificate Designer
      </Typography>

      {/* Text Size Button */}
      <Button
        variant="contained"
        onClick={handleSizeMenuClick}
        style={{ marginBottom: '10px', width: '100%' }}
      >
        Text Size: {selectedSize}
      </Button>
      <Menu
        anchorEl={anchorElSize}
        open={Boolean(anchorElSize)}
        onClose={() => setAnchorElSize(null)}
      >
        {['H1', 'H2', 'H3', 'H4', 'H5', 'BODY FONT 1', 'BODY FONT 2', 'CAPTION'].map((size) => (
          <MenuItem key={size} onClick={() => handleCloseSizeMenu(size)}>
            {size}
          </MenuItem>
        ))}
      </Menu>

      {/* Font Button */}
      <Button
        variant="contained"
        onClick={handleFontMenuClick}
        style={{ marginBottom: '10px', width: '100%' }}
      >
        <FontDownload style={{ marginRight: '8px' }} /> Font: {selectedFont}
      </Button>
      <Menu
        anchorEl={anchorElFont}
        open={Boolean(anchorElFont)}
        onClose={() => setAnchorElFont(null)}
      >
        {['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'].map((font) => (
          <MenuItem key={font} onClick={() => handleCloseFontMenu(font)}>
            {font}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Sidebar;
