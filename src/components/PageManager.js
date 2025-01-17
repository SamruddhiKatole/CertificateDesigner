import React from 'react';
import { Stage, Layer } from 'react-konva';

const PageManager = () => {
  return (
    <Stage width={800} height={600} style={{ border: '1px solid black' }}>
      <Layer>
        {/* Elements like shapes and text will go here */}
      </Layer>
    </Stage>
  );
};

export default PageManager;






