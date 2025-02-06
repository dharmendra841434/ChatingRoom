import React from "react";
import "./Loader.css"; // Ensure you have the CSS file imported

const IphoneLoader = () => {
  return (
    <div className="loader">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className={`bar${i + 1}`} />
      ))}
    </div>
  );
};

export default IphoneLoader;
