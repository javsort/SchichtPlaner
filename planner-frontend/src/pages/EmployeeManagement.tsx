import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../AuthContext.tsx";
import "./EmployeeManagement.css";

// Define a props interface with an optional allowDelete flag.
interface EmployeeManagementProps {
  allowDelete?: boolean;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ allowDelete = false }) => {
  const { user } = useAuth(); // Get the current user
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Pre-populated list of employees
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Justus Magdy",
      address: "123 Main St, Anytown",
      phone: "555-123-4567",
      email: "justmag@example.com",
      role: "shift supervisor",
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
    {
      id: 3,
      name: "David Marco",
      address: "789 Pine Rd, Sometown",
      phone: "555-555-5555",
      email: "davidmar@example.com",
      role: "tester",
      absences: 1,
    },
    {
      id: 4,
      name: "Amina Saad",
      address: "321 Elm St, Anycity",
      phone: "555-444-3333",
      email: "aminasaas@example.com",
      role: "incident-manager",
      absences: 3,
    },
  ]);

  // When editing, store the employee id; null means adding a new employee.
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);

  // Handle form submission for adding/updating an employee
  const onSubmit = (data: any) => {
    const employeeData = {
      ...data,
      absences: Number(data.absences),
    };

    if (editingEmployeeId) {
      // Update existing employee
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployeeId ? { ...employeeData, id: editingEmployeeId } : emp
        )
      );
      setEditingEmployeeId(null);
    } else {
      // Add new employee
      const newEmployee = { ...employeeData, id: Date.now() };
      setEmployees([...employees, newEmployee]);
    }
    reset();
  };

  // Pre-fill the form with an employee's data for editing
  const editEmployee = (emp: any) => {
    setEditingEmployeeId(emp.id);
    setValue("name", emp.name);
    setValue("address", emp.address);
    setValue("phone", emp.phone);
    setValue("email", emp.email);
    setValue("role", emp.role);
    setValue("absences", emp.absences);
  };

  // Delete an employee
  const deleteEmployee = (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  return (
    <div className="container">
      <h2>Employee Management</h2>

      {/* Employee Entry Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
        <div className="form-row">
          <label>Name:</label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Employee Name"
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
        <div className="form-row">
          <label>Address:</label>
          <input
            {...register("address", { required: "Address is required" })}
            placeholder="Employee Address"
          />
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div>
        <div className="form-row">
          <label>Phone Number:</label>
          <input
            {...register("phone", {
              required: "Phone number is required",
              pattern: { value: /^[0-9-+()\s]+$/, message: "Invalid phone number" },
            })}
            placeholder="Phone Number"
          />
          {errors.phone && <p className="error">{errors.phone.message}</p>}
        </div>
        <div className="form-row">
          <label>E-mail Address:</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
            })}
            placeholder="Email"
          />
          {errors.email && <p className="error">Invalid Email</p>}
        </div>
        <div className="form-row">
          <label>Role:</label>
          <input
            {...register("role", { required: "Role is required" })}
            placeholder="Role (e.g., shift supervisor, technician, tester, incident-manager)"
          />
          {errors.role && <p className="error">{errors.role.message}</p>}
        </div>
        <div className="form-row">
          <label>Number of Absences:</label>
          <input
            {...register("absences", { required: "Absences is required", valueAsNumber: true })}
            type="number"
            placeholder="Number of Absences"
          />
          {errors.absences && <p className="error">{errors.absences.message}</p>}
        </div>
        <div className="form-actions">
          <button type="submit">
            {editingEmployeeId ? "Update Employee" : "Add Employee"}
          </button>
          {editingEmployeeId && (
            <button
              type="button"
              onClick={() => {
                setEditingEmployeeId(null);
                reset();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Employee List Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>E-mail</th>
            <th>Role</th>
            <th>Absences</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.address}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>{emp.absences}</td>
              <td>
                <button onClick={() => editEmployee(emp)}>Edit</button>
                {/* Only render the delete button if allowDelete is true and the logged-in user is an Administrator */}
                {allowDelete && user?.role === "Administrator" && (
                  <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
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
