// src/pages/AdminDashboard.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

// Mock useNavigate from react-router-dom
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

    // Check header text
    expect(screen.getByText(/Administrator Dashboard/i)).toBeInTheDocument();

    // Fix sidebar links (use `link` instead of `button`)
    expect(screen.getByRole("link", { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Employee Management/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shifts Management/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shift Approval/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Company Shift Calendar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shift Swap Management/i })).toBeInTheDocument();

    // Overview section (h3 headings)
    const overviewHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(overviewHeadings.length).toBeGreaterThan(0);

    // Check if "Employee Management" exists in overview cards
    const empCard = overviewHeadings.find((heading) =>
      heading.textContent?.includes("Employee Management")
    );
    expect(empCard).toBeDefined();
  });

  test("navigates when clicking on an overview card", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Find "Shift Swap Management" card
    const overviewHeadings = screen.getAllByRole("heading", { level: 3 });
    const swapCardHeading = overviewHeadings.find((heading) =>
      heading.textContent?.includes("Shift Swap Management")
    );
    expect(swapCardHeading).toBeDefined();

    // Get the clickable container (closest overview-card div)
    const clickableCard = swapCardHeading?.closest(".overview-card");
    expect(clickableCard).toBeInTheDocument();

    // Simulate click event
    if (clickableCard) {
      fireEvent.click(clickableCard);
    }

    // Verify navigation was triggered
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/shift-swap-admin");
  });
});
