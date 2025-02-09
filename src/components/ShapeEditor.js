import React from 'react';
import { useDispatch } from 'react-redux';
import { addElement } from '../redux/actions';
const ShapeEditor = ({ element }) => {
  const dispatch = useDispatch();

  const handleAddShape = (type) => {
    const shape = { id: Date.now(), type, x: 100, y: 100, width: 100, height: 100, color: 'black' };
    dispatch(addElement(shape));
  };

  return (
    <div className="shape-editor">
      <h3>Add Shape</h3>
      <button onClick={() => handleAddShape('rect')}>Rectangle</button>
      <button onClick={() => handleAddShape('circle')}>Circle</button>
    </div>
  );
};

export default ShapeEditor;