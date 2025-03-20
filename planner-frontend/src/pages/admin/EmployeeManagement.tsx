// src/pages/admin/EmployeeManagement.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import "./EmployeeManagement.css";

// API calls:
import { getAllUsers, getAllRoles, createUser, updateUser, deleteUser } from "../../Services/api.ts";

// Import OverlayTrigger and Tooltip from react-bootstrap
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Define an interface for employee data
interface Employee {
  id: number;
  employeeId?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  role: string;
}

interface EmployeeManagementProps {
  allowDelete?: boolean;
}

// Map raw role strings to translation keys
const roleTranslationMap: { [key: string]: string } = {
  shift_supervisor: "shiftSupervisorRole",
  technician: "technicianRole",
  tester: "testerRole",
  "incident-manager": "incidentManagerRole",
};

const EmployeeManagement: React.FC<EmployeeManagementProps> = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State for deletion permission
  const [allowDelete, setAllowDelete] = useState(false);

  // For new user popup
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [createdEmail, setCreatedEmail] = useState("");
  const [createdPassword, setCreatedPassword] = useState("");

  // Set up React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Local states for employees and roles
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  // Track which employee is being edited; null means new employee
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

  // Updated InfoIcon: White filled circle with a colored border and a black "i"
  const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#4da8d6" strokeWidth="1" />
      <path fill="#000000" d="M7.5 12h1V7h-1v5zm0-6h1V5h-1v1z" />
    </svg>
  );

  const fetchEmployees = async () => {
    try {
      const employees = await getAllUsers();
      if (!employees || !Array.isArray(employees)) {
        console.error("Error: Received invalid employee data", employees);
        setEmployees([]);
        return;
      }
      const formattedEmployees = employees.map((emp: any) => ({
        id: emp.id,
        name: emp.username,
        address: emp.address,
        phone: emp.phoneNum,
        email: emp.email,
        role: emp.roles.length > 0 ? emp.roles[0].name.replace("-", " ") : "unknown"
      }));
      setEmployees(formattedEmployees);
    } catch (error) {
      console.error("Error fetching employees, error:", error);
      setEmployees([]);
    }
  };

  useEffect(() => {
    if (user && user.permissions.includes("EMPLOYEE_DELETE")) {
      setAllowDelete(true);
    } else {
      setAllowDelete(false);
    }
  }, [user]);

  const fetchRoles = async () => {
    try {
      const rolesData = await getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  const onSubmit = async (data: any) => {
    const selectedRole = roles.find((role) => role.name === data.role);
    if (!selectedRole) {
      console.error("Invalid role selected.");
      return;
    }

    if (editingEmployeeId == null) {
      try {
        const newUser = {
          email: data.email,
          username: data.name,
          password: "password",
          address: data.address,
          phoneNum: data.phone,
          googleId: "",
          roles: [{ id: selectedRole.id, name: selectedRole.name }]
        };
        const retUser = await createUser(newUser);
        setCreatedEmail(retUser.email);
        setCreatedPassword(newUser.password);
        setShowUserPopup(true);
        reset();
        fetchEmployees();
      } catch (error) {
        console.error("Error creating user:", error);
      }
    } else {
      try {
        const userToUpdate = {
          id: editingEmployeeId,
          email: data.email,
          username: data.name,
          address: data.address,
          phoneNum: data.phone,
          roles: [{ id: selectedRole.id, name: selectedRole.name }]
        };
        await updateUser(userToUpdate);
        reset();
        fetchEmployees();
        setEditingEmployeeId(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  const editEmployee = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setValue("id", emp.id);
    setValue("name", emp.name);
    setValue("address", emp.address || "");
    setValue("phone", emp.phone || "");
    setValue("email", emp.email);
    setValue("role", emp.role);
  };

  const deleteEmployee = async (id: number) => {
    if (window.confirm(t("confirmDelete") || "Are you sure you want to delete this employee?")) {
      try {
        await deleteUser(id);
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const getRoleLabel = (rawRole: string) => {
    const translationKey = roleTranslationMap[rawRole];
    if (translationKey) {
      return t(translationKey);
    }
    return rawRole;
  };

  return (
    <div className="container">
      <h2>{t("employeeManagement") || "Employee Management"}</h2>
      {showUserPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t("userCreated") || "User Created!"}</h3>
            <p>{t("shareCredentials") || "Share the following credentials to your employee:"}</p>
            <p>
              {t("emailLabel") || "Email"}: '<span className="highlight">{createdEmail}</span>'
            </p>
            <p>
              {t("passwordLabel") || "Password"}: '<span className="highlight">{createdPassword}</span>'
            </p>
            <p>{t("passwordUpdatePrompt") || "It will be prompted to update its password for the first login"}</p>
            <button onClick={() => setShowUserPopup(false)}>{t("close") || "Close"}</button>
          </div>
        </div>
      )}

      {/* Employee Entry Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
        {editingEmployeeId == null && (
          <div className="form-row">
            <label>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="select-employee-tooltip" className="custom-tooltip">
                    {t("selectEmployeeTooltip", "Select an employee to edit.")}
                  </Tooltip>
                }
              >
                <span className="tooltip-icon">
                  <InfoIcon />
                </span>
              </OverlayTrigger>
              {t("selectEmployee") || "Select Employee"}:
            </label>
            <select
              data-test-id="employee-select"
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                const selectedEmployee = employees.find(emp => emp.id === selectedId);
                if (selectedEmployee) {
                  editEmployee(selectedEmployee);
                }
              }}
            >
              <option value="">{t("selectEmployeePlaceholder") || "Select an Employee"}</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id} data-test-id={`employee-option-${emp.id}`}>
                  {emp.id} - {emp.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {editingEmployeeId != null && (
          <div className="form-row">
            <label>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="id-tooltip" className="custom-tooltip">
                    {t("idTooltip", "This is your unique user ID.")}
                  </Tooltip>
                }
              >
                <span className="tooltip-icon">
                  <InfoIcon />
                </span>
              </OverlayTrigger>
              {t("idLabel") || "User ID"}:
            </label>
            <div className="id-display">{editingEmployeeId ?? "N/A"}</div>
          </div>
        )}

        <div className="form-row">
          <label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="name-tooltip" className="custom-tooltip">
                  {t("nameTooltip", "Enter the employee's full name.")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon">
                <InfoIcon />
              </span>
            </OverlayTrigger>
            {t("nameLabel") || "Name"}:
          </label>
          <input
            data-test-id="name-input"
            {...register("name", {
              required: t("nameRequired") || "Name is required",
            })}
            placeholder={t("employeeNamePlaceholder") || "Employee Name"}
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        <div className="form-row">
          <label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="address-tooltip" className="custom-tooltip">
                  {t("addressTooltip", "Enter the employee's address.")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon">
                <InfoIcon />
              </span>
            </OverlayTrigger>
            {t("addressLabel") || "Address"}:
          </label>
          <input
            data-test-id="address-input"
            {...register("address", {
              required: t("addressRequired") || "Address is required",
            })}
            placeholder={t("employeeAddressPlaceholder") || "Employee Address"}
          />
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div>

        <div className="form-row">
          <label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="phone-tooltip" className="custom-tooltip">
                  {t("phoneTooltip", "Enter the employee's phone number.")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon">
                <InfoIcon />
              </span>
            </OverlayTrigger>
            {t("phoneLabel") || "Phone Number"}:
          </label>
          <input
            data-test-id="phone-input"
            {...register("phone", {
              required: t("phoneRequired") || "Phone number is required",
              pattern: {
                value: /^[0-9-+()\s]+$/,
                message: t("phoneInvalid") || "Invalid phone number",
              },
            })}
            placeholder={t("phonePlaceholder") || "Phone Number"}
          />
          {errors.phone && <p className="error">{errors.phone.message}</p>}
        </div>

        <div className="form-row">
          <label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="email-tooltip" className="custom-tooltip">
                  {t("emailTooltip", "Enter a valid email address.")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon">
                <InfoIcon />
              </span>
            </OverlayTrigger>
            {t("emailLabel") || "E-mail Address"}:
          </label>
          <input
            data-test-id="email-input"
            {...register("email", {
              required: t("emailRequired") || "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: t("emailInvalid") || "Invalid email address",
              },
            })}
            placeholder={t("emailPlaceholder") || "Email"}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-row">
          <label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="role-tooltip" className="custom-tooltip">
                  {t("roleTooltip", "Select the employee's role.")}
                </Tooltip>
              }
            >
              <span className="tooltip-icon">
                <InfoIcon />
              </span>
            </OverlayTrigger>
            {t("roleLabel") || "Role"}:
          </label>
          <select
            {...register("role", {
              required: t("roleRequired") || "Role is required",
            })}
          >
            <option value="">{t("selectRolePlaceholder") || "Select role"}</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name} data-test-id={`role-${role.name}-select`}>
                {t(
                  roleTranslationMap[role.name.replace("-", " ")] ||
                  role.name.replace("-", " ")
                )}
              </option>
            ))}
          </select>
          {errors.role && <p className="error">{errors.role.message}</p>}
        </div>

        <div className="form-actions">
          <button type="submit" data-test-id="submit-button">
            {editingEmployeeId
              ? t("updateEmployee") || "Update Employee"
              : t("addEmployee") || "Add Employee"}
          </button>
          {editingEmployeeId && (
            <button
              type="button"
              onClick={() => {
                setEditingEmployeeId(null);
                reset();
              }}
            >
              {t("cancel") || "Cancel"}
            </button>
          )}
        </div>
      </form>

      <table className="employee-table">
        <thead>
          <tr>
            <th>{t("employeeIdLabel") || "Employee Id"}</th>
            <th>{t("nameLabel") || "Name"}</th>
            <th>{t("addressLabel") || "Address"}</th>
            <th>{t("phoneLabel") || "Phone Number"}</th>
            <th>{t("emailLabel") || "E-mail"}</th>
            <th>{t("roleLabel") || "Role"}</th>
            <th>{t("actionLabel") || "Action"}</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id} data-test-id={`employee-row-${emp.id}`}>
                <td>{emp.id || ""}</td>
                <td>{emp.name}</td>
                <td>{emp.address}</td>
                <td>{emp.phone}</td>
                <td>{emp.email}</td>
                <td>{getRoleLabel(emp.role)}</td>
                <td align="center">
                  <button onClick={() => editEmployee(emp)} data-test-id={`edit-button-${emp.id}`}>
                    {t("edit") || "Edit"}
                  </button>
                  {user?.permissions.includes("EMPLOYEE_DELETE") && (
                    <button onClick={() => deleteEmployee(emp.id)} data-test-id={`delete-button-${emp.id}`}>
                      {t("delete") || "Delete"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                {t("noEmployeesFound") || "No employees found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
