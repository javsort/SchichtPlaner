import React, { useState } from "react";
import "./ShiftAvailability.css"; // Ensure the CSS file exists

const ShiftAvailability = () => {
  // Define time slots from 12 AM (00:00) to 12 PM (12:00)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i === 12 ? 12 : i; // 12 for noon, otherwise normal count
    const suffix = i < 12 ? "AM" : "PM";
    return `${hour}:00 ${suffix}`;
  });

  // Days of the week (columns)
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Store shift availability as an object { day: { time: boolean } }
  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => {
      acc[day] = timeSlots.reduce((acc, time) => {
        acc[time] = false;
        return acc;
      }, {});
      return acc;
    }, {})
  );

  // Handle checkbox toggle
  const handleCheckboxChange = (day, time) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: !prev[day][time],
      },
    }));
  };

  return (
    <div className="shift-availability-container">
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
            {timeSlots.map((time) => (
              <tr key={time}>
                <td>{time}</td>
                {days.map((day) => (
                  <td key={`${day}-${time}`}>
                    <input
                      type="checkbox"
                      checked={availability[day][time]}
                      onChange={() => handleCheckboxChange(day, time)}
                    />
                  </td>
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
