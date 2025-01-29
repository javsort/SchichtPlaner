import React, { useState } from "react";
import { useForm } from "react-hook-form";

const EmployeeManagement = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [employees, setEmployees] = useState([]);

  const onSubmit = (data) => {
    setEmployees([...employees, { ...data, id: Date.now() }]);
    reset();
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="container">
      <h2>Employee Management</h2>

      {/* Employee Entry Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: "Name is required" })} placeholder="Employee Name" />
        {errors.name && <p>{errors.name.message}</p>}

        <input {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })} placeholder="Email" />
        {errors.email && <p>Invalid Email</p>}

        <input {...register("password", { required: "Password is required", minLength: 6 })} type="password" placeholder="Password" />
        {errors.password && <p>Password must be at least 6 characters</p>}

        <button type="submit">Add Employee</button>
      </form>

      {/* Employee List Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>
                <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeManagement;
