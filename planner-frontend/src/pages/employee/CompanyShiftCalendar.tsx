import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CompanyShiftCalendar.css";
import GlobalSidebar from "../../components/GlobalSidebar.tsx";
import { fetchShifts } from "../../Services/api.ts";
import { useTranslation } from "react-i18next";

const localizer = momentLocalizer(moment);

interface CompanyShiftCalendarProps {
  currentUser?: { userId: number; name: string };
}

const CompanyShiftCalendar: React.FC = () => {
  const { t, i18n } = useTranslation();
  moment.locale(i18n.language);

  const userIdString = localStorage.getItem("userId");
  const userId = userIdString ? parseInt(userIdString, 10) : null;

  const [shifts, setShifts] = useState([]);
  const [view, setView] = useState(Views.WEEK);
  const [calendarFilter, setCalendarFilter] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface Shift {
    id: number;
    title: string;
    shiftOwnerId: number | null;
    shiftOwner: string;
    role: string;
    start: Date;
    end: Date;
  };
  
  const mapShifts = (apiShifts: any[]): Shift[] => {
    return apiShifts.map((shift) => ({
      id: shift.id,
      title: shift.title || t("unnamedShift"),
      shiftOwnerId: shift.shiftOwnerId ?? null,
      shiftOwner: shift.shiftOwnerName || t("unassigned"),
      role: shift.shiftOwnerRole || t("unassigned"),
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
    }));
  };

  const loadShifts = async () => {
    try {
      const fetchedShifts = await fetchShifts();
      if (!Array.isArray(fetchedShifts)) {
        console.error("Invalid API response:", fetchedShifts);
        return;
      }

      const formattedShifts = mapShifts(fetchedShifts);

      setShifts(formattedShifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  useEffect(() => {
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
      console.log("Changing view to show user's shifts", userId);
      return  userId && shift.shiftOwnerId === userId;
    } else if (calendarFilter === "unoccupied") {
      return shift.shiftOwnerId === null;
    }
    return true;
  }); 

  const calendarEvents = filteredShifts.map((shift) => {
    const displayedOwner = shift.shiftOwner
      ? shift.shiftOwner || t("assigned") || "Assigned"
      : t("unassigned") || "Unassigned";

    return {
      ...shift,
      title: `${shift.title}`,
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