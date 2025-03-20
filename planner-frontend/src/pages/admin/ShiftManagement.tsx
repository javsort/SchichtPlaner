// src/pages/ShiftManagement.jsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de"; // If you need German or other locales
import "react-big-calendar/lib/css/react-big-calendar.css"; // RBC default styling
import { useTranslation } from "react-i18next";
import "./ShiftManagement.css";
import {
  fetchShifts,
  getAllUsers,
  supervisorCreateShift,
  supervisorDeleteShift,
  supervisorUpdateShift,
} from "../../Services/api.ts";
import momentTZ from "moment-timezone"; // if needed for time zones

const ShiftManagement = ({ currentUser = { id: 1 } }) => {
  const { t, i18n } = useTranslation();
  // Set moment's locale to match the current language
  moment.locale(i18n.language);

  const localizer = momentLocalizer(moment);

  // RBC’s default toolbar labels, localized
  const messages = {
    today: t("calendarToday") || "Today",
    previous: t("calendarBack") || "Back",
    next: t("calendarNext") || "Next",
    month: t("month") || "Month",
    week: t("week") || "Week",
    day: t("day") || "Day",
    agenda: t("agenda") || "Agenda",
  };

  // STATE for shifts, employees
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);

  // SHIFT interface (pseudo-TS for clarity)
  // { id, title, shiftOwnerId, shiftOwner, role, start, end }

  // Map raw shifts from API into RBC-friendly objects
  const mapShifts = (rawShifts) =>
    rawShifts.map((shift) => ({
      id: shift.id,
      title: shift.title || t("unnamedShift"),
      shiftOwnerId: shift.shiftOwnerId || null,
      shiftOwner: shift.shiftOwnerName || t("unassigned"),
      role: shift.shiftOwnerRole || t("unassigned"),
      start: new Date(shift.startTime),
      end: new Date(shift.endTime),
    }));

  // LOAD SHIFT DATA
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

  // LOAD EMPLOYEE DATA
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
        role: user.roles?.[0]?.name || t("unassigned"),
      }));
      setEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // On mount
  useEffect(() => {
    loadShifts();
    loadEmployees();
  }, []);

  // RBC “view” state
  const [view, setView] = useState(Views.WEEK);

  // SHIFT creation/edit form state
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

  // RBC events: convert shifts to RBC-friendly objects
  const calendarEvents = shifts.map((s) => ({
    id: s.id,
    title: s.title,
    shiftOwner: s.shiftOwner,
    start: s.start,
    end: s.end,
    role: s.role,
    shiftOwnerId: s.shiftOwnerId,
  }));

  // A single color for all events (RBC default is #3174ad)
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "#3174ad",
      borderRadius: "5px",
      color: "#fff",
    },
  });

  // SHIFT CREATE/UPDATE
  const handleAddOrUpdateShift = async (e) => {
    e.preventDefault();
    const { title, start, end, role, shiftOwnerId, shiftOwner } = newShift;
    if (!title || !start || !end || !role) {
      alert(t("fillRequiredFields") || "Please fill out all required fields.");
      return;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Convert to UTC ISO (minus local TZ offset)
    const startISO = new Date(
      startDate.getTime() - startDate.getTimezoneOffset() * 60000
    ).toISOString();
    const endISO = new Date(
      endDate.getTime() - endDate.getTimezoneOffset() * 60000
    ).toISOString();

    // Basic validation
    if (startISO >= endISO) {
      alert(t("endTimeAfterStart") || "End time must be after start time.");
      return;
    }
    if (startDate.toDateString() !== endDate.toDateString()) {
      alert(
        t("shiftLongerThanOneDay") ||
          "Shifts cannot extend beyond a single day."
      );
      return;
    }

    // If editing or creating
    try {
      if (isEditing) {
        await supervisorUpdateShift(editingShiftId, {
          title,
          start: startISO,
          end: endISO,
          role,
          shiftOwnerId: shiftOwnerId || null,
          shiftOwner,
        });
        setIsEditing(false);
        setEditingShiftId(null);
      } else {
        await supervisorCreateShift({
          title,
          start: startISO,
          end: endISO,
          role,
          shiftOwnerId: shiftOwnerId || null,
          shiftOwner,
        });
      }
      // Reset form
      setNewShift({
        id: 0,
        title: "",
        shiftOwnerId: null,
        shiftOwner: "",
        role: "",
        start: new Date(),
        end: new Date(),
      });
      await loadShifts();
    } catch (err) {
      console.error("Error adding/updating shift:", err);
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
      } catch (err) {
        console.error("Error deleting shift:", err);
      }
    }
  };

  // Employee selection in the form
  const handleEmployeeChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const foundEmp = employees.find((emp) => emp.id === selectedId);
    if (foundEmp) {
      setNewShift((prev) => ({
        ...prev,
        shiftOwnerId: foundEmp.id,
        shiftOwner: foundEmp.name,
        role: foundEmp.role,
      }));
    } else {
      setNewShift((prev) => ({
        ...prev,
        shiftOwnerId: null,
        shiftOwner: "",
        role: t("unassigned") || "Unassigned",
      }));
    }
  };

  return (
    <div className="shift-management">
      <h2 className="page-header">{t("shiftManagement") || "Shift Management"}</h2>

      <div className="shift-management-top">
        {/* SHIFT FORM */}
        <div className="shift-creation">
          <h3>
            {isEditing
              ? t("editShift") || "Edit Shift"
              : t("createNewShift") || "Create New Shift"}
          </h3>
          <form onSubmit={handleAddOrUpdateShift}>
            {/* If not editing, show select employee */}
            {!isEditing && (
              <>
                <label>{t("Select Employee") || "Select Employee"}:</label>
                <select
                  value={newShift.shiftOwnerId || ""}
                  onChange={handleEmployeeChange}
                  required
                >
                  <option value="">{t("employee") || "Select Employee"}</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            {/* If editing, display assigned employee */}
            {isEditing && (
              <>
                <label>{t("employeeAssigned") || "Employee Assigned"}:</label>
                <div className="employee-display">{newShift.shiftOwner}</div>
              </>
            )}

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
                <label>{t("role") || "Role"}:</label>
                <div className="role-display">{newShift.role}</div>
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
                      id: 0,
                      title: "",
                      shiftOwnerId: null,
                      shiftOwner: "",
                      role: "",
                      start: new Date(),
                      end: new Date(),
                    });
                  }}
                >
                  {t("cancel") || "Cancel"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* CALENDAR */}
        <div className="calendar-card">
          <h3>{t("calendar") || "Calendar"}</h3>
          <Calendar
            key={i18n.language} // re-render if language changes
            localizer={localizer}
            culture={i18n.language}
            messages={messages}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            eventPropGetter={eventStyleGetter}
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
