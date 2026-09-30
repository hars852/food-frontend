import React from "react";
import "./ImageModal.css";

const ImageModal = ({ src, title, onClose }) => {
  if (!src) return null;
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}>&times;</button>
        <img src={src} alt={title || "Gallery"} />
        {title && <p>{title}</p>}
      </div>
    </div>
  );
};

export default ImageModal;
