import React from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

function LayerManager({ texts, shapes, bringForward, sendBackward, deleteElement }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Layers</Typography>
      <List>
        {texts.map(text => (
          <ListItem key={text.id}>
            <ListItemText primary={`Text: ${text.text}`} />
            <IconButton onClick={() => bringForward(text.id, 'text')}><ArrowUpwardIcon /></IconButton>
            <IconButton onClick={() => sendBackward(text.id, 'text')}><ArrowDownwardIcon /></IconButton>
            <IconButton onClick={() => deleteElement(text.id, 'text')}><DeleteIcon /></IconButton>
          </ListItem>
        ))}
        {shapes.map(shape => (
          <ListItem key={shape.id}>
            <ListItemText primary={`Shape: ${shape.shapeType}`} />
            <IconButton onClick={() => bringForward(shape.id, 'shape')}><ArrowUpwardIcon /></IconButton>
            <IconButton onClick={() => sendBackward(shape.id, 'shape')}><ArrowDownwardIcon /></IconButton>
            <IconButton onClick={() => deleteElement(shape.id, 'shape')}><DeleteIcon /></IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default LayerManager;
















