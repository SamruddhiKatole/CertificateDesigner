// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import DownloadIcon from '@mui/icons-material/Download';
// import { useNavigate } from 'react-router-dom';
// import { Stage, Layer, Text, Rect, Image, Circle, Line } from 'react-konva';
// import useImage from 'use-image';

// const BackgroundImage = ({ url, width, height, x = 0, y = 0 }) => {
//   const [image] = useImage(url, 'Anonymous');
//   return image ? <Image image={image} width={width} height={height} x={x} y={y} /> : null;
// };

// // Component for rendering a mini‑preview thumbnail of a certificate page.
// // The container is clickable and centers the preview.
// const PageThumbnail = ({ page, canvasSize, scale = 0.35, onClick }) => {
//   const thumbWidth = canvasSize.width * scale;
//   const thumbHeight = canvasSize.height * scale;

//   return (
//     <Box
//       onClick={onClick}
//       sx={{
//         width: '100%',
//         height: thumbHeight,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         overflow: 'hidden',
//         cursor: 'pointer',
//       }}
//     >
//       <Stage width={thumbWidth} height={thumbHeight} scaleX={scale} scaleY={scale}>
//         <Layer>
//           {/* Background */}
//           <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill={page.backgroundColor} />
//           {page.backgroundImage && (
//             <BackgroundImage url={page.backgroundImage} width={canvasSize.width} height={canvasSize.height} />
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
//           {/* Text elements */}
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
//           {/* Shape elements */}
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

// function HomePage() {
//   const navigate = useNavigate();
//   const [certificates, setCertificates] = useState([]);
//   const [renameDialogOpen, setRenameDialogOpen] = useState(false);
//   const [currentCertToRename, setCurrentCertToRename] = useState(null);
//   const [newName, setNewName] = useState('');

//   const previewCanvasSize = { width: 1123, height: 794 };

//   // Load certificates from localStorage on mount.
//   useEffect(() => {
//     const savedCerts = JSON.parse(localStorage.getItem('certificates')) || [];
//     setCertificates(savedCerts);
//   }, []);

//   // Create a new certificate.
//   const handleCreate = () => {
//     const newCert = {
//       id: Date.now().toString(),
//       name: `Certificate ${new Date().toLocaleDateString()}`,
//       pages: [
//         {
//           id: 1,
//           texts: [],
//           shapes: [],
//           backgroundColor: '#ffffff',
//           backgroundImage: null,
//           eSignature: null,
//         },
//       ],
//     };
//     const updatedCerts = [...certificates, newCert];
//     localStorage.setItem('certificates', JSON.stringify(updatedCerts));
//     setCertificates(updatedCerts);
//     navigate(`/designer/${newCert.id}`);
//   };

//   // Navigate to the certificate editor.
//   const handleEdit = (id) => {
//     navigate(`/designer/${id}`);
//   };

//   // Delete a certificate.
//   const handleDelete = (id) => {
//     const updatedCerts = certificates.filter((cert) => cert.id !== id);
//     localStorage.setItem('certificates', JSON.stringify(updatedCerts));
//     setCertificates(updatedCerts);
//   };

//   // Open the rename dialog.
//   const handleRename = (cert) => {
//     setCurrentCertToRename(cert);
//     setNewName(cert.name || '');
//     setRenameDialogOpen(true);
//   };

//   // Confirm renaming.
//   const confirmRename = () => {
//     const updatedCerts = certificates.map((cert) =>
//       cert.id === currentCertToRename.id ? { ...cert, name: newName } : cert
//     );
//     localStorage.setItem('certificates', JSON.stringify(updatedCerts));
//     setCertificates(updatedCerts);
//     setRenameDialogOpen(false);
//   };

//   const handleDownload = (id) => {
//     navigate(`/designer/${id}?download=true`);
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Typography variant="h3" gutterBottom>
//         Certificate Designer
//       </Typography>
//       <Button variant="contained" onClick={handleCreate} sx={{ mb: 2 }}>
//         Create Certificate
//       </Button>
//       <Typography variant="h5" gutterBottom>
//         Saved Certificates
//       </Typography>
//       <Grid container spacing={2}>
//         {certificates.map((cert) => (
//           <Grid item xs={12} sm={6} md={4} key={cert.id}>
//             <Card elevation={3}>
//               {/* Full-width, clickable preview thumbnail */}
//               {cert.pages && cert.pages[0] && (
//                 <PageThumbnail
//                   page={cert.pages[0]}
//                   canvasSize={previewCanvasSize}
//                   scale={0.35}
//                   onClick={() => handleEdit(cert.id)}
//                 />
//               )}
//               <CardContent sx={{ py: 1, px: 2 }}>
//                 <Typography variant="h6">{cert.name || `Certificate ${cert.id}`}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {`Pages: ${cert.pages.length}`}
//                 </Typography>
//               </CardContent>
//               <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 1 }}>
//                 <IconButton color="primary" onClick={() => handleEdit(cert.id)}>
//                   <EditIcon />
//                 </IconButton>
//                 <IconButton color="secondary" onClick={() => handleDelete(cert.id)}>
//                   <DeleteIcon />
//                 </IconButton>
//                 <IconButton onClick={() => handleRename(cert)}>
//                   <DriveFileRenameOutlineIcon />
//                 </IconButton>
//                 <IconButton onClick={() => handleDownload(cert.id)}>
//                   <DownloadIcon />
//                 </IconButton>
//               </CardActions>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Rename Dialog */}
//       <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
//         <DialogTitle>Rename Certificate</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="New Certificate Name"
//             fullWidth
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
//           <Button onClick={confirmRename} variant="contained">
//             Rename
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default HomePage;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Text, Rect, Image, Circle, Line } from 'react-konva';
import useImage from 'use-image';

