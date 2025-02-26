// src/components/ShiftAvailability.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShiftAvailability from "./ShiftAvailability";
import { proposeShift } from "./code/api";

// Mock the proposeShift API function.
jest.mock("./code/api", () => ({
  proposeShift: jest.fn(() => Promise.resolve()),
}));

describe("ShiftAvailability Component", () => {
  test("renders header, month/year selectors, table, and save button", () => {
    render(<ShiftAvailability />);
    
    // Verify header text.
    expect(screen.getByText("Shift Availability")).toBeInTheDocument();
    
    // Verify the month and year selectors are rendered.
    expect(screen.getByText("Month:")).toBeInTheDocument();
    expect(screen.getByText("Year:")).toBeInTheDocument();
    
    // Verify the table is rendered.
    const table = document.querySelector(".shift-table");
    expect(table).toBeInTheDocument();
    
    // Verify the Save button is rendered.
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
  });

  test("updates availability and calls proposeShift on save", async () => {
    render(<ShiftAvailability />);
    
    // Select the first row from the table body.
    const firstRow = document.querySelector(".shift-table tbody tr");
    expect(firstRow).toBeInTheDocument();
    
    // Within the first row, there should be two <select> elements for "from" and "to".
    const selects = firstRow?.querySelectorAll("select");
    expect(selects?.length).toBe(2);
    
    // Change the "from" and "to" values.
    // (Use time options that are available in the component, e.g. "09:00" and "17:00")
    fireEvent.change(selects![0], { target: { value: "09:00" } });
    fireEvent.change(selects![1], { target: { value: "17:00" } });
    
    // Spy on window.alert so that it doesn't actually show.
    jest.spyOn(window, "alert").mockImplementation(() => {});
    
    // Click the Save button.
    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);
    
    // Wait for proposeShift to be called.
    await waitFor(() => {
      expect(proposeShift).toHaveBeenCalled();
    });
    
    // Optionally, verify that the API is called with the expected parameters.
    // From the component: employeeId = 3, proposedTitle = "Test Shift II", status = "PROPOSED".
    const firstCall = (proposeShift as jest.Mock).mock.calls[0];
    expect(firstCall[0]).toBe(3);
    expect(firstCall[1]).toBe("Test Shift II");
    expect(firstCall[4]).toBe("PROPOSED");
    
    // Verify that the alert was shown.
    expect(window.alert).toHaveBeenCalledWith("Availability saved! Check console for details.");
  });
});
