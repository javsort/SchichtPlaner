import React, { useState, useEffect } from "react";
import "./ShiftAvailability.css";
import { proposeShift } from "../../Services/api.ts";
import { useTranslation } from "react-i18next";

function getDaysInMonth(year: number, month: number): Date[] {
  const dates: Date[] = [];
  let current = new Date(year, month, 1);
  while (current.getMonth() === month) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

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
  const { t } = useTranslation();
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth());
  const [days, setDays] = useState<Date[]>(getDaysInMonth(selectedYear, selectedMonth));
  const timeOptions = generateTimeOptions();

  const [availability, setAvailability] = useState<{ [dateStr: string]: Availability }>(() => {
    const init: { [dateStr: string]: Availability } = {};
    days.forEach((date) => {
      const dateStr = date.toISOString().split("T")[0];
      init[dateStr] = { from: "", to: "" };
    });
    return init;
  });

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

  const handleSave = async () => {
    // Example employee
    const employee = localStorage.getItem("user");
    if (!employee) {
      alert(t("employeeNotFound") || "Error saving availability: Employee not found.");
      return;
    }

    const employeeData = JSON.parse(employee);
    const employeeId = employeeData.userId;
    const role = employeeData.role;
    if (!employeeId) {
      alert(t("employeeIdNotFound") || "Error saving availability: Employee ID not found.");
      return;
    }

    const proposedTitle = `Shift for Employee ${employeeId} (${role})`;
    const status = "PROPOSED";

    for (const dateStr in availability) {
      const { from, to } = availability[dateStr];
      if (from && to) {

        // Add an extra day. Idk why this happens but yea
        const startDate = new Date(`${dateStr}T${from}:00`);
        startDate.setDate(startDate.getDate() + 1);
        const start = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString();

        const endDate = new Date(`${dateStr}T${to}:00`);
        endDate.setDate(endDate.getDate() + 1);
        const end = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString();

        console.log(`Before offset: Start: ${startDate}, End: ${endDate}`);
        console.log(`After offset: Start: ${start}, End: ${end}`);

        try {
          await proposeShift(employeeId, proposedTitle, start, end, status);
          console.log(`Shift proposed for: ${start} - ${end}`);
          alert(t("availabilitySaved") || "Availability saved!");

        } catch (error) {
          console.log(`Shift proposed for: ${start} - ${end}`);
          alert(t("errorSavingAvailability") || "Error saving availability:");
          console.error("Error: ", error);
        }
      }
    }
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  return (
    <div className="shift-availability-layout">
      <div className="shift-availability-container">
        <h2>{t("shiftAvailability") || "Shift Availability"}</h2>
        <div className="month-year-selector">
          <label>
            {t("monthLabel") || "Month:"}{" "}
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((name, index) => (
                <option key={index} value={index}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("yearLabel") || "Year:"}{" "}
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
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
                <th>{t("day") || "Day"}</th>
                <th>{t("from") || "From"}</th>
                <th>{t("to") || "To"}</th>
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
                        onChange={(e) => handleChange(dateStr, "from", e.target.value)}
                      >
                        <option value="">{t("selectOption") || "Select"}</option>
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
                        onChange={(e) => handleChange(dateStr, "to", e.target.value)}
                      >
                        <option value="">{t("selectOption") || "Select"}</option>
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
          {t("save") || "Save"}
        </button>
      </div>
    </div>
  );
};

export default ShiftAvailability;
