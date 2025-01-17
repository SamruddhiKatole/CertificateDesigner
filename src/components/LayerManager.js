import React from 'react';
import { useDispatch } from 'react-redux';
import { updateElement } from '../redux/actions';

const LayerManager = () => {
  const dispatch = useDispatch();

  const handleBringToFront = (id) => {
    dispatch(updateElement(id, { zIndex: 100 }));
  };

  const handleSendToBack = (id) => {
    dispatch(updateElement(id, { zIndex: -100 }));
  };

  return (
    <div className="layer-manager">
      <h3>Layer Management</h3>
      <button onClick={() => handleBringToFront()}>Bring to Front</button>
      <button onClick={() => handleSendToBack()}>Send to Back</button>
    </div>
  );
};

export default LayerManager;




