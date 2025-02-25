import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css"; // Custom CSS if needed
import SideBar from "../components/SideBar.tsx"; // Adjust import if needed

// Initialize the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const CompanyShiftCalendar = ({ currentUser = { id: 1, name: "John Doe" } }) => {
  // Example employees
  const [employees] = useState([
    { id: 1, name: "David Marrco" },
    { id: 2, name: "Justus Magdy" },
    { id: 3, name: "Hany Ali" },
  ]);

  // Example shifts: use explicit dates for easy testing
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [shifts] = useState([
    {
      title: "Morning Shift",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      assignedEmployees: [1, 2], // David, Justus
    },
    {
      title: "Afternoon Shift",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
      assignedEmployees: [1, 3], // David, Hany
    },
    {
      title: "Another Shift (Tomorrow)",
      start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 0),
      end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
      assignedEmployees: [2, 3], // Justus, Hany
    },
    {
      title: "Late Shift (Tomorrow)",
      start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 0),
      end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 17, 0),
      assignedEmployees: [1, 3], // David, Hany
    },
  ]);

  // Calendar view state (Week view by default)
  const [view, setView] = useState(Views.WEEK);

  // Filter state: "all", "my", or "unoccupied"
  const [calendarFilter, setCalendarFilter] = useState("all");

  // File import references (for demonstration)
  const fileInputRef = useRef(null);

  // Dummy import logic
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("Imported file contents:", e.target.result);
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

  // Filter shifts based on the selected calendarFilter
  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      // Only show shifts where current user is assigned
      return shift.assignedEmployees?.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      // Show shifts with no assigned employees
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    // "all" shows every shift
    return true;
  });

  // Combine shift title with assigned employees' names
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

  // Optional style function for color-coding
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"; // default
    // Add logic if needed for morning/afternoon/evening
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        color: "white",
        border: "none",
      },
    };
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER: Title + Import/Export Buttons */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 10px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h1 style={{ margin: 0 }}>Company Shift Calendar</h1>
        <div>
          <button
            onClick={handleImportClick}
            style={{
              marginRight: "5px",
              backgroundColor: "white",
              color: "black",
              border: "1px solid #ccc",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Import Data
          </button>
          <button
            onClick={handleExport}
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid #ccc",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Export Data
          </button>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </header>

      {/* MAIN LAYOUT: Left side bar, Right calendar */}
      <div style={{ flex: 1, display: "flex" }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: "300px",
            minWidth: "300px",
            backgroundColor: "#fafafa",
            borderRight: "1px solid #ccc",
            padding: "10px",
            boxSizing: "border-box",
          }}
        >
          <SideBar />
        </aside>

        {/* MAIN CONTENT: The 3 filter buttons ABOVE the calendar, plus the calendar */}
        <main style={{ flex: 1, padding: "10px", boxSizing: "border-box" }}>
          {/* SHIFT FILTER BUTTONS (above the calendar) */}
          <div style={{ marginBottom: "10px", textAlign: "center" }}>
            <span style={{ fontWeight: "bold", marginRight: "10px" }}>View:</span>
            <button
              onClick={() => setCalendarFilter("my")}
              style={{ marginRight: "5px" }}
            >
              My Shifts
            </button>
            <button
              onClick={() => setCalendarFilter("all")}
              style={{ marginRight: "5px" }}
            >
              All Shifts
            </button>
            <button onClick={() => setCalendarFilter("unoccupied")}>
              Unoccupied Shifts
            </button>
          </div>

          {/* THE CALENDAR */}
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 140px)" }}
            view={view}
            onView={(newView) => setView(newView)}
            eventPropGetter={eventStyleGetter}
            defaultDate={today} // Start on "today"
          />
        </main>
      </div>
    </div>
  );
};

export default CompanyShiftCalendar;
