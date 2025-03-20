import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css";
import { fetchShifts, getAllUsers } from "../../Services/api.ts";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// A simple info icon (SVG)
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#4da8d6" strokeWidth="1" />
    <path fill="#000000" d="M7.5 12h1V7h-1v5zm0-6h1V5h-1v1z" />
  </svg>
);

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
  // Keep this to localize things like day names, but RBC’s time display will be overridden below
  moment.locale(i18n.language);

  // State for shifts and employees
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [view, setView] = useState(Views.WEEK);
  const [calendarFilter, setCalendarFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch shifts
  useEffect(() => {
    const loadShifts = async () => {
      try {
        const fetchedShifts = await fetchShifts();
        const formattedShifts = fetchedShifts.map((shift: any) => ({
          id: shift.id,
          title: shift.title,
          start: new Date(shift.startTime),
          end: new Date(shift.endTime),
          assignedEmployees: shift.assignedEmployees || [],
        }));
        setShifts(formattedShifts);
      } catch (error) {
        console.error("Error loading shifts:", error);
      }
    };
    loadShifts();
  }, []);

  // Fetch employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        const employeeList = fetchedUsers.map((user: any) => ({
          id: user.id,
          name: user.username,
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    loadEmployees();
  }, []);

  // Import / Export
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // File import logic here
  };

  const handleExport = () => {
    // Export logic here
  };

  // Filter the shifts according to the selected button
  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees?.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    return true; // "all" means no filter
  });

  // Convert those shifts into RBC events
  const calendarEvents = filteredShifts.map((shift) => {
    const assignedNames = (shift.assignedEmployees || []).map((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp ? emp.name : `Unknown #${id}`;
    });
    const displayNames = assignedNames.length
      ? assignedNames.join(", ")
      : t("unassigned") || "Unassigned";

    return {
      ...shift,
      title: `${shift.title} (${displayNames})`,
    };
  });

  // Custom formats to ensure 24-hour times (HH:mm) regardless of locale
  const calendarFormats = {
    timeGutterFormat: "HH:mm",
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} — ${localizer.format(end, "HH:mm", culture)}`,
    agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "HH:mm", culture)} – ${localizer.format(end, "HH:mm", culture)}`,
  };

  // RBC's default toolbar labels (localized)
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
      {/* Header with Import/Export */}
      <header className="calendar-header">
        {/* Left side placeholder (could contain a page title) */}
        <div></div>

        {/* Right side: Import & Export with tooltips */}
        <div className="import-export-buttons">
          {/* Import group */}
          <div style={{ display: "inline-flex", alignItems: "center" }}>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="import-tooltip">
                  {t("importTooltip", "Click to import data")}
                </Tooltip>
              }
            >
              <button onClick={handleImportClick}>
                {t("importData") || "Import Data"}
              </button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="import-info-tooltip">
                  {t("importInfo", "Additional import info")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon" style={{ marginLeft: "8px" }}>
                <InfoIcon />
              </span>
            </OverlayTrigger>
          </div>

          {/* Export group */}
          <div style={{ display: "inline-flex", alignItems: "center", marginLeft: "15px" }}>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="export-tooltip">
                  {t("exportTooltip", "Click to export data")}
                </Tooltip>
              }
            >
              <button onClick={handleExport}>
                {t("exportData") || "Export Data"}
              </button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="export-info-tooltip">
                  {t("exportInfo", "Additional export info")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon" style={{ marginLeft: "8px" }}>
                <InfoIcon />
              </span>
            </OverlayTrigger>
          </div>

          {/* Hidden file input for import */}
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
          {/* Filter Buttons */}
          <div className="calendar-filters">
            <span className="filter-label" style={{ fontWeight: "normal" }}>
              {t("viewLabel") || "View:"}
            </span>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="view-tooltip">
                  {t("calendarViewTooltip", "Select a calendar view")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon" style={{ marginLeft: "8px" }}>
                <InfoIcon />
              </span>
            </OverlayTrigger>

            <button
              onClick={() => setCalendarFilter("my")}
              className={calendarFilter === "my" ? "active" : ""}
            >
              {t("myShifts") || "My Shifts"}
            </button>
            <button
              onClick={() => setCalendarFilter("all")}
              className={calendarFilter === "all" ? "active" : ""}
            >
              {t("allShifts") || "All Shifts"}
            </button>
            <button
              onClick={() => setCalendarFilter("unoccupied")}
              className={calendarFilter === "unoccupied" ? "active" : ""}
            >
              {t("unoccupiedShifts") || "Unoccupied Shifts"}
            </button>
          </div>

          {/* Calendar */}
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
              // Forces consistent 24-hour display
              formats={calendarFormats}
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
