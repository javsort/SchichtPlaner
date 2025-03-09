// src/pages/admin/EmployeeManagement.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../AuthContext.tsx"; // Adjust the path as needed
import { useTranslation } from "react-i18next";
import "./EmployeeManagement.css";

// Define an interface for employee data
interface Employee {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  role: string; // e.g., "shift_supervisor", "technician", etc.
  absences: number;
}

interface EmployeeManagementProps {
  allowDelete?: boolean;
}

// Map raw role strings to translation keys
const roleTranslationMap: { [key: string]: string } = {
  shift_supervisor: "shiftSupervisorRole", // We'll define shiftSupervisorRole in the JSON
  technician: "technicianRole",
  tester: "testerRole",
  "incident-manager": "incidentManagerRole",
  // Add any other roles as needed
};

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ allowDelete = false }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Set up React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Pre-populated list of employees
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Justus Magdy",
      address: "123 Main St, Anytown",
      phone: "555-123-4567",
      email: "justmag@example.com",
      role: "shift_supervisor", // Raw role string
      absences: 2,
    },
    {
      id: 2,
      name: "Hany Ali",
      address: "456 Oak Ave, Othertown",
      phone: "555-987-6543",
      email: "hanyali@example.com",
      role: "technician",
      absences: 0,
    },
  ]);

  // Track which employee is being edited; null means we're adding a new employee
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

  // Handle form submission for adding/updating an employee
  const onSubmit = (data: any) => {
    // Convert string to number for absences
    const employeeData: Employee = {
      ...data,
      absences: Number(data.absences),
      // If editing, reuse the existing ID; otherwise create a new one
      id: editingEmployeeId ? editingEmployeeId : Date.now(),
    };

    if (editingEmployeeId) {
      // Update existing employee
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployeeId ? employeeData : emp
        )
      );
      setEditingEmployeeId(null);
    } else {
      // Add new employee
      setEmployees((prev) => [...prev, employeeData]);
    }
    reset();
  };

  // Pre-fill the form with an employee's data for editing
  const editEmployee = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setValue("name", emp.name);
    setValue("address", emp.address);
    setValue("phone", emp.phone);
    setValue("email", emp.email);
    setValue("role", emp.role);
    setValue("absences", emp.absences);
  };

  // Delete an employee (only if allowed and user is Admin)
  const deleteEmployee = (id: number) => {
    if (window.confirm(t("confirmDelete") || "Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  // Helper: Translate a raw role string (e.g., "shift_supervisor") to a localized label
  const getRoleLabel = (rawRole: string) => {
    const translationKey = roleTranslationMap[rawRole];
    if (translationKey) {
      return t(translationKey);
    }
    // If the role isn't in the map, fallback to the raw string
    return rawRole;
  };

  return (
    <div className="container">
      <h2>{t("employeeManagement") || "Employee Management"}</h2>

      {/* Employee Entry Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
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

        <div className="form-row">
          <label>{t("role") || "Role"}:</label>
          <input
            {...register("role", {
              required: t("roleRequired") || "Role is required",
            })}
            placeholder={
              t("rolePlaceholder") ||
              "Role (e.g., shift supervisor, technician, tester, incident-manager)"
            }
          />
          {errors.role && <p className="error">{errors.role.message}</p>}
        </div>

        <div className="form-row">
          <label>{t("absences") || "Absences"}:</label>
          <input
            {...register("absences", {
              required: t("absencesRequired") || "Absences is required",
              valueAsNumber: true,
            })}
            type="number"
            placeholder={t("absencesPlaceholder") || "Number of Absences"}
          />
          {errors.absences && <p className="error">{errors.absences.message}</p>}
        </div>

        <div className="form-actions">
          <button type="submit">
            {editingEmployeeId ? t("updateEmployee") || "Update Employee" : t("addEmployee") || "Add Employee"}
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
            <th>{t("name") || "Name"}</th>
            <th>{t("address") || "Address"}</th>
            <th>{t("phoneNumber") || "Phone Number"}</th>
            <th>{t("email") || "E-mail"}</th>
            <th>{t("role") || "Role"}</th>
            <th>{t("absences") || "Absences"}</th>
            <th>{t("action") || "Action"}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.address}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              {/* Map the raw role to a translated label */}
              <td>{getRoleLabel(emp.role)}</td>
              <td>{emp.absences}</td>
              <td>
                <button onClick={() => editEmployee(emp)}>
                  {t("edit") || "Edit"}
                </button>
                {/* Only show delete if allowed and user is an Administrator */}
                {allowDelete && user?.role === "Administrator" && (
                  <button onClick={() => deleteEmployee(emp.id)}>
                    {t("delete") || "Delete"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
