// import React, { useState } from 'react';
// import { Stage, Layer, Text } from 'react-konva';
// import Toolbar from './Toolbar';
// import { IconButton, Box } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// // import { Text } from 'react-konva';

// function CertificateDesigner() {
//   const [canvasSize, setCanvasSize] = useState({ width: 1123, height: 794 });
//   const [texts, setTexts] = useState([]);
//   const [selectedColor, setSelectedColor] = useState('#000000');
//   const [backgroundColor, setBackgroundColor] = useState('#ffffff');
//   const [pages, setPages] = useState([{
//     id: 1,
//     texts: [],
//     backgroundColor: '#ffffff',
//   }]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const handlePageSizeChange = (size) => {
//     setCanvasSize(size);
//   };

//   const handleAddText = (type, color, fontFamily) => {
//     const fontSizeMap = {
//       H1: 48,
//       H2: 36,
//       H3: 30,
//       BODY1: 18,
//       CAPTION: 14,
//     };

//     const newText = {
//       id: `text-${texts.length + 1}`,
//       text: type,
//       fontSize: fontSizeMap[type] || 18,
//       fontFamily: fontFamily,
//       x: 50,
//       y: 50 + texts.length * 30,
//       color: color || selectedColor,
//       isEditing: false,
//     };
//     const updatedPages = [...pages];
//     updatedPages[currentPage].texts.push(newText);
//     setPages(updatedPages);
//     setTexts([...texts, newText]);
//   };
  

//   const handleBackgroundColorChange = (color) => {
//     setBackgroundColor(color);
//   };

//   const handleTextChange = (id, newText) => {
//     setTexts((prevTexts) =>
//       prevTexts.map((text) => (text.id === id ? { ...text, text: newText, isEditing: false } : text))
//     );
//   };

//   const handleDragEnd = (id, x, y) => {
//     setTexts((prevTexts) =>
//       prevTexts.map((text) => (text.id === id ? { ...text, x, y } : text))
//     );
//   };

//   return (
//     <div className="app-container">
//       <div className="sidebar">
//         <Toolbar
//           onPageSizeChange={handlePageSizeChange}
//           onAddText={handleAddText}
//           onTextColorChange={setSelectedColor}
//           onBackgroundColorChange={handleBackgroundColorChange}
//         />
//       </div>
//       <div className="canvas-container">
//         <Stage
//           width={canvasSize.width}
//           height={canvasSize.height}
//           style={{
//             border: '1px solid #ddd',
//             backgroundColor: backgroundColor,
//           }}
//         >
//           <Layer>
//             {texts.map((text) => (
//               <Text
//                 key={text.id}
//                 text={text.text}
//                 fontSize={text.fontSize}
//                 fontFamily={text.fontFamily}
//                 fill={text.color}
//                 x={text.x}
//                 y={text.y}
//                 draggable
//                 onDblClick={(e) => {
//                   const stage = e.target.getStage();
//                   const container = stage.container();
//                   const textarea = document.createElement('textarea');
//                   container.appendChild(textarea);

//                   textarea.value = text.text;
//                   textarea.style.position = 'absolute';
//                   textarea.style.top = `${e.target.attrs.y}px`;
//                   textarea.style.left = `${e.target.attrs.x}px`;
//                   textarea.style.fontSize = `${text.fontSize}px`;

//                   textarea.addEventListener('keydown', (e) => {
//                     if (e.key === 'Enter') {
//                       handleTextChange(text.id, textarea.value);
//                       container.removeChild(textarea);
//                     }
//                   });

//                   textarea.focus();
//                 }}
//                 onDragEnd={(e) => handleDragEnd(text.id, e.target.x(), e.target.y())}
//               />
//             ))}
//           </Layer>
//         </Stage>
//       </div>
//     </div>
//   );
// }

// export default CertificateDesigner;






