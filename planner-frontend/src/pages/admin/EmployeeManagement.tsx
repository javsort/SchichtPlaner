// src/pages/admin/EmployeeManagement.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../AuthContext.tsx";
import { useTranslation } from "react-i18next";
import "./EmployeeManagement.css";

// API calls:
import { getAllUsers, getAllRoles, createUser, updateUser, deleteUser } from "../../Services/api.ts";

// Define an interface for employee data
interface Employee {
  id: number;          // Primary key from DB
  employeeId?: string; // <-- New field for a custom employee id
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
  // Add any other roles as needed
};

const EmployeeManagement: React.FC<EmployeeManagementProps> = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State that determines whether delete is allowed (Admin only)
  const [allowDelete, setAllowDelete] = useState(false);

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

  // Track which employee is being edited; null means we're adding a new employee
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.role === "Admin") {
      setAllowDelete(true);
    } else {
      setAllowDelete(false);
    }
  }, [user]);

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const rawEmployees = await getAllUsers();
      if (!rawEmployees || !Array.isArray(rawEmployees)) {
        console.error("Error: Received invalid employee data", rawEmployees);
        setEmployees([]);
        return;
      }

      // Format the employee data for display
      const formattedEmployees = rawEmployees.map((emp: any) => ({
        id: emp.id,
        employeeId: emp.employeeId || "", // Use the backend field if available
        name: emp.username,
        address: emp.address,
        phone: emp.phoneNum,
        email: emp.email,
        role: emp.roles.length > 0 ? emp.roles[0].name.replace("-", " ") : "unknown",
      }));

      setEmployees(formattedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  // Fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const rolesData = await getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  // Fetch employees and roles on component mount
  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  // Handle form submission for adding/updating an employee
  const onSubmit = async (data: any) => {
    try {
      const selectedRole = roles.find((role) => role.name === data.role);
      if (!selectedRole) {
        console.error("Invalid role selected.");
        return;
      }

      // Convert form data to user object for creation/updating
      const userPayload: any = {
        email: data.email,
        username: data.name,
        address: data.address,
        phoneNum: data.phone,
        roles: [{ id: selectedRole.id, name: selectedRole.name }],
      };

      // Include employeeId if provided:
      if (data.employeeId) {
        userPayload.employeeId = data.employeeId;
      }

      if (editingEmployeeId == null) {
        // Create new user
        userPayload.password = "password_test"; // Default password
        userPayload.googleId = "";
        await createUser(userPayload);
      } else {
        // Update existing user
        userPayload.id = editingEmployeeId;
        await updateUser(userPayload);
      }

      reset(); // Clear the form after submission
      fetchEmployees(); // Refresh employee list
      setEditingEmployeeId(null); // Reset editing state
    } catch (error) {
      console.error("Error creating/updating user:", error);
    }
  };

  // Pre-fill the form with an employee's data for editing
  const editEmployee = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setValue("employeeId", emp.employeeId || "");
    setValue("name", emp.name);
    setValue("address", emp.address || "");
    setValue("phone", emp.phone || "");
    setValue("email", emp.email);
    setValue("role", emp.role);
  };

  // Delete an employee (only if allowed and user is Admin)
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

  // Helper: Translate a raw role string (e.g., "shift_supervisor") to a localized label
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

      {/* Employee Entry Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
        {/* Employee Id */}
        <div className="form-row">
          <label>Employee Id:</label>
          <input
            {...register("employeeId")}
            placeholder="Employee Id"
          />
        </div>

        {/* Name */}
        <div className="form-row">
          <label>{t("name") || "Name"}:</label>
          <input
            {...register("name", {
              required: t("nameRequired") || "Name is required",
            })}
            placeholder={t("employeeNamePlaceholder") || "Employee Name"}
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        {/* Address */}
        <div className="form-row">
          <label>{t("address") || "Address"}:</label>
          <input
            {...register("address", {
              required: t("addressRequired") || "Address is required",
            })}
            placeholder={t("employeeAddressPlaceholder") || "Employee Address"}
          />
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div>

        {/* Phone */}
        <div className="form-row">
          <label>{t("phoneNumber") || "Phone Number"}:</label>
          <input
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

        {/* Email */}
        <div className="form-row">
          <label>{t("email") || "E-mail Address"}:</label>
          <input
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

        {/* Role */}
        <div className="form-row">
          <label>{t("role") || "Role"}:</label>
          <select
            {...register("role", {
              required: t("roleRequired") || "Role is required",
            })}
          >
            {/* Default 'Select Role' option */}
            <option value="">{t("select role") || "Select role"}</option>

            {/* Map over roles from the backend */}
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {t(
                  roleTranslationMap[role.name.replace("-", " ")] ||
                    role.name.replace("-", " ")
                )}
              </option>
            ))}
          </select>
          {errors.role && <p className="error">{errors.role.message}</p>}
        </div>

        {/* Form Buttons */}
        <div className="form-actions">
          <button type="submit">
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

      {/* Employee List Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>{t("Employee Id") || "Employee Id"}</th>
            <th>{t("name") || "Name"}</th>
            <th>{t("address") || "Address"}</th>
            <th>{t("phoneNumber") || "Phone Number"}</th>
            <th>{t("email") || "E-mail"}</th>
            <th>{t("role") || "Role"}</th>
            <th>{t("action") || "Action"}</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.employeeId || ""}</td>
                <td>{emp.name}</td>
                <td>{emp.address}</td>
                <td>{emp.phone}</td>
                <td>{emp.email}</td>
                <td>{getRoleLabel(emp.role)}</td>
                <td align="center">
                  <button onClick={() => editEmployee(emp)}>
                    {t("edit") || "Edit"}
                  </button>
                  {allowDelete && (
                    <button onClick={() => deleteEmployee(emp.id)}>
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
