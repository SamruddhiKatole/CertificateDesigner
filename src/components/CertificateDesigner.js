import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Rect, Image, Circle, Line } from 'react-konva';
import Toolbar from './Toolbar';
import TemplateSelector from './TemplateSelector';
import PageManager from './PageManager';
import BackgroundSelector from './BackgroundSelector';
import LayerManager from './LayerManager';
import { Box, Button } from '@mui/material';
import useImage from 'use-image';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Konva from 'konva';
import { jsPDF } from 'jspdf';
const BackgroundImage = ({ url, width, height, x = 0, y = 0 }) => {
  const [image] = useImage(url, 'Anonymous');
  return image ? (
    <Image image={image} width={width} height={height} x={x} y={y} />
  ) : null;
};

// Component for rendering a small thumbnail of a page.
const PageThumbnail = ({ page, canvasSize, scale = 0.2, onClick, selected }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: selected ? '2px solid blue' : '1px solid #ccc',
        cursor: 'pointer',
        m: 0.5,
        width: canvasSize.width * scale,
        height: canvasSize.height * scale,
      }}
    >
      <Stage
        width={canvasSize.width * scale}
        height={canvasSize.height * scale}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasSize.width}
            height={canvasSize.height}
            fill={page.backgroundColor}
          />
          {page.backgroundImage && (
            <BackgroundImage
              url={page.backgroundImage}
              width={canvasSize.width}
              height={canvasSize.height}
            />
          )}
          {page.eSignature && (
            <BackgroundImage
              url={page.eSignature}
              width={150}
              height={50}
              x={canvasSize.width - 200}
              y={canvasSize.height - 100}
            />
          )}
          {page.texts.map((txt) => (
            <Text
              key={txt.id}
              text={txt.text}
              fontSize={txt.fontSize}
              fontFamily={txt.fontFamily}
              fill={txt.color}
              x={txt.x}
              y={txt.y}
            />
          ))}
          {page.shapes.map((shape) => {
            if (shape.shapeType === 'rectangle') {
              return (
                <Rect
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  opacity={shape.opacity}
                />
              );
            } else if (shape.shapeType === 'circle') {
              return (
                <Circle
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  fill={shape.fill}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  opacity={shape.opacity}
                />
              );
            } else if (shape.shapeType === 'line') {
              return (
                <Line
                  key={shape.id}
                  points={shape.points}
                  stroke={shape.stroke}
                  strokeWidth={shape.strokeWidth}
                  opacity={shape.opacity}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </Box>
  );
};

function CertificateDesigner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Certificate state contains pages with texts, shapes, background info, etc.
  const [certificate, setCertificate] = useState({
    id: id || Date.now().toString(),
    pages: [
      {
        id: 1,
        texts: [],
        shapes: [],
        backgroundColor: '#ffffff',
        backgroundImage: null,
        eSignature: null,
      },
    ],
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 1123, height: 794 });
  const [zoom, setZoom] = useState(1);

  // For undo/redo functionality.
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Reference to the Konva Stage.
  const stageRef = useRef(null);

  // Load certificate from localStorage if available.
  useEffect(() => {
    const savedCertificates = JSON.parse(localStorage.getItem('certificates')) || [];
    const found = savedCertificates.find((cert) => cert.id === id);
    if (found) {
      setCertificate(found);
    }
  }, [id]);

  // Save certificate changes to localStorage.
  useEffect(() => {
    const savedCertificates = JSON.parse(localStorage.getItem('certificates')) || [];
    const otherCerts = savedCertificates.filter((cert) => cert.id !== certificate.id);
    localStorage.setItem('certificates', JSON.stringify([...otherCerts, certificate]));
  }, [certificate]);

  const pushHistory = () => {
    setHistory([...history, certificate]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack([certificate, ...redoStack]);
    setHistory(history.slice(0, history.length - 1));
    setCertificate(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, certificate]);
    setRedoStack(redoStack.slice(1));
    setCertificate(next);
  };

  // Add a text element.
  const handleAddText = (textType, color, fontFamily) => {
    pushHistory();
    const fontSizeMap = {
      H1: 48,
      H2: 36,
      H3: 30,
      H4: 24,
      H5: 20,
      BODY1: 18,
      'BODY FONT 2': 16,
      CAPTION: 14,
    };
    const newText = {
      id: `text-${certificate.pages[currentPageIndex].texts.length + 1}-${Date.now()}`,
      text: textType,
      fontSize: fontSizeMap[textType] || 18,
      fontFamily: fontFamily,
      x: 50,
      y: 50 + certificate.pages[currentPageIndex].texts.length * 30,
      color: color,
      zIndex: certificate.pages[currentPageIndex].texts.length,
      type: 'text',
    };
    const updatedPages = [...certificate.pages];
    updatedPages[currentPageIndex].texts.push(newText);
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // Add a shape element.
  const handleAddShape = (shapeType) => {
    pushHistory();
    const newShape = {
      id: `shape-${certificate.pages[currentPageIndex].shapes.length + 1}-${Date.now()}`,
      shapeType: shapeType,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      radius: 50,
      points: [50, 50, 100, 100],
      fill: '#00D2FF',
      stroke: '#000000',
      strokeWidth: 2,
      opacity: 1,
      zIndex: certificate.pages[currentPageIndex].shapes.length,
      type: 'shape',
    };
    const updatedPages = [...certificate.pages];
    updatedPages[currentPageIndex].shapes.push(newShape);
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // Update a text element.
  const updateText = (id, newAttrs) => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          texts: page.texts.map((txt) => (txt.id === id ? { ...txt, ...newAttrs } : txt)),
        };
      }
      return page;
    });
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // Update a shape element.
  const updateShape = (id, newAttrs) => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          shapes: page.shapes.map((shape) =>
            shape.id === id ? { ...shape, ...newAttrs } : shape
          ),
        };
      }
      return page;
    });
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // Change z‑order for text or shape.
  const changeZIndex = (id, delta, elementType) => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, index) => {
      if (index === currentPageIndex) {
        if (elementType === 'text') {
          const texts = [...page.texts];
          const idx = texts.findIndex((t) => t.id === id);
          if (idx === -1) return page;
          let newIndex = idx + delta;
          if (newIndex < 0) newIndex = 0;
          if (newIndex >= texts.length) newIndex = texts.length - 1;
          const temp = texts[newIndex];
          texts[newIndex] = texts[idx];
          texts[idx] = temp;
          return { ...page, texts };
        } else if (elementType === 'shape') {
          const shapes = [...page.shapes];
          const idx = shapes.findIndex((s) => s.id === id);
          if (idx === -1) return page;
          let newIndex = idx + delta;
          if (newIndex < 0) newIndex = 0;
          if (newIndex >= shapes.length) newIndex = shapes.length - 1;
          const temp = shapes[newIndex];
          shapes[newIndex] = shapes[idx];
          shapes[idx] = temp;
          return { ...page, shapes };
        }
      }
      return page;
    });
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // Delete an element.
  const deleteElement = (id, elementType) => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, index) => {
      if (index === currentPageIndex) {
        if (elementType === 'text') {
          return { ...page, texts: page.texts.filter((t) => t.id !== id) };
        } else if (elementType === 'shape') {
          return { ...page, shapes: page.shapes.filter((s) => s.id !== id) };
        }
      }
      return page;
    });
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // Page management.
  const addPage = () => {
    pushHistory();
    const newPage = {
      id: certificate.pages.length + 1,
      texts: [],
      shapes: [],
      backgroundColor: '#ffffff',
      backgroundImage: null,
      eSignature: null,
    };
    setCertificate({ ...certificate, pages: [...certificate.pages, newPage] });
    setCurrentPageIndex(certificate.pages.length);
  };

  const removePage = () => {
    if (certificate.pages.length === 1) return;
    pushHistory();
    const updatedPages = certificate.pages.filter((_, index) => index !== currentPageIndex);
    setCertificate({ ...certificate, pages: updatedPages });
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };

  const prevPage = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  const nextPage = () => {
    if (currentPageIndex < certificate.pages.length - 1)
      setCurrentPageIndex(currentPageIndex + 1);
  };

  // Change background color.
  const handleBackgroundColorChange = (color) => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return { ...page, backgroundColor: color };
      }
      return page;
    });
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // When a template is selected.
  const handleTemplateSelect = (template) => {
    pushHistory();
    const newBgColor = '#000000';
    const textElements = Object.values(template.templateJson.rndElemSet)
      .filter(
        (elem) => elem.elementType === 'TEXT' || elem.elementType === 'VARIABLE'
      )
      .map((elem, index) => ({
        id: `text-${index + 1}-${Date.now()}`,
        text: elem.html,
        fontSize: elem.textStyle.fontSize || 18,
        fontFamily: elem.textStyle.fontFamily || 'Arial',
        x: elem.rndProps.position.x,
        y: elem.rndProps.position.y,
        color: elem.textStyle.color || '#000000',
        type: 'text',
      }));

    const updatedPages = [...certificate.pages];
    updatedPages[currentPageIndex].texts = textElements;
    updatedPages[currentPageIndex].backgroundColor = newBgColor;
    updatedPages[currentPageIndex].backgroundImage = template.imgUrl;
    console.log('New background image URL:', template.imgUrl);
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // Add an e‑signature placeholder.
  const handleAddESignature = () => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, index) => {
      if (index === currentPageIndex) {
        return {
          ...page,
          eSignature:
            'https://via.placeholder.com/150x50?text=E-Signature',
        };
      }
      return page;
    });
    setCertificate({ ...certificate, pages: updatedPages });
  };

  // Download certificate as an image.
  // This function resets the zoom first then downloads the certificate.
  const downloadCertificate = async () => {
    // Reset zoom first
    setZoom(1);
    // Allow some time for the zoom change to render
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    for (let i = 0; i < certificate.pages.length; i++) {
      setCurrentPageIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (stageRef.current) {
        const dataURL = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `certificate-${certificate.id}-page-${i + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Download certificate as a PDF.
  const downloadCertificateAsPDF = async () => {
    // Reset zoom first
    setZoom(1);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create a new jsPDF instance. Here we use 'pt' as unit and the canvas size as format.
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [canvasSize.width, canvasSize.height],
    });

    for (let i = 0; i < certificate.pages.length; i++) {
      setCurrentPageIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (stageRef.current) {
        const dataURL = stageRef.current.toDataURL();
        if (i > 0) {
          pdf.addPage();
        }
        // Add the image to the PDF. The image fills the entire PDF page.
        pdf.addImage(dataURL, 'PNG', 0, 0, canvasSize.width, canvasSize.height);
      }
    }
    pdf.save(`certificate-${certificate.id}.pdf`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const currentPage = certificate.pages[currentPageIndex];
        if (currentPage.texts.length > 0) {
          deleteElement(
            currentPage.texts[currentPage.texts.length - 1].id,
            'text'
          );
        } else if (currentPage.shapes.length > 0) {
          deleteElement(
            currentPage.shapes[currentPage.shapes.length - 1].id,
            'shape'
          );
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () =>
      window.removeEventListener('keydown', handleKeyDown);
  }, [certificate, currentPageIndex]);

  const currentPage = certificate.pages[currentPageIndex];

  useEffect(() => {
    if (searchParams.get('download')) {
      setTimeout(() => {
        downloadCertificate();
      }, 500);
    }
  }, [searchParams]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar with tools */}
      <Box sx={{ width: 320, p: 2, borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <Toolbar
          onPageSizeChange={setCanvasSize}
          onAddText={handleAddText}
          onBackgroundColorChange={handleBackgroundColorChange}
          onAddShape={handleAddShape}
          onAddESignature={handleAddESignature}
        />
        <TemplateSelector onSelectTemplate={handleTemplateSelect} />
        <PageManager
          addPage={addPage}
          removePage={removePage}
          prevPage={prevPage}
          nextPage={nextPage}
          currentPageIndex={currentPageIndex}
          totalPages={certificate.pages.length}
        />
        <LayerManager
          texts={currentPage.texts}
          shapes={currentPage.shapes}
          bringForward={(id, type) => changeZIndex(id, 1, type)}
          sendBackward={(id, type) => changeZIndex(id, -1, type)}
          deleteElement={deleteElement}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
          <Button variant="outlined" onClick={() => setZoom(zoom / 1.2)}>
            Zoom Out
          </Button>
          <Button variant="outlined" onClick={() => setZoom(zoom * 1.2)}>
            Zoom In
          </Button>
          <Button variant="outlined" onClick={() => setZoom(1)}>
            Reset Zoom
          </Button>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button variant="contained" onClick={undo}>
            Undo
          </Button>
          <Button variant="contained" onClick={redo}>
            Redo
          </Button>
          <Button variant="contained" color="primary" onClick={downloadCertificate}>
            Download PNG
          </Button>
          <Button variant="contained" color="primary" onClick={downloadCertificateAsPDF}>
            Download as PDF
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Box>
      {/* Main canvas area with thumbnails below */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          bgcolor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Main canvas */}
        <Box
          sx={{
            border: '2px solid #ccc',
            overflow: 'hidden',
            width: canvasSize.width,
            height: canvasSize.height,
            mb: 2,
          }}
        >
          <Stage
            ref={stageRef}
            width={canvasSize.width}
            height={canvasSize.height}
            scaleX={zoom}
            scaleY={zoom}
            backgroundColor={currentPage.backgroundColor}
            clip={{ x: 0, y: 0, width: canvasSize.width, height: canvasSize.height }}
          >
            <Layer>
              <Rect
                x={0}
                y={0}
                width={canvasSize.width}
                height={canvasSize.height}
                fill={currentPage.backgroundColor}
              />
              {currentPage.backgroundImage && (
                <BackgroundImage
                  url={currentPage.backgroundImage}
                  width={canvasSize.width}
                  height={canvasSize.height}
                />
              )}
              {currentPage.eSignature && (
                <BackgroundImage
                  url={currentPage.eSignature}
                  width={150}
                  height={50}
                  x={canvasSize.width - 200}
                  y={canvasSize.height - 100}
                />
              )}
              {currentPage.texts.map((txt) => (
                <Text
                  key={txt.id}
                  text={txt.text}
                  fontSize={txt.fontSize}
                  fontFamily={txt.fontFamily}
                  fill={txt.color}
                  x={txt.x}
                  y={txt.y}
                  draggable
                  onDragEnd={(e) =>
                    updateText(txt.id, { x: e.target.x(), y: e.target.y() })
                  }
                  onDblClick={(e) => {
                    const stage = e.target.getStage();
                    const container = stage.container();
                    const textarea = document.createElement('textarea');
                    container.appendChild(textarea);
                    textarea.value = txt.text;
                    textarea.style.position = 'absolute';
                    textarea.style.top = `${e.target.y()}px`;
                    textarea.style.left = `${e.target.x()}px`;
                    textarea.style.fontSize = `${txt.fontSize}px`;
                    textarea.addEventListener('pointerdown', (ev) => ev.stopPropagation());
                    const removeTextarea = () => {
                      updateText(txt.id, { text: textarea.value });
                      container.removeChild(textarea);
                      window.removeEventListener('pointerdown', removeTextarea);
                    };
                    window.addEventListener('pointerdown', removeTextarea);
                    textarea.focus();
                  }}
                />
              ))}
              {currentPage.shapes.map((shape) => {
                if (shape.shapeType === 'rectangle') {
                  return (
                    <Rect
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.fill}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      opacity={shape.opacity}
                      draggable
                      onDragEnd={(e) =>
                        updateShape(shape.id, { x: e.target.x(), y: e.target.y() })
                      }
                    />
                  );
                } else if (shape.shapeType === 'circle') {
                  return (
                    <Circle
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      fill={shape.fill}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      opacity={shape.opacity}
                      draggable
                      onDragEnd={(e) =>
                        updateShape(shape.id, { x: e.target.x(), y: e.target.y() })
                      }
                    />
                  );
                } else if (shape.shapeType === 'line') {
                  return (
                    <Line
                      key={shape.id}
                      points={shape.points}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      opacity={shape.opacity}
                      draggable
                      onDragEnd={(e) =>
                        updateShape(shape.id, { x: e.target.x(), y: e.target.y() })
                      }
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </Box>
        {/* Thumbnails for all pages */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {certificate.pages.map((page, index) => (
            <PageThumbnail
              key={page.id}
              page={page}
              canvasSize={canvasSize}
              scale={0.2}
              selected={index === currentPageIndex}
              onClick={() => setCurrentPageIndex(index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default CertificateDesigner;
