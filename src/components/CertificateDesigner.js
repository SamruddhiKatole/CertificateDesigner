// import React, { useState, useRef, useEffect } from 'react';
// import { Stage, Layer, Text, Rect, Image, Circle, Line } from 'react-konva';
// import Toolbar from './Toolbar';
// import TemplateSelector from './TemplateSelector';
// import PageManager from './PageManager';
// import BackgroundSelector from './BackgroundSelector';
// import LayerManager from './LayerManager';
// import { Box, Button } from '@mui/material';
// import useImage from 'use-image';
// import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
// import html2canvas from 'html2canvas';
// import Konva from 'konva';
// import { jsPDF } from 'jspdf';
// const BackgroundImage = ({ url, width, height, x = 0, y = 0 }) => {
//   const [image] = useImage(url, 'Anonymous');
//   return image ? (
//     <Image image={image} width={width} height={height} x={x} y={y} />
//   ) : null;
// };

// // Component for rendering a small thumbnail of a page.
// const PageThumbnail = ({ page, canvasSize, scale = 0.2, onClick, selected }) => {
//   return (
//     <Box
//       onClick={onClick}
//       sx={{
//         border: selected ? '2px solid blue' : '1px solid #ccc',
//         cursor: 'pointer',
//         m: 0.5,
//         width: canvasSize.width * scale,
//         height: canvasSize.height * scale,
//       }}
//     >
//       <Stage
//         width={canvasSize.width * scale}
//         height={canvasSize.height * scale}
//         scaleX={scale}
//         scaleY={scale}
//       >
//         <Layer>
//           <Rect
//             x={0}
//             y={0}
//             width={canvasSize.width}
//             height={canvasSize.height}
//             fill={page.backgroundColor}
//           />
//           {page.backgroundImage && (
//             <BackgroundImage
//               url={page.backgroundImage}
//               width={canvasSize.width}
//               height={canvasSize.height}
//             />
//           )}
//           {page.eSignature && (
//             <BackgroundImage
//               url={page.eSignature}
//               width={150}
//               height={50}
//               x={canvasSize.width - 200}
//               y={canvasSize.height - 100}
//             />
//           )}
//           {page.texts.map((txt) => (
//             <Text
//               key={txt.id}
//               text={txt.text}
//               fontSize={txt.fontSize}
//               fontFamily={txt.fontFamily}
//               fill={txt.color}
//               x={txt.x}
//               y={txt.y}
//             />
//           ))}
//           {page.shapes.map((shape) => {
//             if (shape.shapeType === 'rectangle') {
//               return (
//                 <Rect
//                   key={shape.id}
//                   x={shape.x}
//                   y={shape.y}
//                   width={shape.width}
//                   height={shape.height}
//                   fill={shape.fill}
//                   stroke={shape.stroke}
//                   strokeWidth={shape.strokeWidth}
//                   opacity={shape.opacity}
//                 />
//               );
//             } else if (shape.shapeType === 'circle') {
//               return (
//                 <Circle
//                   key={shape.id}
//                   x={shape.x}
//                   y={shape.y}
//                   radius={shape.radius}
//                   fill={shape.fill}
//                   stroke={shape.stroke}
//                   strokeWidth={shape.strokeWidth}
//                   opacity={shape.opacity}
//                 />
//               );
//             } else if (shape.shapeType === 'line') {
//               return (
//                 <Line
//                   key={shape.id}
//                   points={shape.points}
//                   stroke={shape.stroke}
//                   strokeWidth={shape.strokeWidth}
//                   opacity={shape.opacity}
//                 />
//               );
//             }
//             return null;
//           })}
//         </Layer>
//       </Stage>
//     </Box>
//   );
// };

// function CertificateDesigner() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   // Certificate state contains pages with texts, shapes, background info, etc.
//   const [certificate, setCertificate] = useState({
//     id: id || Date.now().toString(),
//     pages: [
//       {
//         id: 1,
//         texts: [],
//         shapes: [],
//         backgroundColor: '#ffffff',
//         backgroundImage: null,
//         eSignature: null,
//       },
//     ],
//   });
//   const [currentPageIndex, setCurrentPageIndex] = useState(0);
//   const [canvasSize, setCanvasSize] = useState({ width: 1123, height: 794 });
//   const [zoom, setZoom] = useState(1);

//   // For undo/redo functionality.
//   const [history, setHistory] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);

//   // Reference to the Konva Stage.
//   const stageRef = useRef(null);

