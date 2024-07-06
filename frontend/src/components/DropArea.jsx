import React, { useState } from 'react';
import "./DropArea.css";

export default function DropArea({ onDrop, showAreas, setShowAreas }) {
  const [showDrop, setShowDrop] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop();
    setShowDrop(false);
  };

  return (
    showAreas && (
      <section
        onDragEnter={() => { setShowDrop(true); setShowAreas(true); }}
        onDragLeave={() => { setShowDrop(false); setShowAreas(true); }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onTouchEnd={(e) => handleDrop(e)}
        className={showDrop ? "drop-area" : "hide-drop"}
      >
        Drop here!
      </section>
    )
  );
}
