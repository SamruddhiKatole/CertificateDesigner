import React, { useRef, useEffect, useState } from 'react';
import Konva from 'konva';
import { Stage, Layer, Text, Rect, Image } from 'react-konva';

const Canvas = ({ certificateSize, saveHistory, selectedElement, setSelectedElement }) => {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [isLayerReady, setIsLayerReady] = useState(false); // Track layer readiness

  const width = 800;
  const height = 600;

  useEffect(() => {
    // Ensure the layer is ready before using it
    if (layerRef.current) {
      setIsLayerReady(true);
    }
  }, [layerRef.current]);

  const addText = (text, fontSize, fontFamily, fill) => {
    if (!isLayerReady) return; // Ensure the layer is ready

    const newText = new Konva.Text({
      x: 50,
      y: 50,
      text: text,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: fill,
      draggable: true,
    });

    layerRef.current.add(newText);
    layerRef.current.draw();
    saveHistory(stageRef.current);

    newText.on('click', () => {
      setSelectedElement(newText);
    });
  };

  const addRectangle = (x, y, width, height, fill) => {
    if (!isLayerReady) return; // Ensure the layer is ready

    const rect = new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: fill,
      draggable: true,
    });

    layerRef.current.add(rect);
    layerRef.current.draw();
    saveHistory(stageRef.current);

    rect.on('click', () => {
      setSelectedElement(rect);
    });
  };

  const handleBackgroundChange = (imageUrl) => {
    if (!isLayerReady) return; // Ensure the layer is ready

    const imageObj = new Image();
    imageObj.src = imageUrl;
    imageObj.onload = () => {
      const img = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: width,
        height: height,
      });

      layerRef.current.add(img);
      layerRef.current.draw();
      saveHistory(stageRef.current);
    };
  };

  const handlePointerMove = (e) => {
    const stage = stageRef.current;
    if (stage) {
      const pointerPos = stage.getPointerPosition();
      console.log('Pointer Position:', pointerPos);
    }
  };

  return (
    <div className="canvas-container" onPointerMove={handlePointerMove}>
      <Stage width={width} height={height} ref={stageRef}>
        <Layer ref={layerRef} />
      </Stage>
    </div>
  );
};

export default Canvas;