//   // Load certificate from localStorage if available.
//   useEffect(() => {
//     const savedCertificates = JSON.parse(localStorage.getItem('certificates')) || [];
//     const found = savedCertificates.find((cert) => cert.id === id);
//     if (found) {
//       setCertificate(found);
//     }
//   }, [id]);

//   // Save certificate changes to localStorage.
//   useEffect(() => {
//     const savedCertificates = JSON.parse(localStorage.getItem('certificates')) || [];
//     const otherCerts = savedCertificates.filter((cert) => cert.id !== certificate.id);
//     localStorage.setItem('certificates', JSON.stringify([...otherCerts, certificate]));
//   }, [certificate]);

//   const pushHistory = () => {
//     setHistory([...history, certificate]);
//     setRedoStack([]);
//   };

//   const undo = () => {
//     if (history.length === 0) return;
//     const previous = history[history.length - 1];
//     setRedoStack([certificate, ...redoStack]);
//     setHistory(history.slice(0, history.length - 1));
//     setCertificate(previous);
//   };

//   const redo = () => {
//     if (redoStack.length === 0) return;
//     const next = redoStack[0];
//     setHistory([...history, certificate]);
//     setRedoStack(redoStack.slice(1));
//     setCertificate(next);
//   };

//   // Add a text element.
//   const handleAddText = (textType, color, fontFamily) => {
//     pushHistory();
//     const fontSizeMap = {
//       H1: 48,
//       H2: 36,
//       H3: 30,
//       H4: 24,
//       H5: 20,
//       BODY1: 18,
//       'BODY FONT 2': 16,
//       CAPTION: 14,
//     };
//     const newText = {
//       id: `text-${certificate.pages[currentPageIndex].texts.length + 1}-${Date.now()}`,
//       text: textType,
//       fontSize: fontSizeMap[textType] || 18,
//       fontFamily: fontFamily,
//       x: 50,
//       y: 50 + certificate.pages[currentPageIndex].texts.length * 30,
//       color: color,
//       zIndex: certificate.pages[currentPageIndex].texts.length,
//       type: 'text',
//     };
//     const updatedPages = [...certificate.pages];
//     updatedPages[currentPageIndex].texts.push(newText);
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // Add a shape element.
//   const handleAddShape = (shapeType) => {
//     pushHistory();
//     const newShape = {
//       id: `shape-${certificate.pages[currentPageIndex].shapes.length + 1}-${Date.now()}`,
//       shapeType: shapeType,
//       x: 100,
//       y: 100,
//       width: 100,
//       height: 100,
//       radius: 50,
//       points: [50, 50, 100, 100],
//       fill: '#00D2FF',
//       stroke: '#000000',
//       strokeWidth: 2,
//       opacity: 1,
//       zIndex: certificate.pages[currentPageIndex].shapes.length,
//       type: 'shape',
//     };
//     const updatedPages = [...certificate.pages];
//     updatedPages[currentPageIndex].shapes.push(newShape);
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // Update a text element.
//   const updateText = (id, newAttrs) => {
//     pushHistory();
//     const updatedPages = certificate.pages.map((page, index) => {
//       if (index === currentPageIndex) {
//         return {
//           ...page,
//           texts: page.texts.map((txt) => (txt.id === id ? { ...txt, ...newAttrs } : txt)),
//         };
//       }
//       return page;
//     });
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // Update a shape element.
//   const updateShape = (id, newAttrs) => {
//     pushHistory();
//     const updatedPages = certificate.pages.map((page, index) => {
//       if (index === currentPageIndex) {
//         return {
//           ...page,
//           shapes: page.shapes.map((shape) =>
//             shape.id === id ? { ...shape, ...newAttrs } : shape
//           ),
//         };
//       }
//       return page;
//     });
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // Change z‑order for text or shape.
//   const changeZIndex = (id, delta, elementType) => {
//     pushHistory();
//     const updatedPages = certificate.pages.map((page, index) => {
//       if (index === currentPageIndex) {
//         if (elementType === 'text') {
//           const texts = [...page.texts];
//           const idx = texts.findIndex((t) => t.id === id);
//           if (idx === -1) return page;
//           let newIndex = idx + delta;
//           if (newIndex < 0) newIndex = 0;
//           if (newIndex >= texts.length) newIndex = texts.length - 1;
//           const temp = texts[newIndex];
//           texts[newIndex] = texts[idx];
//           texts[idx] = temp;
//           return { ...page, texts };
//         } else if (elementType === 'shape') {
//           const shapes = [...page.shapes];
//           const idx = shapes.findIndex((s) => s.id === id);
//           if (idx === -1) return page;
//           let newIndex = idx + delta;
//           if (newIndex < 0) newIndex = 0;
//           if (newIndex >= shapes.length) newIndex = shapes.length - 1;
//           const temp = shapes[newIndex];
//           shapes[newIndex] = shapes[idx];
//           shapes[idx] = temp;
//           return { ...page, shapes };
//         }
//       }
//       return page;
//     });
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // Delete an element.
//   const deleteElement = (id, elementType) => {
//     pushHistory();
//     const updatedPages = certificate.pages.map((page, index) => {
//       if (index === currentPageIndex) {
//         if (elementType === 'text') {
//           return { ...page, texts: page.texts.filter((t) => t.id !== id) };
//         } else if (elementType === 'shape') {
//           return { ...page, shapes: page.shapes.filter((s) => s.id !== id) };
//         }
//       }
//       return page;
//     });
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // Page management.
//   const addPage = () => {
//     pushHistory();
//     const newPage = {
//       id: certificate.pages.length + 1,
//       texts: [],
//       shapes: [],
//       backgroundColor: '#ffffff',
//       backgroundImage: null,
//       eSignature: null,
//     };
//     setCertificate({ ...certificate, pages: [...certificate.pages, newPage] });
//     setCurrentPageIndex(certificate.pages.length);
//   };

