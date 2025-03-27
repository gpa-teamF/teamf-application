import React, { useState, useEffect, useRef } from "react";
import SixDotsRotate from "../ui/SixDotsRotate";
import "./OverlayLoading.css";

interface OverlayLoadingProps {
  isLoading: boolean;
  size?: number;
}

const OverlayLoading: React.FC<OverlayLoadingProps> = ({
  isLoading,
  size = 100,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (isLoading) {
      timerRef.current = setTimeout(() => {
        setShowOverlay(true);
      }, 300);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, 300);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoading]);

  return (
    <>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <SixDotsRotate size={size} />
            {/* <p>Loading...</p> */}
          </div>
        </div>
      )}
    </>
  );
};

export default OverlayLoading;
