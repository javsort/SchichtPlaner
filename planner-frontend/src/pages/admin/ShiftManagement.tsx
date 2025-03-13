import React, { useState, FormEvent } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import "./ShiftManagement.css";

// NotificationBar component that slides in from the side
interface NotificationBarProps {
  message: string;
  type: "success" | "error" | "";
  visible: boolean;
  onClose: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ message, type, visible, onClose }) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div className={`notification-bar ${type} ${visible ? "show" : ""}`}>
      {message}
    </div>
  );
};

interface Shift {
  id: number;
  title: string;
  start: Date;
  end: Date;
  rolesRequired: string[];
  assignedEmployees: number[];
}

interface NewShift {
  title: string;
  start: string;
  end: string;
  rolesRequired: string;
  assignedEmployees: string;
}

interface ShiftManagementProps {
  currentUser?: { id: number };
}

const ShiftManagement: React.FC<ShiftManagementProps> = ({ currentUser = { id: 1 } }) => {
  const { t, i18n } = useTranslation();
  moment.locale(i18n.language);
  const localizer = momentLocalizer(moment);

  // Notification state
  const [notification, setNotification] = useState({
    message: "",
    type: "" as "success" | "error" | "",
    visible: false,
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message, visible: true });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  // Sample shifts state
  const [shifts, setShifts] = useState<Shift[]>([
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
  const [newShift, setNewShift] = useState<NewShift>({
    title: "",
    start: "",
    end: "",
    rolesRequired: "",
    assignedEmployees: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);

  const filteredShifts = shifts.filter((shift) => {
    if (calendarFilter === "my") {
      return shift.assignedEmployees.includes(currentUser.id);
    } else if (calendarFilter === "unoccupied") {
      return !shift.assignedEmployees || shift.assignedEmployees.length === 0;
    }
    return true;
  });

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

  const eventStyleGetter = (event: Shift) => {
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

  // Handle adding or updating a shift
  const handleAddOrUpdateShift = (e: FormEvent) => {
    e.preventDefault();
    if (!newShift.title || !newShift.start || !newShift.end) {
      showNotification("error", t("fillRequiredFields") || "Please fill out all required fields.");
      return;
    }
    const start = new Date(newShift.start);
    const end = new Date(newShift.end);
    if (start >= end) {
      showNotification("error", t("endTimeAfterStart") || "End time must be after start time.");
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
          if (start < existingShift.end && existingShift.start < end) {
            conflictFound = true;
            showNotification(
              "error",
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
      showNotification("success", t("shiftUpdated") || "Shift updated successfully!");
    } else {
      const newShiftEvent: Shift = {
        id: Date.now(),
        title: newShift.title,
        start,
        end,
        rolesRequired,
        assignedEmployees,
      };
      setShifts([...shifts, newShiftEvent]);
      showNotification("success", t("shiftAdded") || "Shift added successfully!");
    }

    setNewShift({
      title: "",
      start: "",
      end: "",
      rolesRequired: "",
      assignedEmployees: "",
    });
  };

  const handleEditShift = (shift: Shift) => {
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

  const handleDeleteShift = (shiftId: number) => {
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
      showNotification("success", t("shiftDeleted") || "Shift deleted successfully!");
    }
  };

  return (
    <div className="shift-management">
      <NotificationBar
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={hideNotification}
      />

      <h2 className="page-header">{t("shiftManagement") || "Shift Management"}</h2>
      <div className="shift-management-top">
        <div className="shift-card shift-creation">
          <h3 className="section-header">
            {isEditing ? t("editShift") || "Edit Shift" : t("createNewShift") || "Create New Shift"}
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
                  {t("rolesRequiredPlaceholder") || "Roles Required (comma separated)"}:
                </label>
                <input
                  type="text"
                  placeholder={t("rolesRequiredExample") || "Supervisor, Technician"}
                  value={newShift.rolesRequired}
                  onChange={(e) => setNewShift({ ...newShift, rolesRequired: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  {t("assignEmployeesPlaceholder") || "Assign Employees (comma separated IDs)"}:
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

        <div className="shift-card calendar-card">
          <h3 className="section-header">{t("calendar") || "Calendar"}</h3>
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
      <div className="shift-card shift-overview">
        <h3 className="section-header">
          {t("shiftOverview") || "Shift Overview"}
        </h3>
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
