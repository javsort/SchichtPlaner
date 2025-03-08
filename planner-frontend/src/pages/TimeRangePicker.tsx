// src/components/TimeRangePicker.tsx
import React, { useState, useRef, useEffect } from 'react';
import './TimeRangePicker.css';

// Helper: converts minutes (0-1440) to HH:MM format.
const minutesToTimeString = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const TimeRangePicker: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Default values: 8:00 AM (480 minutes) to 5:00 PM (1020 minutes)
  const [startMinutes, setStartMinutes] = useState(480);
  const [endMinutes, setEndMinutes] = useState(1020);
  const [dragging, setDragging] = useState<'start' | 'end' | null>(null);

  // Mouse event handlers for dragging
  const handleMouseDown = (handle: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(handle);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const containerHeight = rect.height;
    // Map container height to 1440 minutes (24 hours)
    const minutes = (y / containerHeight) * 1440;
    if (dragging === 'start') {
      // Ensure start time doesn't exceed end time.
      if (minutes < 0) setStartMinutes(0);
      else if (minutes >= endMinutes) setStartMinutes(endMinutes - 1);
      else setStartMinutes(minutes);
    } else if (dragging === 'end') {
      // Ensure end time is not before start time.
      if (minutes > 1440) setEndMinutes(1440);
      else if (minutes <= startMinutes) setEndMinutes(startMinutes + 1);
      else setEndMinutes(minutes);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, startMinutes, endMinutes]);

  const handleSave = () => {
    // Simulate saving preferences (replace with your API call as needed)
    alert(`Preferred Time Range Saved:\n${minutesToTimeString(startMinutes)} - ${minutesToTimeString(endMinutes)}`);
    console.log("Saved time range:", { start: startMinutes, end: endMinutes });
  };

  return (
    <div className="time-range-picker">
      <h2>Select Preferred Time Range</h2>
      <div className="time-range-container" ref={containerRef}>
        {/* Highlight the selected time range */}
        <div
          className="time-range-selection"
          style={{
            top: `${(startMinutes / 1440) * 100}%`,
            height: `${((endMinutes - startMinutes) / 1440) * 100}%`
          }}
        ></div>
        {/* Start handle */}
        <div
          className="handle start-handle"
          style={{ top: `${(startMinutes / 1440) * 100}%` }}
          onMouseDown={handleMouseDown('start')}
        >
          <span className="handle-label">{minutesToTimeString(startMinutes)}</span>
        </div>
        {/* End handle */}
        <div
          className="handle end-handle"
          style={{ top: `${(endMinutes / 1440) * 100}%` }}
          onMouseDown={handleMouseDown('end')}
        >
          <span className="handle-label">{minutesToTimeString(endMinutes)}</span>
        </div>
      </div>
      <button className="save-btn" onClick={handleSave}>
        Save Preferences
      </button>
    </div>
  );
};

export default TimeRangePicker;