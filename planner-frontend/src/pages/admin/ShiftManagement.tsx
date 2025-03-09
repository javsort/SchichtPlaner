// src/pages/ShiftManagement.jsx
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { useTranslation } from "react-i18next"; // <-- Import the translation hook
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ShiftManagement.css";

const localizer = momentLocalizer(moment);

// Dummy employee data for display in the overview
const dummyEmployees = [
  { id: 1, name: "Justus Fynn", roles: ["Technician", "Supervisor"] },
  { id: 2, name: "Tanha Schmidt", roles: ["Technician"] },
  { id: 3, name: "Miley Cyrus", roles: ["Supervisor"] },
];

// Helper: Check if two time ranges overlap
const isOverlap = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

const ShiftManagement = ({ currentUser = { id: 1 } }) => {
  const { t } = useTranslation(); // <-- Use the translation hook

  const [shifts, setShifts] = useState([
    {
      id: 101,
      title: "Morning Shift",
      start: new Date(new Date().setHours(8, 0, 0)),
      end: new Date(new Date().setHours(12, 0, 0)),
      rolesRequired: ["Technician"],
      assignedEmployees: [1],
    },
    {
      id: 102,
      title: "Afternoon Shift",
      start: new Date(new Date().setHours(14, 0, 0)),
      end: new Date(new Date().setHours(18, 0, 0)),
      rolesRequired: ["Supervisor"],
      assignedEmployees: [2],
    },
  ]);

  const [view, setView] = useState(Views.WEEK);
  // Since the calendar filter isn't dynamically updated, we use a constant.
  const calendarFilter = "all";

  // State for the shift creation/edit form
  const [newShift, setNewShift] = useState({
    title: "",
    start: "",
    end: "",
    rolesRequired: "",
    assignedEmployees: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);

  // Filter shifts based on calendarFilter (here always "all")
  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    return true;
  });

  // Convert shifts to calendar events
  const calendarEvents = filteredShifts.map((shift) => ({
    ...shift,
    title:
      (shift.title || t("unnamedShift")) +
      " (" +
      (shift.assignedEmployees && shift.assignedEmployees.length > 0
        ? shift.assignedEmployees
            .map(
              (id) =>
                dummyEmployees.find((emp) => emp.id === id)?.name || id
            )
            .join(", ")
        : t("unassigned")) +
      ")",
  }));

  // Style events by roles
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    if (event.rolesRequired.includes("Supervisor")) {
      backgroundColor = "#2980b9";
    } else if (event.rolesRequired.includes("Technician")) {
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

    const rolesRequired = newShift.rolesRequired
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const assignedEmployees = newShift.assignedEmployees
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((id) => !isNaN(id));

    let conflictFound = false;
    assignedEmployees.forEach((empId) => {
      shifts.forEach((existingShift) => {
        if (isEditing && existingShift.id === editingShiftId) return;
        if (existingShift.assignedEmployees.includes(empId)) {
          if (isOverlap(start, end, existingShift.start, existingShift.end)) {
            conflictFound = true;
            const empName =
              dummyEmployees.find((e) => e.id === empId)?.name || empId;
            alert(
              t("conflictFound", { empName, existingTitle: existingShift.title }) ||
                `Conflict: Employee ${empName} already has an overlapping shift "${existingShift.title}".`
            );
          }
        }
      });
    });
    if (conflictFound) return;

    if (isEditing) {
      // Update existing shift
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
      // Create new shift
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

  const handleDeleteShift = (shiftId) => {
    if (window.confirm(t("confirmDeleteShift") || "Are you sure you want to delete this shift?")) {
      setShifts(shifts.filter((shift) => shift.id !== shiftId));
      if (isEditing && editingShiftId === shiftId) {
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

  return (
    <div className="shift-management">
      <h2>{t("shiftManagement") || "Shift Management"}</h2>

      <div className="shift-management-top">
        {/* SHIFT CREATION / EDIT FORM */}
        <div className="shift-card shift-creation">
          <h3>
            {isEditing ? t("editShift") || "Edit Shift" : t("createNewShift") || "Create New Shift"}
          </h3>
          <form onSubmit={handleAddOrUpdateShift}>
            <div className="form-row">
              <div className="form-group">
                <label>{t("shiftName") || "Shift Name"}:</label>
                <input
                  type="text"
                  value={newShift.title}
                  onChange={(e) =>
                    setNewShift({ ...newShift, title: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewShift({ ...newShift, start: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>{t("endDateTime") || "End Date & Time"}:</label>
                <input
                  type="datetime-local"
                  value={newShift.end}
                  onChange={(e) =>
                    setNewShift({ ...newShift, end: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t("rolesRequiredPlaceholder") || "Roles Required (comma separated)"}:</label>
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
                <label>{t("assignEmployeesPlaceholder") || "Assign Employees (comma separated IDs)"}:</label>
                <input
                  type="text"
                  placeholder="e.g., 1,2"
                  value={newShift.assignedEmployees}
                  onChange={(e) =>
                    setNewShift({
                      ...newShift,
                      assignedEmployees: e.target.value,
                    })
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

        {/* CALENDAR VIEW */}
        <div className="shift-card calendar-card">
          <h3>{t("calendar") || "Calendar"}</h3>
          <Calendar
            localizer={localizer}
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

      {/* SHIFT OVERVIEW TABLE */}
      <div className="shift-card shift-overview">
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
                    ? shift.assignedEmployees
                        .map(
                          (id) =>
                            dummyEmployees.find((emp) => emp.id === id)?.name ||
                            id
                        )
                        .join(", ")
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
