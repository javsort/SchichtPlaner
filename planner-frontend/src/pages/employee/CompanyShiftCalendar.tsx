import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css";
import { fetchShifts, getAllUsers } from "../../Services/api.ts";
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

  // State for shifts and employees
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [view, setView] = useState(Views.WEEK);
  const [calendarFilter, setCalendarFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      title: `${shift.title} (${
        assignedNames.length ? assignedNames.join(", ") : t("unassigned") || "Unassigned"
      })`,
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
