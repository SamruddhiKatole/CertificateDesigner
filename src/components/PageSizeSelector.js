import React from 'react';
const PageSizeSelector = ({ handlePageSizeChange }) => {
  return (
    <div className="page-size-selector">
      <h3>Select Page Size</h3>
      <select onChange={(e) => handlePageSizeChange(e.target.value)} defaultValue="A4 Landscape">
        <option value="A4 Landscape">A4 Landscape</option>
        <option value="A4 Portrait">A4 Portrait</option>
        <option value="A3 Landscape">A3 Landscape</option>
        <option value="A3 Portrait">A3 Portrait</option>
        <option value="Legal Landscape">Legal Landscape</option>
        <option value="Legal Portrait">Legal Portrait</option>
        <option value="Custom">Custom</option>
      </select>
    </div>
  );
};

export default PageSizeSelector;

