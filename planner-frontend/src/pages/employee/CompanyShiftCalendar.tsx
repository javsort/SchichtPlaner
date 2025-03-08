import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css"; // Custom CSS if needed
import SideBar from "../../components/SideBar.tsx";
import { fetchShifts } from "../../Services/api.ts"; // Import the fetchShifts function

const localizer = momentLocalizer(moment);

const CompanyShiftCalendar = () => {
  const [shifts, setShifts] = useState([]);
  const [view, setView] = useState(Views.WEEK);
  const [calendarFilter, setCalendarFilter] = useState("all");

  useEffect(() => {
    const loadShifts = async () => {
      const fetchedShifts = await fetchShifts();
      // Transform data into the format expected by react-big-calendar
      const formattedShifts = fetchedShifts.map((shift) => ({
        id: shift.id,
        title: shift.title,
        start: new Date(shift.startTime),
        end: new Date(shift.endTime),
      }));
      setShifts(formattedShifts);
    };

    loadShifts();
  }, []);

  // Styling function for calendar events
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "#3174ad",
        borderRadius: "5px",
        color: "white",
        border: "none",
      },
    };
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
      </header>

      <div style={{ flex: 1, display: "flex" }}>
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

        <main style={{ flex: 1, padding: "10px", boxSizing: "border-box" }}>
          <div style={{ marginBottom: "10px", textAlign: "center" }}>
            <span style={{ fontWeight: "bold", marginRight: "10px" }}>View:</span>
            <button onClick={() => setCalendarFilter("my")} style={{ marginRight: "5px" }}>
              My Shifts
            </button>
            <button onClick={() => setCalendarFilter("all")} style={{ marginRight: "5px" }}>
              All Shifts
            </button>
            <button onClick={() => setCalendarFilter("unoccupied")}>Unoccupied Shifts</button>
          </div>

          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={shifts}
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
