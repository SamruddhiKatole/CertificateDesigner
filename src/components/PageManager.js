import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function PageManager({ addPage, removePage, prevPage, nextPage, currentPageIndex, totalPages }) {
  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="subtitle1">
        Page {currentPageIndex + 1} of {totalPages}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={addPage} startIcon={<AddIcon />}>
          Add Page
        </Button>
        <Button variant="outlined" onClick={removePage} startIcon={<RemoveIcon />}>
          Remove Page
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={prevPage} disabled={currentPageIndex === 0} startIcon={<ArrowBackIcon />}>
          Prev
        </Button>
        <Button variant="contained" onClick={nextPage} disabled={currentPageIndex === totalPages - 1} endIcon={<ArrowForwardIcon />}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default PageManager;















