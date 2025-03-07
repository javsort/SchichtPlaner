import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShiftApprovalCalendar from "../../pages/admin/ShiftApprovalCalendar";



import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { fetchShifts, approveShift } from "../../services/api";


// Mock API service
jest.mock("../../services/api", () => ({
  fetchShifts: jest.fn(),
  approveShift: jest.fn(),
}));

// Sample shift data
const mockShifts = [
  {
    id: 1,
    employeeId: 101,
    proposedTitle: "Test Shift",
    proposedStartTime: "2025-02-25T08:00:00",
    proposedEndTime: "2025-02-25T12:00:00",
    status: "PROPOSED",
  },
];

describe("ShiftApprovalCalendar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // ✅ Ensure mocks are reset before each test
    fetchShifts.mockResolvedValueOnce(mockShifts); // ✅ Simulate API response
  });

  test("renders pending shift requests", async () => {
    render(
      <MemoryRouter>
        <ShiftApprovalCalendar />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Shift")).toBeInTheDocument();
      expect(screen.getByText("Employee 101")).toBeInTheDocument();
    });
  });

  test("approves a shift request", async () => {
    approveShift.mockResolvedValueOnce({
      id: 1,
      employeeId: 101,
      proposedTitle: "Test Shift",
      proposedStartTime: "2025-02-25T08:00:00",
      proposedEndTime: "2025-02-25T12:00:00",
      status: "ACCEPTED",
    });

    render(
      <MemoryRouter>
        <ShiftApprovalCalendar />
      </MemoryRouter>
    );

    const approveButton = await screen.findByRole("button", { name: /Approve/i });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(screen.getByText("Shift 1 approved successfully")).toBeInTheDocument();
    });

    
    expect(approveShift).toHaveBeenCalledWith(1);
  });
});
