// src/pages/admin/ShiftManagement.tsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import "./ShiftManagement.css";
import {
  fetchShifts,
  getAllUsers,
  supervisorCreateShift,
  supervisorDeleteShift,
  supervisorUpdateShift,
} from "../../Services/api.ts";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Simple info icon for tooltips
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#4da8d6" strokeWidth="1" />
    <path fill="#000000" d="M7.5 12h1V7h-1v5zm0-6h1V5h-1v1z" />
  </svg>
);

/**
 * Custom toolbar replicating the layout in your screenshot:
 * - Left group: [ Today | Back | Next ]
 * - Center label: "March 17 – 23" (or localized date range)
 * - Right group: [ Month | Week | Day | Agenda ]
 * - Translated button labels, but forced date/time layout in English
 */
const CustomToolbar = (toolbarProps) => {
  const { onNavigate, onView, view, label, localizer } = toolbarProps;
  const { messages } = localizer;

  const goToBack = () => onNavigate("PREV");
  const goToNext = () => onNavigate("NEXT");
  const goToToday = () => onNavigate("TODAY");

  const handleViewChange = (newView) => {
    onView(newView);
  };

  return (
    <div className="rbc-toolbar-custom">
      {/* LEFT BUTTON GROUP: Today, Back, Next */}
      <div className="rbc-btn-group left-group">
        <button type="button" onClick={goToToday}>
          {messages.today}
        </button>
        <button type="button" onClick={goToBack}>
          {messages.previous}
        </button>
        <button type="button" onClick={goToNext}>
          {messages.next}
        </button>
      </div>

      {/* CENTER: current date range label (e.g. "March 17 – 23") */}
      <span className="rbc-toolbar-label">{label}</span>

      {/* RIGHT BUTTON GROUP: Month, Week, Day, Agenda */}
      <div className="rbc-btn-group right-group">
        <button
          type="button"
          onClick={() => handleViewChange(Views.MONTH)}
          className={view === Views.MONTH ? "rbc-active" : ""}
        >
          {messages.month}
        </button>
        <button
          type="button"
          onClick={() => handleViewChange(Views.WEEK)}
          className={view === Views.WEEK ? "rbc-active" : ""}
        >
          {messages.week}
        </button>
        <button
          type="button"
          onClick={() => handleViewChange(Views.DAY)}
          className={view === Views.DAY ? "rbc-active" : ""}
        >
          {messages.day}
        </button>
        <button
          type="button"
          onClick={() => handleViewChange(Views.AGENDA)}
          className={view === Views.AGENDA ? "rbc-active" : ""}
        >
          {messages.agenda}
        </button>
      </div>
    </div>
  );
};

