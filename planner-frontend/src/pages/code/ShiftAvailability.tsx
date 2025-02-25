import React, { useState } from "react";
import "../styling/ShiftAvailability.css";
import SideBar from "../../components/SideBar.tsx";
import { proposeShift } from '../../Services/api.ts';


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
  const [selectedSlots, setSelectedSlots] = useState<any[]>([]);

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

  const formatTime = (day: string, time: string) => {
    const dayIndex = days.indexOf(day);
    const now = new Date();
    now.setDate(now.getDate() - now.getDay() + dayIndex + 1);
    now.setHours(parseInt(time.split(":")[0]), 0, 0, 0);
    return now.toISOString();
  };

  // Prepare and submit shift data
  const prepareNSubmitShiftData = () => {
    const employeeId = 3;
    const shifts: any[] = [];
    
    Object.entries(availability).forEach(([day, slots]) => {
      let startTime: string | null = null;
      let endTime: string | null = null;
      
      Object.entries(slots).forEach(([time, selected]) => {
        // If the first slot is selected, set the start time
        if (selected && startTime === null) {
          startTime = time;
        }

        // If the last slot is selected, set the end time
        if (selected) {
          endTime = time;
        }

        // If the last slot is not selected, add the shift
        if (!selected && startTime !== null && endTime !== null) {
          shifts.push({
            employeeId,
            proposedTitle: "Test Shift II",
            proposedStartTime: formatTime(day, startTime),
            proposedEndTime: formatTime(day, endTime),
            status: "PROPOSED",
          });
          startTime = null;
          endTime = null;
        }
      });

      // If the last slot is selected, add the shift
      if (startTime !== null && endTime !== null) {
        shifts.push({
          employeeId,
          proposedTitle: "Test Shift II",
          proposedStartTime: formatTime(day, startTime),
          proposedEndTime: formatTime(day, endTime),
          status: "PROPOSED",
        });
      }
    });
    setSelectedSlots(shifts);

    shifts.forEach((shift) => {
      proposeShift(shift.employeeId, shift.proposedTitle, shift.proposedStartTime, shift.proposedEndTime, shift.status);
    });
  };

  return (
    <div className="shift-availability-container" onMouseUp={handleMouseUp}>
      <SideBar />
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
        <button className="submit-button" onClick={prepareNSubmitShiftData}>Submit Availability</button>
        <div className="selected-slots-display">
          <h3>Formatted Shift Data:</h3>
          <pre>{JSON.stringify(selectedSlots, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default ShiftAvailability;
