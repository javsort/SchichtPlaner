import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";

const Employees = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");

  const onSubmit = (data) => {
    setEmployees([...employees, { ...data, id: Date.now() }]);
    setMessage("Employee added successfully!");
    reset();
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="container mt-4">
      <h2>Employee Management</h2>

      {/* Employee Entry Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-2">
          <input {...register("name", { required: "Name is required" })} className="form-control" placeholder="Employee Name" />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </div>

        <div className="mb-2">
          <input {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })} className="form-control" placeholder="Email" />
          {errors.email && <p className="text-danger">Invalid Email</p>}
        </div>

        <div className="mb-2">
          <input {...register("password", { required: "Password is required", minLength: 6 })} type="password" className="form-control" placeholder="Password" />
          {errors.password && <p className="text-danger">Password must be at least 6 characters</p>}
        </div>

        <button type="submit" className="btn btn-primary">Save Employee</button>
      </form>

      {/* Confirmation Message */}
      {message && <div className="alert alert-success mb-4">{message}</div>}

      {/* Employee List Table */}
      <table className="table table-bordered">
        <thead className="table-dark">
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
                <button className="btn btn-danger btn-sm" onClick={() => deleteEmployee(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
