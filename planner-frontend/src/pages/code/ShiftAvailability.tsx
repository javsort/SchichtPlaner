import React, { useState, useEffect } from "react";
import "../styling/ShiftAvailability.css";
import SideBar from "../../components/SideBar.tsx";
import { proposeShift } from '../../Services/api.ts';

/** Returns an array of Date objects for each day in the given month/year. */
function getDaysInMonth(year: number, month: number): Date[] {
  const dates: Date[] = [];
  let current = new Date(year, month, 1);
  while (current.getMonth() === month) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/** Generates time options in 30-minute increments (e.g., "00:00" to "23:30"). */
function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let half = 0; half < 2; half++) {
      const hh = hour.toString().padStart(2, "0");
      const mm = half === 0 ? "00" : "30";
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface Availability {
  from: string;
  to: string;
}

const ShiftAvailability: React.FC = () => {
  // Default to current month and year.
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [days, setDays] = useState<Date[]>(getDaysInMonth(selectedYear, selectedMonth));
  const timeOptions = generateTimeOptions();

  // Store availability for each day in the month by date string "YYYY-MM-DD".
  const [availability, setAvailability] = useState<{ [dateStr: string]: Availability }>(() => {
    const init: { [dateStr: string]: Availability } = {};
    days.forEach((date) => {
      const dateStr = date.toISOString().split("T")[0];
      init[dateStr] = { from: "", to: "" };
    });
    return init;
  });

  // Update days and reset availability when month/year changes.
  useEffect(() => {
    const newDays = getDaysInMonth(selectedYear, selectedMonth);
    setDays(newDays);
    const init: { [dateStr: string]: Availability } = {};
    newDays.forEach((date) => {
      const dateStr = date.toISOString().split("T")[0];
      init[dateStr] = { from: "", to: "" };
    });
    setAvailability(init);
  }, [selectedMonth, selectedYear]);

  const handleChange = (dateStr: string, field: keyof Availability, value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], [field]: value },
    }));
  };

  // Combine the date (YYYY-MM-DD) and time (HH:mm) into an ISO string.
  const formatDateTime = (dateStr: string, time: string) => {
    return new Date(`${dateStr}T${time}:00`).toISOString();
  };

  const handleSave = async () => {
    const employeeId = 3; // Replace with the actual employee ID as needed.
    const proposedTitle = "Test Shift II";
    const status = "PROPOSED";

    // Loop through each day and if both times are selected, call the backend.
    for (const dateStr in availability) {
      const { from, to } = availability[dateStr];
      if (from && to) {
        const proposedStartTime = formatDateTime(dateStr, from);
        const proposedEndTime = formatDateTime(dateStr, to);

        try {
          await proposeShift(employeeId, proposedTitle, proposedStartTime, proposedEndTime, status);
          console.log(`Shift proposed for ${dateStr}`);
        } catch (error) {
          console.error(`Error proposing shift for ${dateStr}:`, error);
        }
      }
    }
    alert("Availability saved! Check console for details.");
  };

  // Create a list of years (e.g., current year ±5 years).
  const yearOptions = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  return (
    <div className="shift-availability-layout">
      <SideBar />

      <div className="shift-availability-container">
        <h2>Shift Availability</h2>
        <div className="month-year-selector">
          <label>
            Month:{" "}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.map((name, index) => (
                <option key={index} value={index}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Year:{" "}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <div className="table-container">
          <table className="shift-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {days.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                return (
                  <tr key={dateStr}>
                    <td>{date.getDate()}</td>
                    <td>
                      <select
                        value={availability[dateStr].from}
                        onChange={(e) =>
                          handleChange(dateStr, "from", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {timeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={availability[dateStr].to}
                        onChange={(e) =>
                          handleChange(dateStr, "to", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {timeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftAvailability;
