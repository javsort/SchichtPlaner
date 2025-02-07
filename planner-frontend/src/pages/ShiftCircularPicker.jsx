import React, { useState, useRef, useEffect } from "react";
import "./ShiftAvailability.css";

const ShiftCircularPicker = () => {
  const [startAngle, setStartAngle] = useState(0);
  const [endAngle, setEndAngle] = useState(90);
  const [dragging, setDragging] = useState(null);
  const circleRef = useRef(null);

  const angleToTime = (angle) => {
    const hours = Math.floor((angle / 360) * 24);
    const minutes = Math.round(((angle / 360) * 24 - hours) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleDrag = (e, type) => {
    if (!circleRef.current) return;
    const rect = circleRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const angle = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
    
    if (type === "start") setStartAngle(angle);
    if (type === "end") setEndAngle(angle);
  };

  useEffect(() => {
    const handleMouseUp = () => setDragging(null);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div className="shift-circular-container">
      <h2>Shift Availability</h2>
      <div
        className="circle"
        ref={circleRef}
        onMouseMove={(e) => dragging && handleDrag(e, dragging)}
      >
        <div
          className="handle start"
          style={{ transform: `rotate(${startAngle}deg) translate(100px)` }}
          onMouseDown={() => setDragging("start")}
        ></div>
        <div
          className="handle end"
          style={{ transform: `rotate(${endAngle}deg) translate(100px)` }}
          onMouseDown={() => setDragging("end")}
        ></div>
      </div>
      <p>Selected Time: {angleToTime(startAngle)} - {angleToTime(endAngle)}</p>
    </div>
  );
};

export default ShiftCircularPicker;