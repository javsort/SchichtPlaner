// src/pages/EmployeeManagement.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import EmployeeManagement from "./EmployeeManagement";

// Mock the AuthContext so that useAuth returns a user with role "Administrator"
jest.mock("../AuthContext.tsx", () => ({
  useAuth: () => ({ user: { role: "Administrator" } }),
}));

describe("EmployeeManagement Component", () => {
  test("renders header, form fields, and employee table", () => {
    render(<EmployeeManagement allowDelete={true} />);
    
    // Check header
    expect(screen.getByText("Employee Management")).toBeInTheDocument();
    
    // Check form fields by placeholder text
    expect(screen.getByPlaceholderText("Employee Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Employee Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Role/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Number of Absences")).toBeInTheDocument();
    
    // Check submit button
    expect(screen.getByRole("button", { name: /Add Employee/i })).toBeInTheDocument();
    
    // Check the employee table.
    // Assume there is 1 header row + 4 pre-populated employee rows.
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(5);
    // Verify a known pre-populated employee is present.
    expect(screen.getByText("Justus Magdy")).toBeInTheDocument();
  });

  test("adds a new employee on form submission", async () => {
    render(<EmployeeManagement allowDelete={true} />);
    
    // Get the initial row count (1 header + 4 data rows = 5)
    const initialRows = screen.getAllByRole("row");
    const initialCount = initialRows.length;
    
    // Wrap all events that trigger state updates in act(...)
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Employee Name"), { target: { value: "Test Employee" } });
      fireEvent.change(screen.getByPlaceholderText("Employee Address"), { target: { value: "123 Test St" } });
      fireEvent.change(screen.getByPlaceholderText("Phone Number"), { target: { value: "555-000-1111" } });
      fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
      fireEvent.change(screen.getByPlaceholderText(/Role/i), { target: { value: "tester" } });
      fireEvent.change(screen.getByPlaceholderText("Number of Absences"), { target: { value: "0" } });
      
      fireEvent.click(screen.getByRole("button", { name: /Add Employee/i }));
    });
    
    // Verify the new employee appears in the table
    expect(screen.getByText("Test Employee")).toBeInTheDocument();
    
    // Verify the table row count increased by 1
    const newRows = screen.getAllByRole("row");
    expect(newRows.length).toBe(initialCount + 1);
  });
});
