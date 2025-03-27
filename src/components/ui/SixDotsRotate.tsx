import { JSX } from "react";
import "./SixDotsRotate.css";

interface SixDotsRotateProps {
  size?: number; // サイズを percentage で指定
}

export default function SixDotsRotate({
  size = 100, // デフォルトサイズを 100% に設定
}: SixDotsRotateProps): JSX.Element {
  const centerX = 50; // 中心のX座標 (%)
  const centerY = 50; // 中心のY座標 (%)
  const radius = 20; // 回転半径 (%)
  const dotSize = 2; // ドットのサイズ (%)
  const numDots = 16;

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={`${size}%`} // width を percentage で指定
        height={`${size}%`} // height を percentage で指定
      >
        {Array.from({ length: numDots }, (_, i) => {
          const angle = (i * 360) / numDots - 90;
          const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
          const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={dotSize}
              className={`spinner-dot dot-${i + 1}`}
            />
          );
        })}
      </svg>
    </div>
  );
}
