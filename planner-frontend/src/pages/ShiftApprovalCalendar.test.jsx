// src/pages/AdminDashboard.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminDashboard from "./AdminDashboard";
import { MemoryRouter } from "react-router-dom";

// Create a mock for useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  test("renders sidebar, header, and overview cards", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Sidebar navigation items
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Employee Management/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Shift Management/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Company Shift Calendar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Shift Approval/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Shift Availability/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Shift Swap Management/i })).toBeInTheDocument();

    // Header
    expect(screen.getByRole("heading", { name: /Administrator Dashboard/i })).toBeInTheDocument();

    // Overview cards: Assume they are rendered as <h3> elements
    const overviewHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(overviewHeadings.length).toBeGreaterThan(0);
    
    // Verify one of the overview cards—for example, Employee Management—is rendered
    const empManagementCard = overviewHeadings.find((heading) =>
      heading.textContent?.includes("Employee Management")
    );
    expect(empManagementCard).toBeDefined();
  });

  test("navigates when clicking on an overview card", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Find the overview card heading that includes "Shift Swap Management"
    const overviewHeadings = screen.getAllByRole("heading", { level: 3 });
    const swapCardHeading = overviewHeadings.find((heading) =>
      heading.textContent?.includes("Shift Swap Management")
    );
    expect(swapCardHeading).toBeDefined();

    // Assume the clickable container is the element with the class "overview-card"
    const clickableCard = swapCardHeading?.closest(".overview-card");
    expect(clickableCard).toBeInTheDocument();

    if (clickableCard) {
      fireEvent.click(clickableCard);
    }

    // Verify that navigate was called with the expected route.
    // According to the component, clicking this card should navigate to "/shift-swap-admin"
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/shift-swap-admin");
  });
});
