// src/pages/TechnicianDashboard.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TechnicianDashboard from "./TechnicianDashboard";
import { MemoryRouter } from "react-router-dom";

// Create a mock for useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("TechnicianDashboard Component", () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  test("renders sidebar and overview cards", () => {
    render(
      <MemoryRouter>
        <TechnicianDashboard />
      </MemoryRouter>
    );

    // Check that sidebar title and buttons are rendered
    expect(screen.getByText("Technician Panel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Company Shift Calendar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "My Shifts" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shift Availability" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shift Swap Requests" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();

    // Check that the header is rendered
    expect(screen.getByRole("heading", { name: "Technician Dashboard" })).toBeInTheDocument();

    // Check that at least one overview card heading is rendered
    // Here, we specifically check for an <h3> element with "Company Shift Calendar"
    const cardHeadings = screen.getAllByRole("heading", { level: 3, name: /Company Shift Calendar/i });
    expect(cardHeadings.length).toBeGreaterThan(0);
  });

  test("navigates when clicking on an overview card", () => {
    render(
      <MemoryRouter>
        <TechnicianDashboard />
      </MemoryRouter>
    );

    // Retrieve all overview card headings (they're rendered as <h3> elements)
    const cardHeadings = screen.getAllByRole("heading", { level: 3 });
    // Find the overview card heading that includes "Shift Swap Requests"
    const shiftSwapHeading = cardHeadings.find((heading) =>
      heading.textContent?.includes("Shift Swap Requests")
    );
    expect(shiftSwapHeading).toBeDefined();

    // Assuming the clickable area is the card container,
    // get its closest container with class "technician-card"
    const clickableCard = shiftSwapHeading?.closest(".technician-card");
    expect(clickableCard).toBeInTheDocument();

    if (clickableCard) {
      fireEvent.click(clickableCard);
    }

    // Verify that navigate was called with the expected route
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/shift-swap");
  });
});