const ShiftManagement = ({ currentUser = { id: 1 } }) => {
  const { t } = useTranslation();

  // Force English for date/time layout
  moment.locale("en");
  const localizer = momentLocalizer(moment);

  // Translated labels for the toolbar
  const messages = {
    today: t("calendarToday") || "Today",
    previous: t("calendarBack") || "Back",
    next: t("calendarNext") || "Next",
    month: t("month") || "Month",
    week: t("week") || "Week",
    day: t("day") || "Day",
    agenda: t("agenda") || "Agenda",
  };

  // Load shifts/employees from your API
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);

  const mapShifts = (shifts) =>
    shifts.map((shift) => ({
      id: shift.id,
      title: shift.title || t("unnamedShift"),
      shiftOwnerId: shift.shiftOwnerId || null,
      shiftOwner: shift.shiftOwnerName || t("unassigned"),
      role: shift.shiftOwnerRole || t("unassigned"),
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
    }));

  const loadShifts = async () => {
    try {
      const fetchedShifts = await fetchShifts();
      if (!Array.isArray(fetchedShifts)) {
        console.error("Invalid API response:", fetchedShifts);
        return;
      }
      setShifts(mapShifts(fetchedShifts));
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const users = await getAllUsers();
      if (!Array.isArray(users)) {
        console.error("Invalid API response:", users);
        return;
      }
      const employeeList = users.map((user) => ({
        id: user.id,
        name: user.username,
        role: user.roles[0]?.name || t("unassigned"),
      }));
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    loadShifts();
    loadEmployees();
  }, []);

  // SHIFT CREATION / EDIT STATE
  const [view, setView] = useState(Views.WEEK);
  const [newShift, setNewShift] = useState({
    id: 0,
    title: "",
    shiftOwnerId: null,
    shiftOwner: "",
    role: "",
    start: new Date(),
    end: new Date(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);

  // Convert shifts to calendar events
  const calendarEvents = shifts.map((shift) => ({
    id: shift.id,
    title: shift.title,
    shiftOwner: shift.shiftOwner,
    start: shift.start,
    end: shift.end,
    role: shift.role,
    shiftOwnerId: shift.shiftOwnerId,
  }));

  // Style function for calendar events
  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#3174ad",
        borderRadius: "5px",
        color: "white",
      },
    };
  };

  // SHIFT CREATE/UPDATE
  const handleAddOrUpdateShift = async (e) => {
    e.preventDefault();
    if (!newShift.title || !newShift.start || !newShift.end || !newShift.role) {
      alert(t("fillRequiredFields") || "Please fill out all required fields.");
      return;
    }

    const startDate = new Date(newShift.start);
    const endDate = new Date(newShift.end);
    const start = new Date(
      startDate.getTime() - startDate.getTimezoneOffset() * 60000
    ).toISOString();
    const end = new Date(
      endDate.getTime() - endDate.getTimezoneOffset() * 60000
    ).toISOString();

    if (start >= end) {
      alert(t("endTimeAfterStart") || "End time must be after start time.");
      return;
    }
    if (startDate.toDateString() !== endDate.toDateString()) {
      alert(
        t("shiftLongerThanOneDay") || "Shifts cannot extend beyond a single day."
      );
      return;
    }

    try {
      if (isEditing) {
        await supervisorUpdateShift(editingShiftId, {
          title: newShift.title,
          start,
          end,
          role: newShift.role,
          shiftOwnerId: newShift.shiftOwnerId || null,
          shiftOwner: newShift.shiftOwner,
        });
        setIsEditing(false);
        setEditingShiftId(null);
      } else {
        await supervisorCreateShift({
          title: newShift.title,
          start,
          end,
          role: newShift.role,
          shiftOwnerId: newShift.shiftOwnerId || null,
          shiftOwner: newShift.shiftOwner,
        });
      }
      // Reset form
      setNewShift({
        id: 0,
        title: "",
        shiftOwner: "",
        role: "",
        shiftOwnerId: null,
        start: new Date(),
        end: new Date(),
      });
      await loadShifts();
    } catch (error) {
      console.error("Error adding/updating shift:", error);
    }
  };

  // SHIFT EDIT
  const handleEditShift = (shift) => {
    setNewShift({
      title: shift.title,
      start: moment(shift.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(shift.end).format("YYYY-MM-DDTHH:mm"),
      role: shift.role,
      shiftOwnerId: shift.shiftOwnerId,
      shiftOwner: shift.shiftOwner,
    });
    setIsEditing(true);
    setEditingShiftId(shift.id);
  };

  // SHIFT DELETE
  const handleDeleteShift = async (shiftId) => {
    if (
      window.confirm(
        t("confirmDeleteShift") || "Are you sure you want to delete this shift?"
      )
    ) {
      try {
        await supervisorDeleteShift(shiftId);
        await loadShifts();
      } catch (error) {
        console.error("Error deleting shift:", error);
      }
    }
    loadShifts();
  };

  // EMPLOYEE SELECT
  const handleEmployeeChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selectedEmployee = employees.find((emp) => emp.id === selectedId);
    if (selectedEmployee) {
      setNewShift({
        ...newShift,
        shiftOwnerId: selectedEmployee.id,
        shiftOwner: selectedEmployee.name,
        role: selectedEmployee.role,
      });
    } else {
      setNewShift({
        ...newShift,
        shiftOwnerId: null,
        shiftOwner: "",
        role: t("unassigned") || "Unassigned",
      });
    }
  };

  return (
    <div className="shift-management">
      <h2 className="page-header">
        {t("shiftManagement") || "Shift Management"}
      </h2>

      <div className="shift-management-top">
        {/* SHIFT CREATION / EDIT FORM */}
        <div className="shift-creation">
          <h3>
            {isEditing
              ? t("editShift") || "Edit Shift"
              : t("createNewShift") || "Create New Shift"}
          </h3>
          <form onSubmit={handleAddOrUpdateShift}>
            {/* Only show employee dropdown if not editing */}
            {!isEditing && (
              <>
                <label>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {t("selectEmployeeTooltip", "Select an employee from the list.")}
                      </Tooltip>
                    }
                  >
                    <span className="tooltip-icon" style={{ marginRight: "8px" }}>
                      <InfoIcon />
                    </span>
                  </OverlayTrigger>
                  {t("Select Employee") || "Select Employee"}:
                </label>
                <select
                  value={newShift.shiftOwnerId || ""}
                  onChange={handleEmployeeChange}
                  required
                >
                  <option value="">{t("employee") || "Select Employee"}</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            {isEditing && (
              <>
                <label>{t("employeeAssigned") || "Employee Assigned"}:</label>
                <div className="employee-display">{newShift.shiftOwner}</div>
              </>
            )}

            {/* SHIFT NAME */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {t("shiftNameTooltip", "Enter the name of the shift.")}
                      </Tooltip>
                    }
                  >
                    <span className="tooltip-icon" style={{ marginRight: "8px" }}>
                      <InfoIcon />
                    </span>
                  </OverlayTrigger>
                  {t("shiftName") || "Shift Name"}:
                </label>
                <input
                  type="text"
                  value={newShift.title}
                  onChange={(e) => setNewShift({ ...newShift, title: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* START / END DATES */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {t("startDateTimeTooltip", "Select the start date/time.")}
                      </Tooltip>
                    }
                  >
                    <span className="tooltip-icon" style={{ marginRight: "8px" }}>
                      <InfoIcon />
                    </span>
                  </OverlayTrigger>
                  {t("startDateTime") || "Start Date & Time"}:
                </label>
                <input
                  type="datetime-local"
                  value={newShift.start}
                  onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {t("endDateTimeTooltip", "Select the end date/time.")}
                      </Tooltip>
                    }
                  >
                    <span className="tooltip-icon" style={{ marginRight: "8px" }}>
                      <InfoIcon />
                    </span>
                  </OverlayTrigger>
                  {t("endDateTime") || "End Date & Time"}:
                </label>
                <input
                  type="datetime-local"
                  value={newShift.end}
                  onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* ROLE */}
            <div className="form-row">
              <div className="form-group">
                <label>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {t("roleTooltip", "The role assigned to the shift.")}
                      </Tooltip>
                    }
                  >
                    <span className="tooltip-icon" style={{ marginRight: "8px" }}>
                      <InfoIcon />
                    </span>
                  </OverlayTrigger>
                  {t("role") || "Role"}:
                </label>
                <div className="role-display">{newShift.role}</div>
              </div>
            </div>

            {/* FORM BUTTONS */}
            <div className="form-actions">
              <button type="submit">
                {isEditing ? t("updateShift") || "Update Shift" : t("addShift") || "Add Shift"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingShiftId(null);
                    setNewShift({
                      id: 0,
                      title: "",
                      start: new Date(),
                      end: new Date(),
                      shiftOwner: "",
                      role: "",
                      shiftOwnerId: null,
                    });
                  }}
                >
                  {t("cancel") || "Cancel"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* CALENDAR CARD */}
        <div className="calendar-card">
          <h3>
            {t("calendar") || "Calendar"}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{t("calendarTooltip", "Company calendar view")}</Tooltip>}
            >
              <span className="tooltip-icon" style={{ marginLeft: "8px" }}>
                <InfoIcon />
              </span>
            </OverlayTrigger>
          </h3>
          <Calendar
            localizer={localizer}
            culture="en"
            messages={messages}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            eventPropGetter={eventStyleGetter}
            components={{ toolbar: CustomToolbar }}
            style={{ height: 500 }}
          />
        </div>
      </div>

      {/* SHIFT OVERVIEW TABLE */}
      <div className="shift-overview">
        <h3>{t("shiftOverview") || "Shift Overview"}</h3>
        <table>
          <thead>
            <tr>
              <th>{t("Employee Id") || "Employee Id"}</th>
              <th>{t("employeeName") || "Employee Name"}</th>
              <th>{t("date") || "Date"}</th>
              <th>{t("time") || "Time"}</th>
              <th>{t("role") || "Role"}</th>
              <th>{t("actions") || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td>{shift.shiftOwnerId || t("unassigned") || "Unassigned"}</td>
                <td>{shift.shiftOwner || t("unassigned") || "Unassigned"}</td>
                <td>{moment(shift.start).format("YYYY-MM-DD")}</td>
                <td>
                  {moment(shift.start).format("hh:mm A")} -{" "}
                  {moment(shift.end).format("hh:mm A")}
                </td>
                <td>
                  {shift.role.replace("-", " ") || t("unassigned") || "Unassigned"}
                </td>
                <td>
                  <button onClick={() => handleEditShift(shift)}>
                    {t("edit") || "Edit"}
                  </button>
                  <button onClick={() => handleDeleteShift(shift.id)}>
                    {t("delete") || "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftManagement;
