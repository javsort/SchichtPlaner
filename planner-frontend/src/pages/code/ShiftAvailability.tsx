import React, { useState } from "react";
import "../styling/ShiftAvailability.css";
import SideBar from "../../components/SideBar.tsx";

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour}:00`);
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
    }, {} as Record<string, Record<string, boolean>>)
  );

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<{ day: string; startTime: string; endTime: string }[]>([]);

  const handleMouseDown = (day: string, slot: string) => {
    setIsSelecting(true);
    setSelectedDay(day);
    toggleSlot(day, slot);
  };

  const handleMouseEnter = (day: string, slot: string) => {
    if (isSelecting && day === selectedDay) {
      toggleSlot(day, slot);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectedDay(null);
  };

  const toggleSlot = (day: string, slot: string) => {
    setAvailability((prev) => {
      const updated = { ...prev };
      updated[day] = { ...prev[day], [slot]: !prev[day][slot] };
      return updated;
    });
  };

  const prepareShiftData = () => {
    const shifts: { day: string; startTime: string; endTime: string }[] = [];
    
    Object.entries(availability).forEach(([day, slots]) => {
      let startTime: string | null = null;
      let endTime: string | null = null;
      
      Object.entries(slots).forEach(([time, selected]) => {
        if (selected && startTime === null) {
          startTime = time;
        }
        if (selected) {
          endTime = time;
        }
        if (!selected && startTime !== null && endTime !== null) {
          shifts.push({ day, startTime, endTime });
          startTime = null;
          endTime = null;
        }
      });
      if (startTime !== null && endTime !== null) {
        shifts.push({ day, startTime, endTime });
      }
    });
    setSelectedSlots(shifts);
  };

  return (
    <div className="shift-availability-container" onMouseUp={handleMouseUp}>
      
      <div className="sidebar-container">
        <SideBar />
      </div>
      <div className="calendar-container">
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
        <button className="submit-button" onClick={prepareShiftData}>Submit Availability</button>
        <pre>{JSON.stringify(selectedSlots, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ShiftAvailability;
