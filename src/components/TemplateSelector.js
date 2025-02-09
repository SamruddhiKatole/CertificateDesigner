import React from 'react';
import templatesData from '../templates.json';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function TemplateSelector({ onSelectTemplate }) {
  return (
    <div>
      <Typography variant="h6" sx={{ mt: 2 }}>Templates</Typography>
      <List>
        {templatesData.map((template) => (
          <ListItem button key={template._id.$oid} onClick={() => onSelectTemplate(template)}>
            <ListItemText primary={template.templateName} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default TemplateSelector;
