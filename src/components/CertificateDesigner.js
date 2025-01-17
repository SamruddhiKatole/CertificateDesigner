import React, { useState } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import Toolbar from './Toolbar';
import { IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { Text } from 'react-konva';

function CertificateDesigner() {
  const [canvasSize, setCanvasSize] = useState({ width: 1123, height: 794 });
  const [texts, setTexts] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [pages, setPages] = useState([{
    id: 1,
    texts: [],
    backgroundColor: '#ffffff',
  }]);
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageSizeChange = (size) => {
    setCanvasSize(size);
  };

  const handleAddText = (type, color, fontFamily) => {
    const fontSizeMap = {
      H1: 48,
      H2: 36,
      H3: 30,
      BODY1: 18,
      CAPTION: 14,
    };

    const newText = {
      id: `text-${texts.length + 1}`,
      text: type,
      fontSize: fontSizeMap[type] || 18,
      fontFamily: fontFamily,
      x: 50,
      y: 50 + texts.length * 30,
      color: color || selectedColor,
      isEditing: false,
    };
    const updatedPages = [...pages];
    updatedPages[currentPage].texts.push(newText);
    setPages(updatedPages);
    setTexts([...texts, newText]);
  };
  

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
  };

  const handleTextChange = (id, newText) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) => (text.id === id ? { ...text, text: newText, isEditing: false } : text))
    );
  };

  const handleDragEnd = (id, x, y) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) => (text.id === id ? { ...text, x, y } : text))
    );
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <Toolbar
          onPageSizeChange={handlePageSizeChange}
          onAddText={handleAddText}
          onTextColorChange={setSelectedColor}
          onBackgroundColorChange={handleBackgroundColorChange}
        />
      </div>
      <div className="canvas-container">
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            border: '1px solid #ddd',
            backgroundColor: backgroundColor,
          }}
        >
          <Layer>
            {texts.map((text) => (
              <Text
                key={text.id}
                text={text.text}
                fontSize={text.fontSize}
                fontFamily={text.fontFamily}
                fill={text.color}
                x={text.x}
                y={text.y}
                draggable
                onDblClick={(e) => {
                  const stage = e.target.getStage();
                  const container = stage.container();
                  const textarea = document.createElement('textarea');
                  container.appendChild(textarea);

                  textarea.value = text.text;
                  textarea.style.position = 'absolute';
                  textarea.style.top = `${e.target.attrs.y}px`;
                  textarea.style.left = `${e.target.attrs.x}px`;
                  textarea.style.fontSize = `${text.fontSize}px`;

                  textarea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                      handleTextChange(text.id, textarea.value);
                      container.removeChild(textarea);
                    }
                  });

                  textarea.focus();
                }}
                onDragEnd={(e) => handleDragEnd(text.id, e.target.x(), e.target.y())}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default CertificateDesigner;






