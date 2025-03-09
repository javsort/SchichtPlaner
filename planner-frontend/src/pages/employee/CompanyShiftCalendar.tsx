// src/pages/employee/CompanyShiftCalendar.tsx
import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();
  moment.locale(i18n.language);

  const [employees] = useState<Employee[]>([
    { id: 1, name: "David Marco" },
    { id: 2, name: "Justus Magdy" },
    { id: 3, name: "Hany Ali" },
  ]);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [shifts] = useState<Shift[]>([
    {
      title: t("morningShift") || "Morning Shift",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      assignedEmployees: [1, 2],
    },
    {
      title: t("afternoonShift") || "Afternoon Shift",
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
      assignedEmployees: [1, 3],
    },
    {
      title: t("anotherShiftTomorrow") || "Another Shift (Tomorrow)",
      start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 0),
      end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
      assignedEmployees: [2, 3],
    },
    {
      title: t("lateShiftTomorrow") || "Late Shift (Tomorrow)",
      start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 0),
      end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 17, 0),
      assignedEmployees: [1, 3],
    },
  ]);

  const [view, setView] = useState(Views.WEEK);
  const [calendarFilter, setCalendarFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const calendarEvents = filteredShifts.map((shift) => {
    const assignedNames = (shift.assignedEmployees || []).map((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp ? emp.name : `Unknown #${id}`;
    });
    return {
      ...shift,
      title: `${shift.title} (${assignedNames.length ? assignedNames.join(", ") : t("unassigned") || "Unassigned"})`,
    };
  });

  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: "#3174ad",
      borderRadius: "5px",
      color: "white",
      border: "none",
    },
  });

  const messages = {
    today: t("calendarToday"),
    previous: t("calendarBack"),
    next: t("calendarNext"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda"),
  };

  return (
    <div className="company-shift-calendar-container">
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
      <div className="calendar-main-layout">
        <main className="calendar-main-content">
          <div className="calendar-filters">
            <span className="filter-label">{t("viewLabel") || "View:"}</span>
            <button onClick={() => setCalendarFilter("my")}>{t("myShifts") || "My Shifts"}</button>
            <button onClick={() => setCalendarFilter("all")}>{t("allShifts") || "All Shifts"}</button>
            <button onClick={() => setCalendarFilter("unoccupied")}>
              {t("unoccupiedShifts") || "Unoccupied Shifts"}
            </button>
          </div>
          <div className="calendar-container">
            <Calendar
              key={i18n.language}
              localizer={localizer}
              culture={i18n.language}
              messages={messages}
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
