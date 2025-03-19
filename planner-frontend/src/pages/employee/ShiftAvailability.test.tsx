import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ShiftAvailability from "./ShiftAvailability";
import {
  proposeShift,
  fetchUserProposalShifts,
  updateShiftProposal,
  deleteShiftProposal,
} from "../../Services/api";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

jest.mock("../../Services/api", () => ({
  proposeShift: jest.fn(),
  fetchUserProposalShifts: jest.fn(),
  updateShiftProposal: jest.fn(),
  deleteShiftProposal: jest.fn(),
}));

const mockedProposeShift = proposeShift as jest.Mock;
const mockedFetchUserProposalShifts = fetchUserProposalShifts as jest.Mock;
const mockedUpdateShiftProposal = updateShiftProposal as jest.Mock;
const mockedDeleteShiftProposal = deleteShiftProposal as jest.Mock;

describe("ShiftAvailability Component", () => {
  beforeEach(() => {
    localStorage.setItem("userId", "123");
    localStorage.setItem("user", JSON.stringify({ userId: "123", role: "Employee" }));
    mockedProposeShift.mockReset();
    mockedFetchUserProposalShifts.mockReset();
    mockedUpdateShiftProposal.mockReset();
    mockedDeleteShiftProposal.mockReset();
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ShiftAvailability />
        </I18nextProvider>
      );
    });
  };

  it("renders the shift availability form and proposals sidebar", async () => {
    mockedFetchUserProposalShifts.mockResolvedValue([]);
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Shift Availability/i)).toBeInTheDocument();
      expect(screen.getByText(/My Shift Proposals/i)).toBeInTheDocument();
    });
  });

  it("saves a new shift proposal", async () => {
    // No proposals initially
    mockedFetchUserProposalShifts.mockResolvedValue([]);
    // Simulate a successful proposal call
    mockedProposeShift.mockResolvedValue({});
    await renderComponent();

    // There are multiple select elements:
    //  - Month selector (index 0)
    //  - Year selector (index 1)
    //  - The "from" select in the table row (index 2)
    //  - The "to" select in the table row (index 3)
    const selects = screen.getAllByRole("combobox");
    // Set the "from" time and the "to" time
    fireEvent.change(selects[2], { target: { value: "09:00" } });
    fireEvent.change(selects[3], { target: { value: "17:00" } });

    // Find the Save button (the one in the ShiftAvailability container)
    const saveButton = screen.getByRole("button", { name: /Save/i });
    fireEvent.click(saveButton);

    // Wait for proposeShift to be called
    await waitFor(() => {
      expect(mockedProposeShift).toHaveBeenCalled();
    });
  });

  it("edits an existing shift proposal", async () => {
    // Provide an initial proposal for editing.
    mockedFetchUserProposalShifts.mockResolvedValue([
      {
        id: 1,
        proposedStartTime: new Date().toISOString(),
        proposedEndTime: new Date().toISOString(),
        status: "PROPOSED",
      },
    ]);
    await renderComponent();

    // Wait for the proposal to appear and find all "Edit" buttons.
    const editButtons = await screen.findAllByRole("button", { name: /Edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);

    // Now in edit mode, assume the "from" select for editing is one of the comboboxes.
    // Adjust the index as needed; here we assume the first combobox in edit mode.
    const editSelects = screen.getAllByRole("combobox");
    // Change the "from" time; adjust index as needed.
    fireEvent.change(editSelects[0], { target: { value: "10:00" } });

    // To specifically pick the Save button for editing, match the exact text "Save"
    // (assuming the edit save button has the text exactly "Save")
    const saveEditButtons = screen.getAllByRole("button", { name: /^Save$/i });
    expect(saveEditButtons.length).toBeGreaterThan(0);
    fireEvent.click(saveEditButtons[0]);

    await waitFor(() => {
      expect(mockedUpdateShiftProposal).toHaveBeenCalled();
    });
  });

  it("deletes an existing shift proposal", async () => {
    mockedFetchUserProposalShifts.mockResolvedValue([
      {
        id: 1,
        proposedStartTime: new Date().toISOString(),
        proposedEndTime: new Date().toISOString(),
        status: "PROPOSED",
      },
    ]);
    mockedDeleteShiftProposal.mockResolvedValue({});
    await renderComponent();

    const deleteButtons = await screen.findAllByRole("button", { name: /Delete/i });
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockedDeleteShiftProposal).toHaveBeenCalled();
    });
  });
});
