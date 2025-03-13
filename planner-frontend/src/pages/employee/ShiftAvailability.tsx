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

interface MyProposal {
  date: string; // e.g. "2025-03-20"
  from: string; // "HH:mm"
  to: string;   // "HH:mm"
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
    getDaysInMonth(today.getFullYear(), today.getMonth()).forEach((date) => {
      const dateStr = date.toISOString().split("T")[0];
      init[dateStr] = { from: "", to: "" };
    });
    return init;
  });

  // Notification Toast
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Store user’s selected shift proposals for the sidebar
  const [myProposals, setMyProposals] = useState<MyProposal[]>([]);

  // Helper to show a notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Update days & availability when month/year changes
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
    const employee = localStorage.getItem("user");
    if (!employee) {
      showNotification(t("employeeNotFound") || "Error: Employee not found.", "error");
      return;
    }

    const employeeData = JSON.parse(employee);
    const employeeId = employeeData.userId;
    const role = employeeData.role;
    if (!employeeId) {
      showNotification(t("employeeIdNotFound") || "Error: Employee ID not found.", "error");
      return;
    }

    const proposedTitle = `Shift for Employee ${employeeId} (${role})`;
    const status = "PROPOSED";

    let hasAtLeastOneShift = false;
    const newProposals: MyProposal[] = [];

    for (const dateStr in availability) {
      const { from, to } = availability[dateStr];
      if (from && to) {
        hasAtLeastOneShift = true;

        // Original logic: add +1 day to each date
        const startDate = new Date(`${dateStr}T${from}:00`);
        startDate.setDate(startDate.getDate() + 1);
        const start = new Date(
          startDate.getTime() - startDate.getTimezoneOffset() * 60000
        ).toISOString();

        const endDate = new Date(`${dateStr}T${to}:00`);
        endDate.setDate(endDate.getDate() + 1);
        const end = new Date(
          endDate.getTime() - endDate.getTimezoneOffset() * 60000
        ).toISOString();

        try {
          await proposeShift(employeeId, proposedTitle, start, end, status);
          console.log(`Shift proposed for: ${start} - ${end}`);
          newProposals.push({ date: dateStr, from, to });
        } catch (error) {
          console.error("Error saving availability:", error);
          showNotification(
            t("errorSavingAvailability") || "Error saving availability.",
            "error"
          );
          return;
        }
      }
    }

    if (hasAtLeastOneShift) {
      showNotification(t("availabilitySaved") || "Availability saved!", "success");
      setMyProposals(newProposals);
    } else {
      showNotification(t("noShiftsSelected") || "No shifts selected.", "error");
    }
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  return (
    <div className="shift-availability-layout">
      {/* Left: Shift Availability Form */}
      <div className="shift-availability-container">
        {/* Notification Toast */}
        {notification && (
          <div className={`notification-toast ${notification.type} show`}>
            {notification.message}
          </div>
        )}

        <h2>{t("shiftAvailability") || "Shift Availability"}</h2>
        <div className="month-year-selector">
          <label>
            {t("monthLabel") || "Month:"}{" "}
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
            {t("yearLabel") || "Year:"}{" "}
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
                <th>{t("date") || "Date"}</th>
                <th>{t("from") || "From"}</th>
                <th>{t("to") || "To"}</th>
              </tr>
            </thead>
            <tbody>
              {days.map((date) => {
                const dateStr = date.toISOString().split("T")[0];
                // Format as MM/DD/YY or whichever you prefer
                const formatted = date.toLocaleDateString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                  year: "2-digit",
                });

                return (
                  <tr key={dateStr}>
                    <td>{formatted}</td>
                    <td>
                      <select
                        value={availability[dateStr]?.from || ""}
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
                        value={availability[dateStr]?.to || ""}
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

      {/* Right: My Shift Proposals Sidebar */}
      <div className="shift-proposals-sidebar">
        <h2>{t("myShiftProposals") || "My Shift Proposals"}</h2>
        {myProposals.length > 0 ? (
          <div className="proposals-table-container">
            <table className="shift-proposals-table">
              <thead>
                <tr>
                  <th>{t("date") || "Date"}</th>
                  <th>{t("from") || "From"}</th>
                  <th>{t("to") || "To"}</th>
                </tr>
              </thead>
              <tbody>
                {myProposals.map((proposal, idx) => {
                  const dateObj = new Date(proposal.date);
                  const dateFormatted = dateObj.toLocaleDateString(undefined, {
                    month: "2-digit",
                    day: "2-digit",
                    year: "2-digit",
                  });

                  return (
                    <tr key={idx}>
                      <td>{dateFormatted}</td>
                      <td>{proposal.from}</td>
                      <td>{proposal.to}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontStyle: "italic" }}>
            {t("noShiftProposalsYet") || "No shift proposals yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShiftAvailability;
