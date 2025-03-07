import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShiftAvailability from "@/pages/ShiftAvailability.tsx";


import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// Mock API service
jest.mock("@/services/api", () => ({
  fetchShifts: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        employeeId: 101,
        title: "Morning Shift",import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShiftAvailability from "@/pages/ShiftAvailability.tsx";

import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// Mock API service
jest.mock("@/services/api", () => ({
  fetchShifts: jest.fn(() =>
    Promise.resolve([
      {
        id: 1,
        employeeId: 101,
        title: "Morning Shift",
        startTime: "2025-02-26T08:00:00",
        endTime: "2025-02-26T12:00:00",
        available: true,
      },
      {
        id: 2,
        employeeId: 102,
        title: "Afternoon Shift",
        startTime: "2025-02-26T14:00:00",
        endTime: "2025-02-26T18:00:00",
        available: false,
      },
    ])
  ),
  bookShift: jest.fn((shiftId) =>
    Promise.resolve({
      id: shiftId,
      status: "BOOKED",
    })
  ),
}));

describe("ShiftAvailability Component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ShiftAvailability />
      </MemoryRouter>
    );
  });

  test("renders the component correctly", async () => {
    await waitFor(() => {
      expect(screen.getByText("Shift Availability")).toBeInTheDocument();
    });

    expect(screen.getByText("Morning Shift")).toBeInTheDocument();
    expect(screen.getByText("Afternoon Shift")).toBeInTheDocument();
  });

  test("allows a user to book an available shift", async () => {
    // Wait for shifts to load
    await waitFor(() => {
      expect(screen.getByText("Morning Shift")).toBeInTheDocument();
    });

    const bookButton = screen.getByRole("button", { name: /Book Morning Shift/i });

    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText("Shift booked successfully")).toBeInTheDocument();
    });
  });

  test("disables booking for unavailable shifts", async () => {
    await waitFor(() => {
      expect(screen.getByText("Afternoon Shift")).toBeInTheDocument();
    });

    const bookButton = screen.getByRole("button", { name: /Book Afternoon Shift/i });
    expect(bookButton).toBeDisabled();
  });

  test("renders error message when booking fails", async () => {
    jest.mock("@/services/api", () => ({
      fetchShifts: jest.fn(() =>
        Promise.resolve([
          {
            id: 1,
            employeeId: 101,
            title: "Morning Shift",
            startTime: "2025-02-26T08:00:00",
            endTime: "2025-02-26T12:00:00",
            available: true,
          },
          {
            id: 2,
            employeeId: 102,
            title: "Afternoon Shift",
            startTime: "2025-02-26T14:00:00",
            endTime: "2025-02-26T18:00:00",
            available: false,
          },
        ])
      ),
      bookShift: jest.fn((shiftId) =>
        Promise.reject({
          message: "Booking failed",
        })
      ),
    }));

    await waitFor(() => {
      expect(screen.getByText("Morning Shift")).toBeInTheDocument();
    });

    const bookButton = screen.getByRole("button", { name: /Book Morning Shift/i });

    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText("Booking failed")).toBeInTheDocument();
    });
  });
});
        startTime: "2025-02-26T08:00:00",
        endTime: "2025-02-26T12:00:00",
        available: true,
      },
      {
        id: 2,
        employeeId: 102,
        title: "Afternoon Shift",
        startTime: "2025-02-26T14:00:00",
        endTime: "2025-02-26T18:00:00",
        available: false,
      },
    ])
  ),
  bookShift: jest.fn((shiftId) =>
    Promise.resolve({
      id: shiftId,
      status: "BOOKED",
    })
  ),
}));

describe("ShiftAvailability Component", () => {
  test("renders the component correctly", async () => {
    render(
      <MemoryRouter>
        <ShiftAvailability />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Shift Availability")).toBeInTheDocument();
    });

    expect(screen.getByText("Morning Shift")).toBeInTheDocument();
    expect(screen.getByText("Afternoon Shift")).toBeInTheDocument();
  });

  test("allows a user to book an available shift", async () => {
    render(
      <MemoryRouter>
        <ShiftAvailability />
      </MemoryRouter>
    );

    // Wait for shifts to load
    await waitFor(() => {
      expect(screen.getByText("Morning Shift")).toBeInTheDocument();
    });

    const bookButton = screen.getByRole("button", { name: /Book Morning Shift/i });

    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText("Shift booked successfully")).toBeInTheDocument();
    });
  });

  test("disables booking for unavailable shifts", async () => {
    render(
      <MemoryRouter>
        <ShiftAvailability />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Afternoon Shift")).toBeInTheDocument();
    });

    const bookButton = screen.getByRole("button", { name: /Book Afternoon Shift/i });
    expect(bookButton).toBeDisabled();
  });
});
