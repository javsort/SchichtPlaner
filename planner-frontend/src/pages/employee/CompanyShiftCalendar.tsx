// src/pages/CompanyShiftCalendar.tsx
import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css"; // Custom CSS

const localizer = momentLocalizer(moment);

interface Shift {
  title: string;
  start: Date;
  end: Date;
  assignedEmployees?: number[];
}

interface Employee {
  id: number;
  name: string;
}

interface CompanyShiftCalendarProps {
  currentUser?: { id: number; name: string };
}

const CompanyShiftCalendar: React.FC<CompanyShiftCalendarProps> = ({
  currentUser = { id: 1, name: "John Doe" },
}) => {
  // Example employees
  const [employees] = useState<Employee[]>([
    { id: 1, name: "David Marco" },
    { id: 2, name: "Justus Magdy" },
    { id: 3, name: "Hany Ali" },
  ]);

  // Example shifts
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [shifts] = useState<Shift[]>([
    {
      title: "Morning Shift",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      assignedEmployees: [1, 2],
    },
    {
      title: "Afternoon Shift",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
      assignedEmployees: [1, 3],
    },
    {
      title: "Another Shift (Tomorrow)",
      start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 0),
      end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
      assignedEmployees: [2, 3],
    },
    {
      title: "Late Shift (Tomorrow)",
      start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 0),
      end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 17, 0),
      assignedEmployees: [1, 3],
    },
  ]);

  // Calendar view state
  const [view, setView] = useState(Views.WEEK);

  // Filter state: "all", "my", or "unoccupied"
  const [calendarFilter, setCalendarFilter] = useState("all");

  // File import reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dummy import logic
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("Imported file contents:", e.target?.result);
      // parse and update data as needed
    };
    reader.readAsText(file);
  };

  // Dummy export logic
  const handleExport = () => {
    const header = "Title,Start,End,Assigned Employees\n";
    const rows = shifts
      .map((shift) => {
        const start = shift.start.toISOString();
        const end = shift.end.toISOString();
        const assigned = (shift.assignedEmployees || []).join(";");
        return `"${shift.title}","${start}","${end}","${assigned}"`;
      })
      .join("\n");

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "shift_schedules.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter shifts
  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees?.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    return true;
  });

  // Append assigned employee names to shift title
  const calendarEvents = filteredShifts.map((shift) => {
    const assignedNames = (shift.assignedEmployees || []).map((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp ? emp.name : `Unknown #${id}`;
    });
    return {
      ...shift,
      title: `${shift.title} (${assignedNames.length ? assignedNames.join(", ") : "Unassigned"})`,
    };
  });

  // Optional style for events
  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: "#3174ad",
      borderRadius: "5px",
      color: "white",
      border: "none",
    },
  });

  return (
    <div className="company-shift-calendar-container">
      {/* HEADER: Only Import/Export buttons */}
      <header className="calendar-header">
        <div></div>
        <div className="import-export-buttons">
          <button onClick={handleImportClick}>Import Data</button>
          <button onClick={handleExport}>Export Data</button>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            data-testid="file-input"
          />
        </div>
      </header>

      {/* MAIN CONTENT: Only the calendar content (global sidebar comes from the layout) */}
      <div className="calendar-main-layout">
        <main className="calendar-main-content">
          <div className="calendar-filters">
            <span className="filter-label">View:</span>
            <button onClick={() => setCalendarFilter("my")}>My Shifts</button>
            <button onClick={() => setCalendarFilter("all")}>All Shifts</button>
            <button onClick={() => setCalendarFilter("unoccupied")}>Unoccupied Shifts</button>
          </div>

          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={(newView) => setView(newView)}
              eventPropGetter={eventStyleGetter}
              min={new Date(1970, 1, 1, 0, 0)}
              max={new Date(1970, 1, 1, 23, 59)}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyShiftCalendar;
