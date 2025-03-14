// src/pages/ShiftSupervisorDashboard.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ShiftSupervisorDashboard from "./ShiftSupervisorDashboard";

// Mock the useNavigate hook from react-router-dom
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("ShiftSupervisorDashboard Component", () => {
  beforeEach(() => {
    mockedUsedNavigate.mockReset();
  });

  test("renders sidebar and overview cards", () => {
    render(
      <MemoryRouter>
        <ShiftSupervisorDashboard />
      </MemoryRouter>
    );

    // Sidebar elements (allow duplicates by checking that at least one is present)
    expect(screen.getByText("Shift Supervisor Panel")).toBeInTheDocument();
    expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Employee Management").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shift Management").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Company Shift Calendar").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shift Approval").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shift Availability").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Shift Swap Requests").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Notifications").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Settings").length).toBeGreaterThan(0);
  });

  test("navigates when clicking an overview card", () => {
    render(
      <MemoryRouter>
        <ShiftSupervisorDashboard />
      </MemoryRouter>
    );

    // "Shift Approval" appears both in the sidebar and in the overview section.
    // We assume that the overview card is rendered as a div (not as a button).
    // Therefore, we filter out elements whose tagName is not "BUTTON".
    const allShiftApprovalEls = screen.getAllByText("Shift Approval");
    const overviewCard = allShiftApprovalEls.find(
      (el) => el.tagName !== "BUTTON"
    ) || allShiftApprovalEls[0];

    fireEvent.click(overviewCard);
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/shift-approval");
  });
});
