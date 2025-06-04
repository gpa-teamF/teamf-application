import React, { ReactNode, useEffect } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk?: () => void;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  title?: string;
  children?: ReactNode;
  width?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onOk,
  showOkButton = true,
  showCancelButton = true,
  title = "",
  children,
  width,
}) => {
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent && !modalContent.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: width || "30%" }}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          {showCancelButton && (
            <button className="btn cancel" onClick={onClose}>
              キャンセル
            </button>
          )}
          {showOkButton && onOk && (
            <button className="btn ok" onClick={onOk}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
