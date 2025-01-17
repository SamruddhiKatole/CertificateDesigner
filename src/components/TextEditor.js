import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateElement } from 'certificate-designer\src\redux\actions.js';
const TextEditor = ({ element }) => {
  // Always call hooks in the same order
  const dispatch = useDispatch();

  // Conditionally initialize state only after hooks are called
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (element) {
      setText(element.text);
      setFontSize(element.fontSize);
    }
  }, [element]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    dispatch(updateElement(element.id, { text: e.target.value }));
  };

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
    dispatch(updateElement(element.id, { fontSize: e.target.value }));
  };

  // Only render the editor if the element is provided
  if (!element) return null;

  return (
    <div className="text-editor">
      <h3>Edit Text</h3>
      <input type="text" value={text} onChange={handleTextChange} />
      <input
        type="number"
        value={fontSize}
        onChange={handleFontSizeChange}
        min="10"
        max="100"
      />
    </div>
  );
};

export default TextEditor;

