import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // for custom matchers
import CompanyShiftCalendar from "./code/CompanyShiftCalendar";



// Mock SideBar (if needed)
jest.mock("../components/SideBar.tsx", () => () => <div>SideBar Component</div>);

describe("CompanyShiftCalendar", () => {
  test("renders header, import/export buttons and filter buttons", () => {
    render(<CompanyShiftCalendar />);
    expect(screen.getByText("Company Shift Calendar")).toBeInTheDocument();
    // ... other assertions
  });
});describe("CompanyShiftCalendar", () => {
  it("renders header, import/export buttons and filter buttons", () => {
    render(<CompanyShiftCalendar />);
    expect(screen.getByText("Company Shift Calendar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
  });
});
