import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const templates = [
  {
    id: 1,
    name: 'Certificate of Achievement',
    backgroundImage: '#fef7e1', // Light cream
    // border: '8px solid #d4af37', // Gold border
    textElements: [
      { text: 'Certificate of Achievement', fontSize: 48, fontFamily: 'Georgia', color: '#d4af37', x: 300, y: 40, align: 'center' },
      { text: 'This is awarded to', fontSize: 24, fontFamily: 'Arial', color: '#333333', x: 400, y: 120, align: 'center' },
      { text: 'Recipient Name', fontSize: 36, fontFamily: 'Georgia', color: '#111111', x: 350, y: 180, align: 'center' },
      { text: 'For outstanding performance and dedication.', fontSize: 20, fontFamily: 'Arial', color: '#555555', x: 300, y: 250, align: 'center' },
      { text: 'Date:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 100, y: 400, align: 'left' },
      { text: 'Signature:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 500, y: 400, align: 'right' },
    ],
    shapes: [
      { type: 'line', points: [50, 380, 1050, 380], stroke: '#d4af37', strokeWidth: 2 },
      { type: 'circle', x: 100, y: 100, radius: 50, fill: '#fff', stroke: '#d4af37', strokeWidth: 2 },
    ],
  },
  {
    id: 2,
    name: 'Certificate of Excellence',
    backgroundImage: '#e8f1fa', // Light blue
    textElements: [
      { text: 'Certificate of Excellence', fontSize: 42, fontFamily: 'Times New Roman', color: '#2c5282', x: 180, y: 50, align: 'center' },
      { text: 'Presented to', fontSize: 24, fontFamily: 'Arial', color: '#1a365d', x: 320, y: 150, align: 'center' },
      { text: 'Recipient Name', fontSize: 34, fontFamily: 'Times New Roman', color: '#1a365d', x: 275, y: 200, align: 'center' },
      { text: 'In recognition of exceptional achievement.', fontSize: 20, fontFamily: 'Arial', color: '#2b6cb0', x: 230, y: 300, align: 'center' },
      { text: 'Date:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 100, y: 400, align: 'left' },
      { text: 'Signature:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 500, y: 400, align: 'right' },
    ],
  },
  {
    id: 3,
    name: 'Certificate of Participation',
    backgroundImage: '#f7f9fc', // Soft gray
    // border: '5px dashed #4a5568', // Dashed gray border
    textElements: [
      { text: 'Certificate of Participation', fontSize: 36, fontFamily: 'Verdana', color: '#2d3748', x: 180, y: 50, align: 'center' },
      { text: 'Awarded to', fontSize: 22, fontFamily: 'Arial', color: '#4a5568', x: 320, y: 150, align: 'center' },
      { text: 'Recipient Name', fontSize: 30, fontFamily: 'Verdana', color: '#2d3748', x: 275, y: 200, align: 'center' },
      { text: 'For active participation in the event.', fontSize: 18, fontFamily: 'Arial', color: '#718096', x: 230, y: 300, align: 'center' },
      { text: 'Date:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 100, y: 400, align: 'left' },
      { text: 'Signature:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 500, y: 400, align: 'right' },
    ],
  },
  {
    id: 4,
    name: 'Employee Recognition',
    backgroundImage: '#fff4e6', // Warm beige
    // border: '6px solid #c05621', // Copper border
    textElements: [
      { text: 'Employee Recognition Award', fontSize: 38, fontFamily: 'Georgia', color: '#c05621', x: 150, y: 50, align: 'center' },
      { text: 'Awarded to', fontSize: 24, fontFamily: 'Arial', color: '#6b4226', x: 320, y: 150, align: 'center' },
      { text: 'Recipient Name', fontSize: 32, fontFamily: 'Georgia', color: '#1a202c', x: 275, y: 200, align: 'center' },
      { text: 'For exemplary service and dedication.', fontSize: 18, fontFamily: 'Arial', color: '#4a5568', x: 220, y: 300, align: 'center' },
      { text: 'Date:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 100, y: 400, align: 'left' },
      { text: 'Signature:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 500, y: 400, align: 'right' },
    ],
  },
  {
    id: 5,
    name: 'Certificate of Merit',
    backgroundImage: '#d0f0c0', // Light green
    // border: '4px solid #38a169', // Emerald green border
    textElements: [
      { text: 'Certificate of Merit', fontSize: 40, fontFamily: 'Georgia', color: '#38a169', x: 200, y: 50, align: 'center' },
      { text: 'Presented to', fontSize: 24, fontFamily: 'Arial', color: '#2f855a', x: 320, y: 150, align: 'center' },
      { text: 'Recipient Name', fontSize: 34, fontFamily: 'Georgia', color: '#2f855a', x: 275, y: 200, align: 'center' },
      { text: 'For excellence in performance.', fontSize: 20, fontFamily: 'Arial', color: '#48bb78', x: 230, y: 300, align: 'center' },
      { text: 'Date:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 100, y: 400, align: 'left' },
      { text: 'Signature:', fontSize: 18, fontFamily: 'Arial', color: '#333333', x: 500, y: 400, align: 'right' },
    ],
  },
];

function TemplateSelector({ onSelectTemplate }) {
  return (
    <div style={{ padding: '10px' }}>
      <Typography variant="h6" style={{ marginBottom: '10px' }}>
        Select a Template
      </Typography>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {templates.map((template) => (
          <Card
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            style={{
              cursor: 'pointer',
              border: template.border,
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <CardContent style={{ backgroundColor: template.backgroundImage }}>
              <Typography variant="subtitle1" align="center">
                {template.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


export default TemplateSelector;






