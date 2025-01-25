import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const CustomModal = ({ children, isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackdropClick = (e) => {
    // Prevent closing when clicking inside the modal content
    e.stopPropagation();
  };

  return (
    mounted &&
    createPortal(
      <>
        {isOpen && (
          <div
            onClick={onClose}
            className="fixed top-0 left-0 w-full h-full bg-black/60 z-50"
          >
            <div
              onClick={handleBackdropClick} // Prevent closing when clicking inside
              className="bg-white p-4 rounded-lg absolute top-[20rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              {children}
            </div>
          </div>
        )}
      </>,
      document.getElementById("modal")
    )
  );
};

export default CustomModal;
