import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css";
import GlobalSidebar from "../../components/GlobalSidebar.tsx";
import { fetchShifts } from "../../Services/api.ts";
import { useTranslation } from "react-i18next";

const localizer = momentLocalizer(moment);

interface Shift {
  id: number;
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
  const { t, i18n } = useTranslation();
  moment.locale(i18n.language);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [view, setView] = useState(Views.WEEK);
  const [calendarFilter, setCalendarFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadShifts = async () => {
      const fetchedShifts = await fetchShifts();
      const formattedShifts = fetchedShifts.map((shift: any) => ({
        id: shift.id,
        title: shift.title,
        start: new Date(shift.startTime),
        end: new Date(shift.endTime),
        assignedEmployees: shift.assignedEmployees || [],
      }));
      setShifts(formattedShifts);
    };
    loadShifts();
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // File import logic here
  };

  const handleExport = () => {
    // Export logic here
  };

  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees?.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    return true;
  });

  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: "#3174ad",
      borderRadius: "5px",
      color: "white",
      border: "none",
    },
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="calendar-header">
        <div></div>
        <div className="import-export-buttons">
          <button onClick={handleImportClick}>{t("importData") || "Import Data"}</button>
          <button onClick={handleExport}>{t("exportData") || "Export Data"}</button>
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
      <div style={{ flex: 1, display: "flex", height: "100vh", flexDirection: "column" }}>
        <GlobalSidebar 
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
        />
        <main style={{ flex: 1, padding: "10px", boxSizing: "border-box" }}>
          <div className="calendar-filters">
            <span className="filter-label">{t("viewLabel") || "View:"}</span>
            <button onClick={() => setCalendarFilter("my")}>{t("myShifts") || "My Shifts"}</button>
            <button onClick={() => setCalendarFilter("all")}>{t("allShifts") || "All Shifts"}</button>
            <button onClick={() => setCalendarFilter("unoccupied")}>{t("unoccupiedShifts") || "Unoccupied Shifts"}</button>
          </div>
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={filteredShifts}
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
