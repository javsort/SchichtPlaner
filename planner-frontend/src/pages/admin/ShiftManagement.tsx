// src/pages/ShiftManagement.jsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import "./ShiftManagement.css";
import { fetchShifts, getAllUsers } from "../../Services/api.ts";

const ShiftManagement = ({ currentUser = { id: 1 } }) => {
  const { t, i18n } = useTranslation();
  moment.locale(i18n.language);
  const localizer = momentLocalizer(moment);

  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Load shifts from the backend
  useEffect(() => {
    const loadShifts = async () => {
      try {
        const fetchedShifts = await fetchShifts();
        if (!Array.isArray(fetchedShifts)) {
          console.error("Invalid API response:", fetchedShifts);
          return;
        }

        const formattedShifts = fetchedShifts.map((shift) => ({
          id: shift.id,
          shiftOwner: shift.shiftOwnerName || t("unassigned"),
          title: shift.title || t("unnamedShift"),
          start: new Date(shift.startTime),
          end: new Date(shift.endTime),
          role: shift.shiftOwnerRole || t("unassigned"),
        }));

        setShifts(formattedShifts);
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

        // Extract usernames for employees
        const employeeList = users.map(user => ({
          id: user.id,
          name: user.username,
          role: user.roles[0]?.name || t("unassigned") || "Unassigned"
        }));

        setEmployees(employeeList);

      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }

    loadShifts();
    loadEmployees();
  }, []);

  const [view, setView] = useState(Views.WEEK);
  const [newShift, setNewShift] = useState({
    title: "",
    start: "",
    end: "",
    role: "",
    employeeId: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);

  const calendarEvents = shifts.map((shift) => ({
    id: shift.id,
    title: `${shift.title} (${shift.shiftOwner})`,
    start: shift.start,
    end: shift.end,
    role: shift.role,
    employeeId: shift.employeeId
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    /*if (event.role.includes("Supervisor")) backgroundColor = "#2980b9";
    else if (event.role.includes("Technician")) backgroundColor = "#27ae60";*/

    return { style: { backgroundColor, borderRadius: "5px", color: "white" } };
  };

  const handleAddOrUpdateShift = (e) => {
    e.preventDefault();
    if (!newShift.title || !newShift.start || !newShift.end || !newShift.role) {
      alert(t("fillRequiredFields") || "Please fill out all required fields.");
      return;
    }

    const start = new Date(newShift.start);
    const end = new Date(newShift.end);
    if (start >= end) {
      alert(t("endTimeAfterStart") || "End time must be after start time.");
      return;
    }

    if (isEditing) {
      setShifts(
        shifts.map((shift) =>
          shift.id === editingShiftId ? { ...shift, ...newShift, start, end , employeeId } : shift
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
        role: newShift.role,
        employeeId: newShift.employeeId,
      };
      setShifts([...shifts, newShiftEvent]);
    }

    setNewShift({ title: "", start: "", end: "", role: "" , employeeId: ""});
  };
  
  const handleEditShift = (shift) => {
    setNewShift({
      title: shift.title,
      start: moment(shift.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(shift.end).format("YYYY-MM-DDTHH:mm"),
      role: shift.role,
      employeeId: shift.employeeId
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
        setNewShift({ title: "", start: "", end: "", role: "" , employeeId: ""});
      }
    }
  };

  const messages = {
    today: t("calendarToday"),
    previous: t("calendarBack"),
    next: t("calendarNext"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda")
  };

  const handleEmployeeChange = (e) => {
    const selectedEmployee = employees.find(emp => emp.id === parseInt(e.target.value));
    setNewShift({
      ...newShift,
      employeeId: selectedEmployee ? selectedEmployee.id : "",
      role: selectedEmployee ? selectedEmployee.role : "Unassigned"
    });
  };

  return (
    <div className="shift-management">
      <h2>{t("shiftManagement") || "Shift Management"}</h2>
      <div className="shift-management-top">
        <div className="shift-card shift-creation">
          <h3>
            {isEditing
              ? t("editShift") || "Edit Shift"
              : t("createNewShift") || "Create New Shift"}
          </h3>
          <form onSubmit={handleAddOrUpdateShift}>
            {!isEditing && (
              <>
              <label>{t("selectEmployee") || "Select Employee"}:</label>
              <select
                value={newShift.employeeId}
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
                  {t("role") || "Role"}:
                </label>
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
                      title: "",
                      start: "",
                      end: "",
                      role : "",
                      employeeId: ""
                    });
                  }}
                >
                  {t("cancel") || "Cancel"}
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="shift-card calendar-card">
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
            onView={setView}
            eventPropGetter={eventStyleGetter}
            style={{ height: 500 }}
          />
        </div>
      </div>
      <div className="shift-card shift-overview">
        <h3>{t("shiftOverview") || "Shift Overview"}</h3>
        <table>
          <thead>
            <tr>
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
                <td>
                  {shift.shiftOwner || t("unassigned") || "Unassigned"}
                </td>
                <td>{moment(shift.start).format("YYYY-MM-DD")}</td>
                <td>
                  {moment(shift.start).format("hh:mm A")} -{" "}
                  {moment(shift.end).format("hh:mm A")}
                </td>
                <td>{shift.role || t("unassigned") || "Unassigned"}</td>
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
