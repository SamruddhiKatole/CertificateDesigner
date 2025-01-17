import React from 'react';
import { useDispatch } from 'react-redux';
import { updateElement } from '../redux/actions';

const BackgroundSelector = () => {
  const dispatch = useDispatch();

  const backgrounds = [
    'background1.jpg',
    'background2.jpg',
    // Add more background images
  ];

  const handleSelectBackground = (background) => {
    dispatch(updateElement('background', { background }));
  };

  return (
    <div className="background-selector">
      <h3>Select Background</h3>
      {backgrounds.map((bg, index) => (
        <button key={index} onClick={() => handleSelectBackground(bg)}>
          {bg}
        </button>
      ))}
    </div>
  );
};

export default BackgroundSelector;
