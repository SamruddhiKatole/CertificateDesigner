import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

const BackgroundColorPicker = ({ handleColorChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorSelect = (color) => {
    handleColorChange(color);
    setShowColorPicker(false); // Close the color picker after selecting a color
  };

  return (
    <div className="background-color-picker">
      <button onClick={toggleColorPicker}>Background Color</button>
      {showColorPicker && (
        <div className="color-picker-container">
          <SketchPicker 
            onChangeComplete={(color) => handleColorSelect(color)} // Use handleColorSelect to close after selection
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundColorPicker;
