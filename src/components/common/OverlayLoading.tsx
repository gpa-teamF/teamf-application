import React, { useState, useEffect, useRef } from "react";
import SixDotsRotate from "../ui/SixDotsRotate";
import "./OverlayLoading.css";

interface OverlayLoadingProps {
  isLoading: boolean;
  color?: string;
}

const OverlayLoading: React.FC<OverlayLoadingProps> = ({
  isLoading,
  color,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined); // useRef を使用

  useEffect(() => {
    if (isLoading) {
      // ローディング開始時に表示 (300ms 後)
      timerRef.current = setTimeout(() => {
        setShowOverlay(true);
      }, 300);
    } else {
      // ローディング終了時に、最小表示時間後に非表示にする
      if (timerRef.current) {
        clearTimeout(timerRef.current); // 既存のタイマーをクリア
      }
      timerRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, 300); // 最小表示時間 (300ms)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current); // クリーンアップ
      }
    };
  }, [isLoading]);

  return (
    <>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <SixDotsRotate color={color} width={100} height={100} />
            {/* <p>Loading...</p> */}
          </div>
        </div>
      )}
    </>
  );
};

export default OverlayLoading;