//   const removePage = () => {
//     if (certificate.pages.length === 1) return;
//     pushHistory();
//     const updatedPages = certificate.pages.filter((_, index) => index !== currentPageIndex);
//     setCertificate({ ...certificate, pages: updatedPages });
//     setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
//   };

//   const prevPage = () => {
//     if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
//   };

//   const nextPage = () => {
//     if (currentPageIndex < certificate.pages.length - 1)
//       setCurrentPageIndex(currentPageIndex + 1);
//   };

//   // Change background color.
//   const handleBackgroundColorChange = (color) => {
//     pushHistory();
//     const updatedPages = certificate.pages.map((page, index) => {
//       if (index === currentPageIndex) {
//         return { ...page, backgroundColor: color };
//       }
//       return page;
//     });
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // When a template is selected.
//   const handleTemplateSelect = (template) => {
//     pushHistory();
//     const newBgColor = '#000000';
//     const textElements = Object.values(template.templateJson.rndElemSet)
//       .filter(
//         (elem) => elem.elementType === 'TEXT' || elem.elementType === 'VARIABLE'
//       )
//       .map((elem, index) => ({
//         id: `text-${index + 1}-${Date.now()}`,
//         text: elem.html,
//         fontSize: elem.textStyle.fontSize || 18,
//         fontFamily: elem.textStyle.fontFamily || 'Arial',
//         x: elem.rndProps.position.x,
//         y: elem.rndProps.position.y,
//         color: elem.textStyle.color || '#000000',
//         type: 'text',
//       }));

//     const updatedPages = [...certificate.pages];
//     updatedPages[currentPageIndex].texts = textElements;
//     updatedPages[currentPageIndex].backgroundColor = newBgColor;
//     updatedPages[currentPageIndex].backgroundImage = template.imgUrl;
//     console.log('New background image URL:', template.imgUrl);
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // Add an e‑signature placeholder.
//   const handleAddESignature = () => {
//     pushHistory();
//     const updatedPages = certificate.pages.map((page, index) => {
//       if (index === currentPageIndex) {
//         return {
//           ...page,
//           eSignature:
//             'https://via.placeholder.com/150x50?text=E-Signature',
//         };
//       }
//       return page;
//     });
//     setCertificate({ ...certificate, pages: updatedPages });
//   };

//   // Download certificate as an image.
//   // This function resets the zoom first then downloads the certificate.
//   const downloadCertificate = async () => {
//     // Reset zoom first
//     setZoom(1);
//     // Allow some time for the zoom change to render
//     await new Promise((resolve) => setTimeout(resolve, 500));
    
//     for (let i = 0; i < certificate.pages.length; i++) {
//       setCurrentPageIndex(i);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       if (stageRef.current) {
//         const dataURL = stageRef.current.toDataURL();
//         const link = document.createElement('a');
//         link.href = dataURL;
//         link.download = `certificate-${certificate.id}-page-${i + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     }
//   };

//   // Download certificate as a PDF.
//   const downloadCertificateAsPDF = async () => {
//     // Reset zoom first
//     setZoom(1);
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     // Create a new jsPDF instance. Here we use 'pt' as unit and the canvas size as format.
//     const pdf = new jsPDF({
//       orientation: 'landscape',
//       unit: 'pt',
//       format: [canvasSize.width, canvasSize.height],
//     });

