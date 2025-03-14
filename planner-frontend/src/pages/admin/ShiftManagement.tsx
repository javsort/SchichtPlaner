// src/pages/ShiftManagement.jsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import "./ShiftManagement.css";
import { fetchShifts, getAllUsers, supervisorCreateShift, supervisorDeleteShift, supervisorUpdateShift } from "../../Services/api.ts";

const ShiftManagement = ({ currentUser = { id: 1 } }) => {
  const { t, i18n } = useTranslation();
  moment.locale(i18n.language);
  const localizer = momentLocalizer(moment);

  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);

  interface Shift {
    id: number;
    title: string;
    employeeId: number | null;
    shiftOwner: string;
    role: string;
    start: Date;
    end: Date;
  };

  const mapShifts = (shifts): Shift[] => {
    return shifts.map((shift) => ({
      id: shift.id,
      title: shift.title || t("unnamedShift"),
      employeeId: shift.employeeId || null,
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

  // Load shifts from the backend
  useEffect(() => {
    loadShifts();
    loadEmployees();
  }, []);

  const [view, setView] = useState(Views.WEEK);
  const [newShift, setNewShift] = useState<Shift>({
    id: 0,
    title: "",
    employeeId: null,
    shiftOwner: "",
    role: "",
    start: new Date(),
    end: new Date(),
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState(null);

  const calendarEvents = shifts.map((shift: Shift) => ({
    id: shift.id,
    title: `${shift.title} (${shift.shiftOwner})`,
    shiftOwner: shift.shiftOwner,
    start: shift.start,
    end: shift.end,
    role: shift.role,
    employeeId: shift.employeeId
  }));

  // Dynamic event styling
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    /*if (event.role.includes("Supervisor")) backgroundColor = "#2980b9";
    else if (event.role.includes("Technician")) backgroundColor = "#27ae60";*/

    return { style: { backgroundColor, borderRadius: "5px", color: "white" } };
  };


  const handleAddOrUpdateShift = async (e) => {
    e.preventDefault();
    if (!newShift.title || !newShift.start || !newShift.end || !newShift.role) {
      alert(t("fillRequiredFields") || "Please fill out all required fields.");
      return;
    }

    const startDate = new Date(newShift.start);
    startDate.setDate(startDate.getDate());
    const start = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString();

    const endDate = new Date(newShift.end);
    endDate.setDate(endDate.getDate());
    const end = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString();

    console.log(`Before offset: Start: ${startDate}, End: ${endDate}`);
    console.log(`After offset: Start: ${start}, End: ${end}`);

    if (start >= end) {
      alert(t("endTimeAfterStart") || "End time must be after start time.");
      return;
    }
    
    // Fix pls
    /* Check for conflicts
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
    if (conflictFound) return; */

    // If no conflicts, proceed to add or update
    if (startDate.toDateString() !== endDate.toDateString()) {
      alert(t("shiftLongerThanOneDay") || "Shifts cannot extend beyond a single day.");
      return;
    }

    try {
      if (isEditing) {
        await supervisorUpdateShift(editingShiftId, {
          title: newShift.title,
          start: start,
          end: end,
          role: newShift.role,
          employeeId: newShift.employeeId || null,
          shiftOwner: newShift.shiftOwner,
        });

        setIsEditing(false);
        setEditingShiftId(null);
        
      } else {
        await supervisorCreateShift({
          title: newShift.title,
          start: start,
          end: end,
          role: newShift.role,
          employeeId: newShift.employeeId || null,
          shiftOwner: newShift.shiftOwner,
        });
      }

      setNewShift({ id: 0, shiftOwner: "", title: "", start: new Date(), end: new Date(), role: "" , employeeId: null});
      await loadShifts();
    } catch (error) {
      console.error("Error adding/updating shift:", error);
    }
  };
  

  const handleEditShift = (shift) => {
    
    setNewShift({
      title: shift.title,
      start: moment(shift.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(shift.end).format("YYYY-MM-DDTHH:mm"),
      role: shift.role,
      employeeId: shift.employeeId ,
      shiftOwner: shift.shiftOwner,
    });

    setIsEditing(true);
    setEditingShiftId(shift.id);
  };

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

  const handleEmployeeChange = (e) => {
    const selectedEmployee = employees.find(emp => emp.id === parseInt(e.target.value, 10));
  
    if (selectedEmployee) {
      setNewShift({
        ...newShift,
        employeeId: selectedEmployee.id,
        shiftOwner: selectedEmployee.name,
        role: selectedEmployee.role,
      });
    } else {
      setNewShift({
        ...newShift,
        employeeId: null,
        shiftOwner: "", // Reset if no employee selected
        role: "Unassigned",
      });
    }
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
            {!isEditing && (
              <>
              <label>{t("selectEmployee") || "Select Employee"}:</label>
              <select
                value={newShift.employeeId || ""} // Ensure it selects the correct employee ID
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
                      start: new Date(),
                      end: new Date(),
                      shiftOwner: "",
                      role : "",
                      employeeId: null,
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
            onView={setView}
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
                <td>{shift.role.replace("-", " ") || t("unassigned") || "Unassigned"}</td>
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
