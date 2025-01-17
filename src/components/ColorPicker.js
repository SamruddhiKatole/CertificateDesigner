import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateElement } from '../redux/actions';

const ColorPicker = () => {
  const [color, setColor] = useState('#000000');
  const dispatch = useDispatch();

  const handleColorChange = (e) => {
    setColor(e.target.value);
    dispatch(updateElement('color', { color: e.target.value }));
  };

  return (
    <div className="color-picker">
      <h3>Pick Color</h3>
      <input type="color" value={color} onChange={handleColorChange} />
    </div>
  );
};

export default ColorPicker;
