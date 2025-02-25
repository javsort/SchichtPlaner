// src/components/ShiftAvailability.tsx
import React, { useState, useEffect } from "react";
import "./ShiftAvailability.css";

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

  // When selectedMonth or selectedYear changes, update days and reset availability.
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

  const handleSave = () => {
    alert("Availability saved! Check console for details.");
    console.log("Saved availability:", availability);
  };

  // Create a simple list of years for selection (e.g., current year ± 5 years).
  const yearOptions = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  return (
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
  );
};

export default ShiftAvailability;