// ---------- UTILITY COMPONENTS ----------

// Renders a background image onto the Konva canvas.
const BackgroundImage = ({ url, width, height, x = 0, y = 0 }) => {
  const [image] = useImage(url, 'Anonymous');
  return image ? <Image image={image} width={width} height={height} x={x} y={y} /> : null;
};

// Updated PageThumbnail using a "contain" strategy so the full certificate is visible.
const PageThumbnail = ({ page, canvasSize, containerWidth, containerHeight, onClick }) => {
  const scale = Math.min(containerWidth / canvasSize.width, containerHeight / canvasSize.height);
  const scaledWidth = canvasSize.width * scale;
  const scaledHeight = canvasSize.height * scale;
  const offsetX = (containerWidth - scaledWidth) / 2;
  const offsetY = (containerHeight - scaledHeight) / 2;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: containerWidth,
        height: containerHeight,
        overflow: 'hidden',
      }}
    >
      <Stage
        width={containerWidth}
        height={containerHeight}
        scaleX={scale}
        scaleY={scale}
        x={offsetX}
        y={offsetY}
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

// ---------- MAIN COMPONENT ----------

function HomePage() {
  const navigate = useNavigate();

  // Local state
  const [certificates, setCertificates] = useState([]);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [currentCertToRename, setCurrentCertToRename] = useState(null);
  const [newName, setNewName] = useState('');

  // Tabs state
  const [mainTab, setMainTab] = useState(0); // Certificate | Badge | Transcript
  const [subTab, setSubTab] = useState(0);   // Academic | Activity

  // Original design canvas size (for Konva scaling)
  const previewCanvasSize = { width: 1123, height: 794 };

  // Fixed card dimensions (used for both the card and thumbnail container)
  const cardWidth = 300;
  const cardHeight = 300;

  // Load certificates from localStorage on mount.
  useEffect(() => {
    const savedCerts = JSON.parse(localStorage.getItem('certificates')) || [];
    setCertificates(savedCerts);
  }, []);

  // Handlers for tabs
  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue);
  };
  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  // Create a new certificate.
  const handleCreate = () => {
    const newCert = {
      id: Date.now().toString(),
      name: `Certificate ${new Date().toLocaleDateString()}`,
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
    };
    const updatedCerts = [...certificates, newCert];
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
    setCertificates(updatedCerts);
    navigate(`/designer/${newCert.id}`);
  };

  // Edit certificate.
  const handleEdit = (id) => {
    navigate(`/designer/${id}`);
  };

  // Delete certificate.
  const handleDelete = (id) => {
    const updatedCerts = certificates.filter((cert) => cert.id !== id);
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
    setCertificates(updatedCerts);
  };

  // Rename certificate.
  const handleRename = (cert) => {
    setCurrentCertToRename(cert);
    setNewName(cert.name || '');
    setRenameDialogOpen(true);
  };

  const confirmRename = () => {
    const updatedCerts = certificates.map((cert) =>
      cert.id === currentCertToRename.id ? { ...cert, name: newName } : cert
    );
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
    setCertificates(updatedCerts);
    setRenameDialogOpen(false);
  };

  // Download certificate.
  const handleDownload = (id) => {
    navigate(`/designer/${id}?download=true`);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#F5F6FA' }}>
      {/* Top Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'normal', pb: '10px' }}>
          Assign Certificate
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: '#FA6551' }} onClick={handleCreate}>
          Design New Certificate
        </Button>
      </Box>

      {/* Main Tabs */}
      <Box sx={{ borderBottom: '1px solid #ddd', px: 2 }}>
        <Tabs
          value={mainTab}
          onChange={handleMainTabChange}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#FA6551' },
            '& .MuiTab-root.Mui-selected': { color: '#FA6551' },
          }}
        >
          <Tab label="Certificate" />
          <Tab label="Badge" />
          <Tab label="Transcript" />
        </Tabs>
      </Box>

      {/* Sub Tabs */}
      <Box sx={{ borderBottom: '1px solid #ddd', px: 2 }}>
        <Tabs
          value={subTab}
          onChange={handleSubTabChange}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#FA6551' },
            '& .MuiTab-root.Mui-selected': { color: '#FA6551' },
          }}
        >
          <Tab label="Academic" />
          <Tab label="Activity" />
        </Tabs>
      </Box>

      {/* Cards Container */}
      <Box sx={{ p: 2 }}>
        {certificates.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 3 }}>
            You haven’t created any Certificate yet. Click on “Design New Certificate” above.
          </Typography>
        ) : (
          <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
            {certificates.map((cert) => (
              <Grid item key={cert.id} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    position: 'relative',
                    width: cardWidth,
                    height: cardHeight,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  {/* Thumbnail Area with Overlay */}
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      '&:hover .overlay': { opacity: 1 },
                    }}
                    onClick={() => handleEdit(cert.id)}
                  >
                    {cert.pages[0] && (
                      <PageThumbnail
                        page={cert.pages[0]}
                        canvasSize={previewCanvasSize}
                        containerWidth={cardWidth}
                        containerHeight={cardHeight}
                      />
                    )}
                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        p: 1,
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                      }}
                    >
                      {/* Certificate Name at Top */}
                      <Typography variant="subtitle1" sx={{ color: '#fff', textAlign: 'center' }}>
                        {cert.name}
                      </Typography>
                      {/* Options at Bottom */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleEdit(cert.id); }}
                          sx={{ color: '#fff' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleRename(cert); }}
                          sx={{ color: '#fff' }}
                        >
                          <DriveFileRenameOutlineIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleDownload(cert.id); }}
                          sx={{ color: '#fff' }}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); handleDelete(cert.id); }}
                          sx={{ color: '#fff' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename Certificate</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Certificate Name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmRename}>
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HomePage;







