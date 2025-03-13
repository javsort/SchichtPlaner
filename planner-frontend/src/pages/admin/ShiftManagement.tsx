// src/pages/ShiftManagement.jsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import "./ShiftManagement.css";

const ShiftManagement = ({ currentUser = { id: 1 } }) => {
  const { t, i18n } = useTranslation();
  moment.locale(i18n.language);
  const localizer = momentLocalizer(moment);

  const [shifts, setShifts] = useState([
    {
      id: 101,
      title: t("morningShift") || "Morning Shift",
      start: new Date(new Date().setHours(8, 0, 0)),
      end: new Date(new Date().setHours(12, 0, 0)),
      rolesRequired: [t("technician") || "Technician"],
      assignedEmployees: [1],
    },
    {
      id: 102,
      title: t("afternoonShift") || "Afternoon Shift",
      start: new Date(new Date().setHours(14, 0, 0)),
      end: new Date(new Date().setHours(18, 0, 0)),
      rolesRequired: [t("supervisor") || "Supervisor"],
      assignedEmployees: [2],
    },
  ]);

  const [view, setView] = useState(Views.WEEK);
  const calendarFilter = "all";
  const [newShift, setNewShift] = useState({
    title: "",
    start: "",
    end: "",
    rolesRequired: "",
    assignedEmployees: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);

  // Filter shifts if needed
  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    return true;
  });

  // Create events for the calendar
  const calendarEvents = filteredShifts.map((shift) => ({
    ...shift,
    title:
      (shift.title || t("unnamedShift") || "Unnamed Shift") +
      " (" +
      (shift.assignedEmployees && shift.assignedEmployees.length > 0
        ? shift.assignedEmployees.join(", ")
        : t("unassigned") || "Unassigned") +
      ")",
  }));

  // Dynamic event styling
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    if (
      event.rolesRequired.includes("Supervisor") ||
      event.rolesRequired.includes(t("supervisor"))
    ) {
      backgroundColor = "#2980b9";
    } else if (
      event.rolesRequired.includes("Technician") ||
      event.rolesRequired.includes(t("technician"))
    ) {
      backgroundColor = "#27ae60";
    }
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "none",
      },
    };
  };

  // Add or update a shift
  const handleAddOrUpdateShift = (e) => {
    e.preventDefault();
    if (!newShift.title || !newShift.start || !newShift.end) {
      alert(t("fillRequiredFields") || "Please fill out all required fields.");
      return;
    }
    const start = new Date(newShift.start);
    const end = new Date(newShift.end);
    if (start >= end) {
      alert(t("endTimeAfterStart") || "End time must be after start time.");
      return;
    }

    // Convert roles/employees from comma-separated strings to arrays
    const rolesRequired = newShift.rolesRequired
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const assignedEmployees = newShift.assignedEmployees
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((id) => !isNaN(id));

    // Check for conflicts
    let conflictFound = false;
    assignedEmployees.forEach((empId) => {
      shifts.forEach((existingShift) => {
        if (isEditing && existingShift.id === editingShiftId) return;
        if (existingShift.assignedEmployees.includes(empId)) {
          if (start < existingShift.end && existingShift.start < end) {
            conflictFound = true;
            alert(
              t("conflictFound", {
                empName: empId,
                existingTitle: existingShift.title,
              }) ||
                `Conflict: Employee ${empId} already has an overlapping shift "${existingShift.title}".`
            );
          }
        }
      });
    });
    if (conflictFound) return;

    // If no conflicts, proceed to add or update
    if (isEditing) {
      setShifts(
        shifts.map((shift) =>
          shift.id === editingShiftId
            ? {
                ...shift,
                title: newShift.title,
                start,
                end,
                rolesRequired,
                assignedEmployees,
              }
            : shift
        )
      );
      setIsEditing(false);
      setEditingShiftId(null);
    } else {
      const newShiftEvent = {
        id: Date.now(),
        title: newShift.title,
        start,
        end,
        rolesRequired,
        assignedEmployees,
      };
      setShifts([...shifts, newShiftEvent]);
    }

    // Reset form
    setNewShift({
      title: "",
      start: "",
      end: "",
      rolesRequired: "",
      assignedEmployees: "",
    });
  };

  // Edit an existing shift
  const handleEditShift = (shift) => {
    setNewShift({
      title: shift.title,
      start: moment(shift.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(shift.end).format("YYYY-MM-DDTHH:mm"),
      rolesRequired: shift.rolesRequired.join(", "),
      assignedEmployees: shift.assignedEmployees.join(", "),
    });
    setIsEditing(true);
    setEditingShiftId(shift.id);
  };

  // Delete a shift
  const handleDeleteShift = (shiftId) => {
    if (
      window.confirm(
        t("confirmDeleteShift") || "Are you sure you want to delete this shift?"
      )
    ) {
      setShifts(shifts.filter((shift) => shift.id !== shiftId));
      if (isEditing && editingShiftId === shiftId) {
        // If currently editing the shift being deleted, reset form
        setIsEditing(false);
        setEditingShiftId(null);
        setNewShift({
          title: "",
          start: "",
          end: "",
          rolesRequired: "",
          assignedEmployees: "",
        });
      }
    }
  };

  // Calendar translation messages
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
    <div className="shift-management">
      {/* Heading aligned left via CSS class */}
      <h2 className="page-header">{t("shiftManagement") || "Shift Management"}</h2>

      <div className="shift-management-top">
        {/* Shift Creation / Edit Form */}
        <div className="shift-creation">
          <h3>
            {isEditing
              ? t("editShift") || "Edit Shift"
              : t("createNewShift") || "Create New Shift"}
          </h3>
          <form onSubmit={handleAddOrUpdateShift}>
            <div className="form-row">
              <div className="form-group">
                <label>{t("shiftName") || "Shift Name"}:</label>
                <input
                  type="text"
                  value={newShift.title}
                  onChange={(e) => setNewShift({ ...newShift, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t("startDateTime") || "Start Date & Time"}:</label>
                <input
                  type="datetime-local"
                  value={newShift.start}
                  onChange={(e) => setNewShift({ ...newShift, start: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("endDateTime") || "End Date & Time"}:</label>
                <input
                  type="datetime-local"
                  value={newShift.end}
                  onChange={(e) => setNewShift({ ...newShift, end: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  {t("rolesRequiredPlaceholder") ||
                    "Roles Required (comma separated)"}:
                </label>
                <input
                  type="text"
                  placeholder={t("rolesRequiredExample") || "Supervisor, Technician"}
                  value={newShift.rolesRequired}
                  onChange={(e) =>
                    setNewShift({ ...newShift, rolesRequired: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>
                  {t("assignEmployeesPlaceholder") ||
                    "Assign Employees (comma separated IDs)"}:
                </label>
                <input
                  type="text"
                  placeholder="e.g., 1,2"
                  value={newShift.assignedEmployees}
                  onChange={(e) =>
                    setNewShift({ ...newShift, assignedEmployees: e.target.value })
                  }
                />
              </div>
            </div>

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
                      title: "",
                      start: "",
                      end: "",
                      rolesRequired: "",
                      assignedEmployees: "",
                    });
                  }}
                >
                  {t("cancel") || "Cancel"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Calendar Card */}
        <div className="calendar-card">
          <h3>{t("calendar") || "Calendar"}</h3>
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
            style={{ height: 500 }}
          />
        </div>
      </div>

      {/* Shift Overview Table */}
      <div className="shift-overview">
        <h3>{t("shiftOverview") || "Shift Overview"}</h3>
        <table>
          <thead>
            <tr>
              <th>{t("employeeName") || "Employee Name"}</th>
              <th>{t("date") || "Date"}</th>
              <th>{t("time") || "Time"}</th>
              <th>{t("rolesRequired") || "Roles Required"}</th>
              <th>{t("actions") || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td>
                  {shift.assignedEmployees && shift.assignedEmployees.length > 0
                    ? shift.assignedEmployees.join(", ")
                    : t("unassigned") || "Unassigned"}
                </td>
                <td>{moment(shift.start).format("YYYY-MM-DD")}</td>
                <td>
                  {moment(shift.start).format("hh:mm A")} -{" "}
                  {moment(shift.end).format("hh:mm A")}
                </td>
                <td>{shift.rolesRequired.join(", ")}</td>
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
