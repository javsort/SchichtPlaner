import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ShiftSwapAdmin from "../../pages/admin/ShiftSwapAdmin";
import {
  fetchAllSwapProposals,
  fetchShifts,
  getAllUsers,
  declineSwapProposal,
} from "../../Services/api";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

// Dummy proposal with a candidate (for Reject and Toolbar tests).
const dummyProposal = {
  id: 201,
  employeeId: 1,
  currentShiftId: 1,
  proposedTitle: "Some Shift",
  proposedStartTime: new Date().toISOString(),
  proposedEndTime: new Date().toISOString(),
  targetEmployee: { id: 2, name: "Bob" },
  message: "Swap request",
  status: "PROPOSED",
};

// Dummy proposal with no candidate (to test disabled Accept button).
const dummyProposalNoCandidate = {
  id: 202,
  employeeId: 1,
  currentShiftId: 1,
  proposedTitle: "Non Matching Title", // Use a title that yields no candidate
  proposedStartTime: new Date().toISOString(),
  proposedEndTime: new Date().toISOString(),
  targetEmployee: undefined,
  message: "Swap request",
  status: "PROPOSED",
};

const dummyShifts = [
  {
    id: 1,
    title: "Shift A",
    start: new Date(),
    end: new Date(),
    employeeId: 1,
    shiftOwner: "Alice",
    role: "Technician",
  },
];

const dummyUsers = [
  { id: 1, username: "Alice" },
  { id: 2, username: "Bob" },
];

// Mock the API service functions
jest.mock("../../Services/api", () => ({
  fetchAllSwapProposals: jest.fn(),
  fetchShifts: jest.fn(),
  getAllUsers: jest.fn(),
  declineSwapProposal: jest.fn(),
}));

describe("ShiftSwapAdmin component - Other functionality", () => {
  // Helper to render the component
  const renderComponent = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <ShiftSwapAdmin />
      </I18nextProvider>
    );

  describe("Reject functionality and calendar toolbar", () => {
    beforeEach(() => {
      // Return our dummy proposal (with a candidate), shifts, and users
      (fetchAllSwapProposals as jest.Mock).mockResolvedValue([dummyProposal]);
      (fetchShifts as jest.Mock).mockResolvedValue(dummyShifts);
      (getAllUsers as jest.Mock).mockResolvedValue(dummyUsers);
    });

    test("calls declineSwapProposal when Reject button is clicked", async () => {
      // Override window.prompt to simulate a manager comment
      const promptSpy = jest.spyOn(window, "prompt").mockImplementation(() => "Not available");

      renderComponent();

      // Wait for the proposal to load (it should display "Req #201")
      await waitFor(() => {
        expect(screen.getByText(/Req #201/i)).toBeInTheDocument();
      });

      // Find and click the Reject button
      const rejectButton = screen.getByRole("button", { name: /Reject/i });
      fireEvent.click(rejectButton);

      // Wait for declineSwapProposal to be called with the proposal id and comment
      await waitFor(() => {
        expect(declineSwapProposal).toHaveBeenCalledWith("201", "Not available");
      });

      promptSpy.mockRestore();
    });

    test("renders calendar toolbar buttons", async () => {
      renderComponent();

      // Wait until the toolbar buttons are rendered
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Today/i })).toBeInTheDocument();
      });

      // Verify that the toolbar contains the expected buttons
      expect(screen.getByRole("button", { name: /Today/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Back/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Month/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Week/i })).toBeInTheDocument();

      // IMPORTANT CHANGE: Anchor the regex to avoid matching "Today"
      expect(screen.getByRole("button", { name: /^Day$/i })).toBeInTheDocument();

      expect(screen.getByRole("button", { name: /Agenda/i })).toBeInTheDocument();
    });
  });

  describe("Accept button disabled when no candidate is selected", () => {
    beforeEach(() => {
      // Return a proposal with no candidate
      (fetchAllSwapProposals as jest.Mock).mockResolvedValue([dummyProposalNoCandidate]);
      (fetchShifts as jest.Mock).mockResolvedValue(dummyShifts);
      (getAllUsers as jest.Mock).mockResolvedValue(dummyUsers);
    });

    test("Accept button is disabled when no candidate is selected", async () => {
      renderComponent();

      // Wait for the proposal with id 202 to load
      await waitFor(() => {
        expect(screen.getByText(/Req #202/i)).toBeInTheDocument();
      });

      // Find the Approve button (assuming the text "Approve" is used)
      const approveButton = screen.getByRole("button", { name: /Approve/i });
      expect(approveButton).toBeDisabled();
    });
  });
});
