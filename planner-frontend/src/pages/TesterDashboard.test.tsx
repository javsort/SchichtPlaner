// src/pages/TesterDashboard.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TesterDashboard from "./TesterDashboard";
import { MemoryRouter } from "react-router-dom";

// Create a mock for useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("TesterDashboard Component", () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  test("renders sidebar and overview cards", () => {
    render(
      <MemoryRouter>
        <TesterDashboard />
      </MemoryRouter>
    );

    // Sidebar checks
    expect(screen.getByText("Tester Panel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Company Shift Calendar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "My Shifts" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shift Availability" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Shift Swap Requests" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();

    // Header check
    expect(screen.getByRole("heading", { name: "Tester Dashboard" })).toBeInTheDocument();

    // Overview cards: Assuming card titles are rendered as <h3> elements
    const cardHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(cardHeadings.length).toBeGreaterThan(0);

    // Verify one of the overview card headings (e.g. "Company Shift Calendar") is rendered
    const calendarCards = cardHeadings.filter((heading) =>
      heading.textContent?.includes("Company Shift Calendar")
    );
    expect(calendarCards.length).toBeGreaterThan(0);
  });

  test("navigates when clicking on an overview card", () => {
    render(
      <MemoryRouter>
        <TesterDashboard />
      </MemoryRouter>
    );

    // Find the overview card heading that includes "Shift Swap Requests"
    const cardHeadings = screen.getAllByRole("heading", { level: 3 });
    const swapHeading = cardHeadings.find((heading) =>
      heading.textContent?.includes("Shift Swap Requests")
    );
    expect(swapHeading).toBeDefined();

    // Assume the clickable area is the card container with class "tester-card"
    const clickableCard = swapHeading?.closest(".tester-card");
    expect(clickableCard).toBeInTheDocument();

    if (clickableCard) {
      fireEvent.click(clickableCard);
    }

    // Verify that useNavigate was called with the expected route ("/shift-swap")
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/shift-swap");
  });
});
