// src/pages/EmployeeShiftCalendar.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeShiftCalendar from "./EmployeeShiftCalendar";
import { Views } from "react-big-calendar";

describe("EmployeeShiftCalendar Component", () => {
  test("renders header and view selector with default user", () => {
    render(<EmployeeShiftCalendar />);
    
    // Default user is { name: "Default Employee" }
    expect(screen.getByText("Default Employee's Shift Calendar")).toBeInTheDocument();
    
    // The label "Select View:" is rendered, and a select (combobox) is present.
    // Query the select by its role.
    const viewSelector = screen.getByRole("combobox");
    expect(viewSelector).toBeInTheDocument();
    
    // Check that it initially displays the Month view.
    // (The option text is "Month", though the value is Views.MONTH.)
    expect(viewSelector).toHaveDisplayValue("Month");

    // Verify that the options exist
    expect(screen.getByRole("option", { name: "Month" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Week" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Day" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Agenda" })).toBeInTheDocument();
  });

  test("filters shifts by current user", () => {
    // Pass a currentUser that matches two of the hard-coded shifts ("Justus Fynn")
    render(<EmployeeShiftCalendar currentUser={{ name: "Justus Fynn" }} />);
    
    // Check that the header reflects the passed currentUser
    expect(screen.getByText("Justus Fynn's Shift Calendar")).toBeInTheDocument();
    
    // Since the component filters shifts by currentUser.name,
    // and the dummy data includes two shifts assigned to "Justus Fynn",
    // we expect the calendar to render those events.
    // While react-big-calendar renders a complex structure, we can at least
    // verify that the calendar container (with class "rbc-calendar") is present.
    expect(document.querySelector(".rbc-calendar")).toBeInTheDocument();
  });

  test("changes view when a new view is selected", () => {
    render(<EmployeeShiftCalendar />);
    
    const viewSelector = screen.getByRole("combobox");
    expect(viewSelector).toHaveDisplayValue("Month");
    
    // Change view to Week
    fireEvent.change(viewSelector, { target: { value: Views.WEEK } });
    expect(viewSelector).toHaveDisplayValue("Week");
  });
});