//     for (let i = 0; i < certificate.pages.length; i++) {
//       setCurrentPageIndex(i);
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       if (stageRef.current) {
//         const dataURL = stageRef.current.toDataURL();
//         if (i > 0) {
//           pdf.addPage();
//         }
//         // Add the image to the PDF. The image fills the entire PDF page.
//         pdf.addImage(dataURL, 'PNG', 0, 0, canvasSize.width, canvasSize.height);
//       }
//     }
//     pdf.save(`certificate-${certificate.id}.pdf`);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Delete' || e.key === 'Backspace') {
//         const currentPage = certificate.pages[currentPageIndex];
//         if (currentPage.texts.length > 0) {
//           deleteElement(
//             currentPage.texts[currentPage.texts.length - 1].id,
//             'text'
//           );
//         } else if (currentPage.shapes.length > 0) {
//           deleteElement(
//             currentPage.shapes[currentPage.shapes.length - 1].id,
//             'shape'
//           );
//         }
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () =>
//       window.removeEventListener('keydown', handleKeyDown);
//   }, [certificate, currentPageIndex]);

//   const currentPage = certificate.pages[currentPageIndex];

//   useEffect(() => {
//     if (searchParams.get('download')) {
//       setTimeout(() => {
//         downloadCertificate();
//       }, 500);
//     }
//   }, [searchParams]);

//   return (
//     <Box sx={{ display: 'flex', height: '100vh' }}>
//       {/* Sidebar with tools */}
//       <Box sx={{ width: 320, p: 2, borderRight: '1px solid #ddd', overflowY: 'auto' }}>
//         <Toolbar
//           onPageSizeChange={setCanvasSize}
//           onAddText={handleAddText}
//           onBackgroundColorChange={handleBackgroundColorChange}
//           onAddShape={handleAddShape}
//           onAddESignature={handleAddESignature}
//         />
//         <TemplateSelector onSelectTemplate={handleTemplateSelect} />
//         <PageManager
//           addPage={addPage}
//           removePage={removePage}
//           prevPage={prevPage}
//           nextPage={nextPage}
//           currentPageIndex={currentPageIndex}
//           totalPages={certificate.pages.length}
//         />
//         <LayerManager
//           texts={currentPage.texts}
//           shapes={currentPage.shapes}
//           bringForward={(id, type) => changeZIndex(id, 1, type)}
//           sendBackward={(id, type) => changeZIndex(id, -1, type)}
//           deleteElement={deleteElement}
//         />
//         <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
//           <Button variant="outlined" onClick={() => setZoom(zoom / 1.2)}>
//             Zoom Out
//           </Button>
//           <Button variant="outlined" onClick={() => setZoom(zoom * 1.2)}>
//             Zoom In
//           </Button>
//           <Button variant="outlined" onClick={() => setZoom(1)}>
//             Reset Zoom
//           </Button>
//         </Box>
//         <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
//           <Button variant="contained" onClick={undo}>
//             Undo
//           </Button>
//           <Button variant="contained" onClick={redo}>
//             Redo
//           </Button>
//           <Button variant="contained" color="primary" onClick={downloadCertificate}>
//             Download PNG
//           </Button>
//           <Button variant="contained" color="primary" onClick={downloadCertificateAsPDF}>
//             Download as PDF
//           </Button>
//           <Button variant="outlined" onClick={() => navigate('/')}>
//             Back to Home
//           </Button>
//         </Box>
//       </Box>
//       {/* Main canvas area with thumbnails below */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           p: 2,
//           bgcolor: '#f5f5f5',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         {/* Main canvas */}
//         <Box
//           sx={{
//             border: '2px solid #ccc',
//             overflow: 'hidden',
//             width: canvasSize.width,
//             height: canvasSize.height,
//             mb: 2,
//           }}
//         >
//           <Stage
//             ref={stageRef}
//             width={canvasSize.width}
//             height={canvasSize.height}
//             scaleX={zoom}
//             scaleY={zoom}
//             backgroundColor={currentPage.backgroundColor}
//             clip={{ x: 0, y: 0, width: canvasSize.width, height: canvasSize.height }}
//           >
//             <Layer>
//               <Rect
//                 x={0}
//                 y={0}
//                 width={canvasSize.width}
//                 height={canvasSize.height}
//                 fill={currentPage.backgroundColor}
//               />
//               {currentPage.backgroundImage && (
//                 <BackgroundImage
//                   url={currentPage.backgroundImage}
//                   width={canvasSize.width}
//                   height={canvasSize.height}
//                 />
//               )}
//               {currentPage.eSignature && (
//                 <BackgroundImage
//                   url={currentPage.eSignature}
//                   width={150}
//                   height={50}
//                   x={canvasSize.width - 200}
//                   y={canvasSize.height - 100}
//                 />
//               )}
//               {currentPage.texts.map((txt) => (
//                 <Text
//                   key={txt.id}
//                   text={txt.text}
//                   fontSize={txt.fontSize}
//                   fontFamily={txt.fontFamily}
//                   fill={txt.color}
//                   x={txt.x}
//                   y={txt.y}
//                   draggable
//                   onDragEnd={(e) =>
//                     updateText(txt.id, { x: e.target.x(), y: e.target.y() })
//                   }
//                   onDblClick={(e) => {
//                     const stage = e.target.getStage();
//                     const container = stage.container();
//                     const textarea = document.createElement('textarea');
//                     container.appendChild(textarea);
//                     textarea.value = txt.text;
//                     textarea.style.position = 'absolute';
//                     textarea.style.top = `${e.target.y()}px`;
//                     textarea.style.left = `${e.target.x()}px`;
//                     textarea.style.fontSize = `${txt.fontSize}px`;
//                     textarea.addEventListener('pointerdown', (ev) => ev.stopPropagation());
//                     const removeTextarea = () => {
//                       updateText(txt.id, { text: textarea.value });
//                       container.removeChild(textarea);
//                       window.removeEventListener('pointerdown', removeTextarea);
//                     };
//                     window.addEventListener('pointerdown', removeTextarea);
//                     textarea.focus();
//                   }}
//                 />
//               ))}
//               {currentPage.shapes.map((shape) => {
//                 if (shape.shapeType === 'rectangle') {
//                   return (
//                     <Rect
//                       key={shape.id}
//                       x={shape.x}
//                       y={shape.y}
//                       width={shape.width}
//                       height={shape.height}
//                       fill={shape.fill}
//                       stroke={shape.stroke}
//                       strokeWidth={shape.strokeWidth}
//                       opacity={shape.opacity}
//                       draggable
//                       onDragEnd={(e) =>
//                         updateShape(shape.id, { x: e.target.x(), y: e.target.y() })
//                       }
//                     />
//                   );
//                 } else if (shape.shapeType === 'circle') {
//                   return (
//                     <Circle
//                       key={shape.id}
//                       x={shape.x}
//                       y={shape.y}
//                       radius={shape.radius}
//                       fill={shape.fill}
//                       stroke={shape.stroke}
//                       strokeWidth={shape.strokeWidth}
//                       opacity={shape.opacity}
//                       draggable
//                       onDragEnd={(e) =>
//                         updateShape(shape.id, { x: e.target.x(), y: e.target.y() })
//                       }
//                     />
//                   );
//                 } else if (shape.shapeType === 'line') {
//                   return (
//                     <Line
//                       key={shape.id}
//                       points={shape.points}
//                       stroke={shape.stroke}
//                       strokeWidth={shape.strokeWidth}
//                       opacity={shape.opacity}
//                       draggable
//                       onDragEnd={(e) =>
//                         updateShape(shape.id, { x: e.target.x(), y: e.target.y() })
//                       }
//                     />
//                   );
//                 }
//                 return null;
//               })}
//             </Layer>
//           </Stage>
//         </Box>
//         {/* Thumbnails for all pages */}
//         <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
//           {certificate.pages.map((page, index) => (
//             <PageThumbnail
//               key={page.id}
//               page={page}
//               canvasSize={canvasSize}
//               scale={0.2}
//               selected={index === currentPageIndex}
//               onClick={() => setCurrentPageIndex(index)}
//             />
//           ))}
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default CertificateDesigner;








import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Card, CardHeader, CardContent, IconButton, Divider, Menu, MenuItem } from '@mui/material';
import { Stage, Layer, Rect, Text, Circle, Line, Image as KonvaImage } from 'react-konva';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import useImage from 'use-image';
import MenuIcon from '@mui/icons-material/Menu';
import PagesIcon from '@mui/icons-material/Description';
import TemplateIcon from '@mui/icons-material/Palette';
import VariableIcon from '@mui/icons-material/Pin';
import BackgroundIcon from '@mui/icons-material/Wallpaper';
import ImageIcon from '@mui/icons-material/Image';
import TextIcon from '@mui/icons-material/TextFields';
import FontIcon from '@mui/icons-material/FontDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
const containedBtnStyle = { backgroundColor: '#FA6551', color: '#fff', '&:hover': { backgroundColor: '#FA6551' } };
const outlinedBtnStyle = { borderColor: '#FA6551', color: '#FA6551', '&:hover': { borderColor: '#FA6551', backgroundColor: 'rgba(250,101,81,0.1)' } };
const BackgroundImage = ({ url, width, height, x = 0, y = 0 }) => {
  const [image] = useImage(url, 'Anonymous');
  return image ? <KonvaImage image={image} width={width} height={height} x={x} y={y} /> : null;
};
const PageThumbnail = ({ page, canvasSize, scale = 0.2 }) => (
  <Stage width={canvasSize.width * scale} height={canvasSize.height * scale} scaleX={scale} scaleY={scale}>
    <Layer>
      <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill={page.backgroundColor} />
      {page.backgroundImage && <BackgroundImage url={page.backgroundImage} width={canvasSize.width} height={canvasSize.height} />}
      {page.eSignature && <BackgroundImage url={page.eSignature} width={150} height={50} x={canvasSize.width - 200} y={canvasSize.height - 100} />}
      {page.texts.map((txt) => (
        <Text key={txt.id} text={txt.text} fontSize={txt.fontSize} fontFamily={txt.fontFamily} fill={txt.color} x={txt.x} y={txt.y} />
      ))}
      {page.shapes.map((shape) => {
        if (shape.shapeType === 'rectangle')
          return <Rect key={shape.id} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} opacity={shape.opacity} />;
        if (shape.shapeType === 'circle')
          return <Circle key={shape.id} x={shape.x} y={shape.y} radius={shape.radius} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} opacity={shape.opacity} />;
        if (shape.shapeType === 'line')
          return <Line key={shape.id} points={shape.points} stroke={shape.stroke} strokeWidth={shape.strokeWidth} opacity={shape.opacity} />;
        return null;
      })}
    </Layer>
  </Stage>
);
export default function CertificateDesigner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [certificate, setCertificate] = useState({
    id: id || Date.now().toString(),
    pages: [{ id: 1, texts: [], shapes: [], backgroundColor: '#ffffff', backgroundImage: null, eSignature: null }],
  });
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 1123, height: 794 });
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const stageRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);
  useEffect(() => {
    const savedCertificates = JSON.parse(localStorage.getItem('certificates')) || [];
    const found = savedCertificates.find((cert) => cert.id === id);
    if (found) setCertificate(found);
  }, [id]);
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
  const addPage = () => {
    pushHistory();
    const newPage = { id: certificate.pages.length + 1, texts: [], shapes: [], backgroundColor: '#ffffff', backgroundImage: null, eSignature: null };
    setCertificate({ ...certificate, pages: [...certificate.pages, newPage] });
    setCurrentPageIndex(certificate.pages.length);
  };
  const removePage = (pageIndex) => {
    if (certificate.pages.length === 1) return;
    pushHistory();
    const updatedPages = certificate.pages.filter((_, idx) => idx !== pageIndex);
    setCertificate({ ...certificate, pages: updatedPages });
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };
  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedPageIndex(index);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPageIndex(null);
  };
  const handleMenuAddPage = () => {
    addPage();
    handleMenuClose();
  };
  const handleMenuRemovePage = () => {
    if (selectedPageIndex !== null) removePage(selectedPageIndex);
    handleMenuClose();
  };
  const handleAddText = (textLabel = 'New Text') => {
    pushHistory();
    const newText = { id: `text-${Date.now()}`, text: textLabel, fontSize: 24, fontFamily: 'Arial', x: 50, y: 50, color: '#000000', type: 'text' };
    const updatedPages = [...certificate.pages];
    updatedPages[currentPageIndex].texts.push(newText);
    setCertificate({ ...certificate, pages: updatedPages });
  };
  const handleAddShape = (shapeType) => {
    pushHistory();
    const newShape = { id: `shape-${Date.now()}`, shapeType, x: 100, y: 100, width: 100, height: 100, radius: 50, points: [50, 50, 100, 100], fill: '#00D2FF', stroke: '#000000', strokeWidth: 2, opacity: 1, type: 'shape' };
    const updatedPages = [...certificate.pages];
    updatedPages[currentPageIndex].shapes.push(newShape);
    setCertificate({ ...certificate, pages: updatedPages });
  };
  const handleAddESignature = () => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, idx) => idx === currentPageIndex ? { ...page, eSignature: 'https://via.placeholder.com/150x50?text=E-Signature' } : page);
    setCertificate({ ...certificate, pages: updatedPages });
  };
  const updateText = (id, newAttrs) => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, idx) => idx === currentPageIndex ? { ...page, texts: page.texts.map((t) => (t.id === id ? { ...t, ...newAttrs } : t)) } : page);
    setCertificate({ ...certificate, pages: updatedPages });
  };
  const updateShape = (id, newAttrs) => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, idx) => idx === currentPageIndex ? { ...page, shapes: page.shapes.map((s) => (s.id === id ? { ...s, ...newAttrs } : s)) } : page);
    setCertificate({ ...certificate, pages: updatedPages });
  };
  const deleteElement = (id, elementType) => {
    pushHistory();
    const updatedPages = certificate.pages.map((page, idx) => {
      if (idx === currentPageIndex) {
        if (elementType === 'text') return { ...page, texts: page.texts.filter((t) => t.id !== id) };
        else if (elementType === 'shape') return { ...page, shapes: page.shapes.filter((s) => s.id !== id) };
      }
      return page;
    });
    setCertificate({ ...certificate, pages: updatedPages });
  };
  const downloadCertificate = async () => {
    setZoom(1);
    await new Promise((resolve) => setTimeout(resolve, 500));
    for (let i = 0; i < certificate.pages.length; i++) {
      setCurrentPageIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
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
  const downloadCertificateAsPDF = async () => {
    setZoom(1);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [canvasSize.width, canvasSize.height] });
    for (let i = 0; i < certificate.pages.length; i++) {
      setCurrentPageIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (stageRef.current) {
        const dataURL = stageRef.current.toDataURL();
        if (i > 0) pdf.addPage();
        pdf.addImage(dataURL, 'PNG', 0, 0, canvasSize.width, canvasSize.height);
      }
    }
    pdf.save(`certificate-${certificate.id}.pdf`);
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const pg = certificate.pages[currentPageIndex];
        if (pg.texts.length > 0) deleteElement(pg.texts[pg.texts.length - 1].id, 'text');
        else if (pg.shapes.length > 0) deleteElement(pg.shapes[pg.shapes.length - 1].id, 'shape');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [certificate, currentPageIndex]);
  useEffect(() => {
    if (searchParams.get('download')) {
      setTimeout(() => { downloadCertificate(); }, 500);
    }
  }, []);
  const currentPage = certificate.pages[currentPageIndex];
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: '27%', display: 'flex' }}>
        <Box sx={{ width: 119, bgcolor: '#273142', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2, pb: 2 }}>
          <IconButton sx={{ color: '#fff', mb: 3 }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PagesIcon />
              <Typography variant="caption">Pages</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TemplateIcon />
              <Typography variant="caption">Templates</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <VariableIcon />
              <Typography variant="caption">Variables</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BackgroundIcon />
              <Typography variant="caption">Background</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ImageIcon />
              <Typography variant="caption">Images</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextIcon />
              <Typography variant="caption">Text</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FontIcon />
              <Typography variant="caption">Fonts</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 'auto', textAlign: 'center' }}>
            <Divider sx={{ mb: 1, bgcolor: '#4a4a4a' }} />
            <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>Powered by</Typography>
            {/* <Typography variant="caption" display="block">TruScholar</Typography> */}
            <Box component="img" src="https://truscholar-assets-public.s3.ap-south-1.amazonaws.com/websiteimages/ts+logo+hat+in+top-01.svg" sx={{ width: '80%', mt: 1 }} />
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#ffffff', overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Selected Page</Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>Current page seen here</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button variant="contained" sx={containedBtnStyle} onClick={addPage}>Add Page</Button>
            <Button variant="outlined" sx={outlinedBtnStyle} onClick={() => removePage(currentPageIndex)}>Remove Page</Button>
          </Box>
          {certificate.pages.map((page, index) => (
            <Card key={page.id} sx={{ mb: 2, border: index === currentPageIndex ? '2px solid #1976d2' : '1px solid #ccc', cursor: 'pointer' }} onClick={() => setCurrentPageIndex(index)}>
              <CardHeader title={`Page No.${index + 1}`} action={<IconButton onClick={(e) => { e.stopPropagation(); handleMenuClick(e, index); }}><MoreVertIcon /></IconButton>} />
              <CardContent>
                <Box sx={{ width: 200, height: 140 }}>
                  <PageThumbnail page={page} canvasSize={canvasSize} />
                </Box>
              </CardContent>
            </Card>
          ))}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuAddPage}>Add Page</MenuItem>
            <MenuItem onClick={handleMenuRemovePage}>Remove Page</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box sx={{ width: '77%', p: 0, overflowY: 'auto' }}>
        <Box sx={{ backgroundColor: '#fff', border: '10px solid #fff', padding: 2, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" sx={outlinedBtnStyle} onClick={() => setZoom(zoom / 1.2)}>Zoom Out</Button>
          <Typography sx={{ alignSelf: 'center' }}>{Math.round(zoom * 100)}%</Typography>
          <Button variant="outlined" sx={outlinedBtnStyle} onClick={() => setZoom(zoom * 1.2)}>Zoom In</Button>
          <Button variant="outlined" sx={outlinedBtnStyle} onClick={() => setZoom(1)}>Reset</Button>
          <Button variant="outlined" sx={outlinedBtnStyle} onClick={undo}>Undo</Button>
          <Button variant="outlined" sx={outlinedBtnStyle} onClick={redo}>Redo</Button>
          <Button variant="contained" sx={containedBtnStyle} onClick={downloadCertificate}>Download PNG</Button>
          <Button variant="contained" sx={containedBtnStyle} onClick={downloadCertificateAsPDF}>Download PDF</Button>
          <Button variant="outlined" sx={outlinedBtnStyle} onClick={() => navigate('/')}>Home</Button>
        </Box>
        <Box sx={{ border: '1px solid #ccc', overflow: 'hidden', width: canvasSize.width, height: canvasSize.height, mb: 2, margin: '0 auto' }}>
          <Stage ref={stageRef} width={canvasSize.width} height={canvasSize.height} scaleX={zoom} scaleY={zoom}>
            <Layer>
              <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill={currentPage.backgroundColor} />
              {currentPage.backgroundImage && <BackgroundImage url={currentPage.backgroundImage} width={canvasSize.width} height={canvasSize.height} />}
              {currentPage.eSignature && <BackgroundImage url={currentPage.eSignature} width={150} height={50} x={canvasSize.width - 200} y={canvasSize.height - 100} />}
              {currentPage.texts.map((txt) => (
                <Text key={txt.id} text={txt.text} fontSize={txt.fontSize} fontFamily={txt.fontFamily} fill={txt.color} x={txt.x} y={txt.y} draggable onDragEnd={(e) => updateText(txt.id, { x: e.target.x(), y: e.target.y() })} onDblClick={(e) => {
                  const stage = e.target.getStage();
                  const container = stage.container();
                  const textarea = document.createElement('textarea');
                  container.appendChild(textarea);
                  textarea.value = txt.text;
                  textarea.style.position = 'absolute';
                  textarea.style.top = `${e.evt.clientY}px`;
                  textarea.style.left = `${e.evt.clientX}px`;
                  textarea.style.fontSize = `${txt.fontSize}px`;
                  textarea.style.fontFamily = txt.fontFamily;
                  textarea.style.color = txt.color;
                  textarea.addEventListener('pointerdown', (ev) => ev.stopPropagation());
                  const removeTextarea = () => {
                    updateText(txt.id, { text: textarea.value });
                    container.removeChild(textarea);
                    window.removeEventListener('pointerdown', removeTextarea);
                  };
                  window.addEventListener('pointerdown', removeTextarea);
                  textarea.focus();
                }} />
              ))}
              {currentPage.shapes.map((shape) => {
                if (shape.shapeType === 'rectangle') return <Rect key={shape.id} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} opacity={shape.opacity} draggable onDragEnd={(e) => updateShape(shape.id, { x: e.target.x(), y: e.target.y() })} />;
                if (shape.shapeType === 'circle') return <Circle key={shape.id} x={shape.x} y={shape.y} radius={shape.radius} fill={shape.fill} stroke={shape.stroke} strokeWidth={shape.strokeWidth} opacity={shape.opacity} draggable onDragEnd={(e) => updateShape(shape.id, { x: e.target.x(), y: e.target.y() })} />;
                if (shape.shapeType === 'line') return <Line key={shape.id} points={shape.points} stroke={shape.stroke} strokeWidth={shape.strokeWidth} opacity={shape.opacity} draggable onDragEnd={(e) => updateShape(shape.id, { x: e.target.x(), y: e.target.y() })} />;
                return null;
              })}
            </Layer>
          </Stage>
        </Box>
      </Box>
    </Box>
  );
}











































































