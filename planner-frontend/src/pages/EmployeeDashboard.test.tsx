// src/pages/EmployeeDashboard.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmployeeDashboard from "./EmployeeDashboard";
import { MemoryRouter } from "react-router-dom";

// Create a mock for useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("EmployeeDashboard Component", () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  test("renders sidebar, header, and overview cards", () => {
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    // Check sidebar
    expect(screen.getByText("Employee Panel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Company Shift Calendar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "My Shifts" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shift Availability" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shift Swap Requests" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();

    // Check header
    expect(screen.getByRole("heading", { name: "Employee Dashboard" })).toBeInTheDocument();

    // Check overview cards are rendered (assume they are rendered as <h3> elements)
    const cardHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(cardHeadings.length).toBeGreaterThan(0);

    // Verify that one of the overview cards contains the expected title, e.g. "Company Shift Calendar"
    const calendarCards = cardHeadings.filter((heading) =>
      heading.textContent?.includes("Company Shift Calendar")
    );
    expect(calendarCards.length).toBeGreaterThan(0);
  });

  test("navigates when clicking on an overview card", () => {
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    // Find the overview card heading that includes "Shift Swap Requests"
    const cardHeadings = screen.getAllByRole("heading", { level: 3 });
    const swapHeading = cardHeadings.find((heading) =>
      heading.textContent?.includes("Shift Swap Requests")
    );
    expect(swapHeading).toBeDefined();

    // Assume the clickable container is the element with the class "employee-card"
    const clickableCard = swapHeading?.closest(".employee-card");
    expect(clickableCard).toBeInTheDocument();

    if (clickableCard) {
      fireEvent.click(clickableCard);
    }

    // Verify that useNavigate was called with the expected route ("/shift-swap")
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/shift-swap");
  });
});
