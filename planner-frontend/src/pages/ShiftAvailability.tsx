import React, { useState } from "react";
import "./ShiftAvailability.css";

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour}:00`); // 24-hour format
  }
  return slots;
};

const ShiftAvailability = () => {
  const timeSlots = generateTimeSlots();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => {
      acc[day] = {};
      timeSlots.forEach((slot) => (acc[day][slot] = false));
      return acc;
    }, {})
  );

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const handleMouseDown = (day, slot) => {
    setIsSelecting(true);
    setSelectedDay(day);
    toggleSlot(day, slot);
  };

  const handleMouseEnter = (day, slot) => {
    if (isSelecting && day === selectedDay) {
      toggleSlot(day, slot);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectedDay(null);
  };

  const toggleSlot = (day, slot) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: !prev[day][slot],
      },
    }));
  };

  return (
    <div className="shift-availability-container" onMouseUp={handleMouseUp}>
      <h2>Shift Availability</h2>
      <div className="table-container">
        <table className="shift-table">
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot}>
                <td>{slot}</td>
                {days.map((day) => (
                  <td
                    key={`${day}-${slot}`}
                    className={availability[day][slot] ? "selected" : ""}
                    onMouseDown={() => handleMouseDown(day, slot)}
                    onMouseEnter={() => handleMouseEnter(day, slot)}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftAvailability;