import React, { useState } from 'react';
import { Stage, Layer, Text } from 'react-konva';
import Toolbar from './Toolbar';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TemplateSelector from './TemplateSelector';  // Import TemplateSelector
import html2canvas from 'html2canvas';  // Import html2canvas
function CertificateDesigner() {
  const [canvasSize, setCanvasSize] = useState({ width: 1123, height: 794 });
  const [texts, setTexts] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [pages, setPages] = useState([{
    id: 1,
    texts: [],
    backgroundColor: '#ffffff',
  }]);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);  // Add state for selected template

  const handlePageSizeChange = (size) => {
    setCanvasSize(size);
  };



  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  
    // Update background color from the template
    setBackgroundColor(template.backgroundImage);
  
    // Merge current texts with the new template's text elements
    const updatedTexts = template.textElements.map((templateText, index) => {
      // Check if this text element already exists in the current texts
      const existingText = texts.find((text) => text.id === templateText.id);
      return existingText
        ? { ...existingText } // Retain the edited version if it exists
        : {
            ...templateText, // Add the new text from the template
            id: `text-${index + 1}`, // Generate a unique ID
            x: 50,
            y: 50 + index * 50,
          };
    });
  
    // Update the texts state with the merged results
    setTexts(updatedTexts);
  };
  
  

  // const handleTemplateSelect = (template) => {
  //   setSelectedTemplate(template);
  //   setBackgroundColor(template.backgroundImage);
  //   setTexts(template.textElements.map((text, index) => ({
  //     ...text,
  //     id: `text-${index + 1}`,
  //     x: 50,
  //     y: 50 + index * 50,
  //   })));
  // };

  const handleAddText = (type, color, fontFamily) => {
    const fontSizeMap = {
      H1: 48,
      H2: 36,
      H3: 30,
      BODY1: 18,
      CAPTION: 14,
    };

    const newText = {
      id: `text-${texts.length + 1}`,
      text: type,
      fontSize: fontSizeMap[type] || 18,
      fontFamily: fontFamily,
      x: 50,
      y: 50 + texts.length * 30,
      color: color || selectedColor,
      isEditing: false,
    };
    const updatedPages = [...pages];
    updatedPages[currentPage].texts.push(newText);
    setPages(updatedPages);
    setTexts([...texts, newText]);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
  };

  const handleTextChange = (id, newText) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) => (text.id === id ? { ...text, text: newText, isEditing: false } : text))
    );
  };

  const handleDragEnd = (id, x, y) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) => (text.id === id ? { ...text, x, y } : text))
    );
  };

  const downloadCertificate = () => {
    const stage = document.querySelector('.canvas-container');  // Get the container of the canvas
    html2canvas(stage).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'certificate.png';  // Set the filename for the download
      link.click();  // Trigger the download
    });
  };

  // const handleTemplateSelect = (template) => {
  //   setSelectedTemplate(template);  // Update selected template
  //   setBackgroundColor(template.backgroundImage);  // Set background image
  //   // Add text elements to canvas
  //   template.textElements.forEach((text) => handleAddText(text.text, text.color, text.fontFamily));
  // };

  return (
    <div className="app-container">
      <div className="sidebar">
        <Toolbar
          onPageSizeChange={handlePageSizeChange}
          onAddText={handleAddText}
          onTextColorChange={setSelectedColor}
          onBackgroundColorChange={handleBackgroundColorChange}
        />
        <TemplateSelector onSelectTemplate={handleTemplateSelect} />  {/* Add TemplateSelector */}
      </div>
      <div className="canvas-container">
        <Stage
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            border: '1px solid #ddd',
            backgroundColor: backgroundColor,
          }}
        >
          <Layer>
            {texts.map((text) => (
              <Text
                key={text.id}
                text={text.text}
                fontSize={text.fontSize}
                fontFamily={text.fontFamily || 'Arial'}
                fill={text.color}
                x={text.x}
                y={text.y}
                draggable
                onDblClick={(e) => {
                  const stage = e.target.getStage();
                  const container = stage.container();
                  const textarea = document.createElement('textarea');
                  container.appendChild(textarea);

                  textarea.value = text.text;
                  textarea.style.position = 'absolute';
                  textarea.style.top = `${e.target.attrs.y}px`;
                  textarea.style.left = `${e.target.attrs.x}px`;
                  textarea.style.fontSize = `${text.fontSize}px`;


                  // Add the textarea to the container
                  textarea.addEventListener('pointerdown', (e) => {
                    e.stopPropagation(); // Prevent the event from bubbling to the document
                  });

                  document.addEventListener('pointerdown', () => {
                    // Ensure the textarea is still in the container before attempting to remove it
                    if (container.contains(textarea)) {
                      handleTextChange(text.id, textarea.value);
                      container.removeChild(textarea);
                    }
                  });



                  // textarea.addEventListener('keydown', (e) => {
                  //   if (e.key === 'Enter') {
                  //     handleTextChange(text.id, textarea.value);
                  //     container.removeChild(textarea);
                  //   }
                  // });

                  textarea.focus();
                }}
                onDragEnd={(e) => handleDragEnd(text.id, e.target.x(), e.target.y())}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      {/* Add Download Button */}
      <Box mt={2} textAlign="center">
        <Button variant="contained" color="primary" onClick={downloadCertificate}>
          Download Certificate
        </Button>
      </Box>
    </div>
  );
}

export default CertificateDesigner;






