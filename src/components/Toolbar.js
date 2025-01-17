import React, { useState } from 'react';
import { MenuItem, Select, FormControl, InputLabel, Stack, Button, Dialog, Box } from '@mui/material';
import { SketchPicker } from 'react-color';
function Toolbar({ onPageSizeChange, onAddText, onBackgroundColorChange }) {
  const [pageSize, setPageSize] = useState('A4_LANDSCAPE');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textType, setTextType] = useState('H1');
  const [isTextColorPickerOpen, setTextColorPickerOpen] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [isBgColorPickerOpen, setBgColorPickerOpen] = useState(false);

  const handlePageSizeChange = (event) => {
    const selectedSize = event.target.value;
    setPageSize(selectedSize);

    const sizes = {
      A4_LANDSCAPE: { width: 1123, height: 794 },
      A4_PORTRAIT: { width: 794, height: 1123 },
      A3_LANDSCAPE: { width: 1587, height: 1123 },
      A3_PORTRAIT: { width: 1123, height: 1587 },
      LEGAL_LANDSCAPE: { width: 1400, height: 850 },
      LEGAL_PORTRAIT: { width: 850, height: 1400 },
      CUSTOM: { width: 800, height: 600 },
    };
    onPageSizeChange(sizes[selectedSize]);
  };

  const handleAddText = () => {
    setTextColorPickerOpen(true);
  };

  const handleTextColorChange = (color) => {
    setTextColor(color.hex);
  };

  const confirmAddText = () => {
    setTextColorPickerOpen(false);
    onAddText(textType, textColor, fontFamily);
  };

  const handleBackgroundColorChange = (color) => {
    onBackgroundColorChange(color.hex);
  };

  return (
    <Stack spacing={3}>
      <FormControl fullWidth>
        <InputLabel>Page Size</InputLabel>
        <Select value={pageSize} onChange={handlePageSizeChange}>
          <MenuItem value="A4_LANDSCAPE">A4 Landscape</MenuItem>
          <MenuItem value="A4_PORTRAIT">A4 Portrait</MenuItem>
          <MenuItem value="A3_LANDSCAPE">A3 Landscape</MenuItem>
          <MenuItem value="A3_PORTRAIT">A3 Portrait</MenuItem>
          <MenuItem value="LEGAL_LANDSCAPE">Legal Landscape</MenuItem>
          <MenuItem value="LEGAL_PORTRAIT">Legal Portrait</MenuItem>
          <MenuItem value="CUSTOM">Custom</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Text Type</InputLabel>
        <Select value={textType} onChange={(e) => setTextType(e.target.value)}>
          <MenuItem value="H1">H1</MenuItem>
          <MenuItem value="H2">H2</MenuItem>
          <MenuItem value="H3">H3</MenuItem>
          <MenuItem value="BODY1">Body Font 1</MenuItem>
          <MenuItem value="CAPTION">Caption</MenuItem>
        </Select>
      </FormControl>

      {/* Dropdown for Font Family */}
      <FormControl fullWidth>
        <InputLabel>Font Family</InputLabel>
        <Select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Times New Roman">Times New Roman</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Georgia">Georgia</MenuItem>
          <MenuItem value="Verdana">Verdana</MenuItem>
        </Select>
      </FormControl>

      
      <Button variant="contained" onClick={handleAddText}>
        Add Text
      </Button>

      <Dialog open={isTextColorPickerOpen} onClose={() => setTextColorPickerOpen(false)}>
        <Box p={2}>
          <SketchPicker
            color={textColor}
            onChangeComplete={handleTextColorChange}
            disableAlpha
          />
          <Button
            variant="contained"
            fullWidth
            onClick={confirmAddText}
            style={{ marginTop: '10px' }}
          >
            Confirm
          </Button>
        </Box>
      </Dialog>

      <Button
        variant="outlined"
        onClick={() => setBgColorPickerOpen(true)}
      >
        Background Color
      </Button>

      <Dialog open={isBgColorPickerOpen} onClose={() => setBgColorPickerOpen(false)}>
        <Box p={2}>
          <SketchPicker
            onChangeComplete={handleBackgroundColorChange}
            disableAlpha
          />
        </Box>
      </Dialog>
    </Stack>
  );
}

export default Toolbar;








