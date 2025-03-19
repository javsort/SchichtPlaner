// src/pages/employee/EmployeeICS.tsx
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { createEvents } from "ics";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchShifts } from "../../Services/api.ts";
import { useAuth } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import "./EmployeeICS.css";

const localizer = momentLocalizer(moment);

interface Shift {
  id: number;
  title: string;
  start: Date;
  end: Date;
  assignedEmployee: number;
}

type CalendarView = "month" | "week" | "day" | "agenda";

const EmployeeICS: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [view, setView] = useState<CalendarView>("week");

  useEffect(() => {
    const loadShifts = async () => {
      const fetchedShifts = await fetchShifts();
      // Filter shifts to only those assigned to the current user.
      const employeeShifts = fetchedShifts
        .filter((shift: any) => shift.assignedEmployee === user?.id)
        .map((shift: any) => ({
          id: shift.id,
          title: shift.title,
          start: new Date(shift.startTime),
          end: new Date(shift.endTime),
          assignedEmployee: shift.assignedEmployee,
        }));
      setShifts(employeeShifts);
    };
    loadShifts();
  }, [user]);

  const handleExportICS = () => {
    // Map employee shifts to the format expected by the ics package.
    const icsEvents = shifts.map((shift) => ({
      title: shift.title,
      start: [
        shift.start.getFullYear(),
        shift.start.getMonth() + 1, // JS months are 0-indexed.
        shift.start.getDate(),
        shift.start.getHours(),
        shift.start.getMinutes(),
      ] as [number, number, number, number, number],
      end: [
        shift.end.getFullYear(),
        shift.end.getMonth() + 1,
        shift.end.getDate(),
        shift.end.getHours(),
        shift.end.getMinutes(),
      ] as [number, number, number, number, number],
    }));

    createEvents(icsEvents, (error, value) => {
      if (error) {
        console.error("Error generating ICS file:", error);
        return;
      }
      const blob = new Blob([value!], { type: "text/calendar;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "employee_shifts.ics";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="employee-shifts-calendar-container container mt-4">
      <h2>{t("myShifts") || "My Shifts"}</h2>
      <button onClick={handleExportICS} className="btn btn-primary">
        {t("exportICS") || "Export as ICS"}
      </button>
      <Calendar
        localizer={localizer}
        events={shifts}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={(newView) => setView(newView as CalendarView)}
        style={{ height: 500, marginTop: "20px" }}
      />
    </div>
  );
};

export default EmployeeICS;
