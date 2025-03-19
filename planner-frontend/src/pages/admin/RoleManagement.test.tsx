import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import RoleManagement from "./RoleManagement.tsx";
import { getRoles, updateRole, createRole, deleteRole } from "../../Services/api.ts";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n.ts";

jest.mock("../../Services/api", () => ({
  getRoles: jest.fn(),
  updateRole: jest.fn(),
  createRole: jest.fn(),
  deleteRole: jest.fn(),
}));

const mockedGetRoles = getRoles as jest.Mock;
const mockedUpdateRole = updateRole as jest.Mock;
const mockedCreateRole = createRole as jest.Mock;
const mockedDeleteRole = deleteRole as jest.Mock;

describe("RoleManagement Component", () => {
  beforeEach(() => {
    mockedGetRoles.mockReset();
    mockedUpdateRole.mockReset();
    mockedCreateRole.mockReset();
    mockedDeleteRole.mockReset();
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "confirm").mockImplementation(() => true);
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <I18nextProvider i18n={i18n}>
          <RoleManagement />
        </I18nextProvider>
      );
    });
  };

  it("renders the RoleManagement component", async () => {
    mockedGetRoles.mockResolvedValue([
      { id: 1, name: "Admin", permissions: ["ROLE_MANAGEMENT"] },
    ]);

    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByLabelText(/Select Role/i)).toBeInTheDocument();
    });
  });

  it("creates a new role", async () => {
    mockedGetRoles.mockResolvedValue([]);
    mockedCreateRole.mockResolvedValue({ id: 2, name: "Manager", permissions: [] });

    await renderComponent();

    const roleNameInput = screen.getByPlaceholderText(/Enter role name/i);
    fireEvent.change(roleNameInput, { target: { value: "Manager" } });

    // Update the query to match the rendered accessible name ("Create New Role")
    const createButton = screen.getByRole("button", { name: /Create New Role/i });
    fireEvent.click(createButton);

    await waitFor(() =>
      expect(mockedCreateRole).toHaveBeenCalledWith({ name: "Manager", permissions: [] })
    );
  });

  it("updates permissions for an existing role", async () => {
    mockedGetRoles.mockResolvedValue([
      { id: 1, name: "Admin", permissions: [] },
    ]);
    mockedUpdateRole.mockResolvedValue({});

    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    const roleSelect = screen.getByLabelText(/Select Role/i);
    fireEvent.change(roleSelect, { target: { value: "1" } });

    // When there are multiple checkboxes, use getAllByRole
    const checkboxes = screen.getAllByRole("checkbox");
    // Toggle the first checkbox (adjust index if needed)
    fireEvent.click(checkboxes[0]);

    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(mockedUpdateRole).toHaveBeenCalledWith(1, expect.arrayContaining([expect.any(String)]))
    );
  });

  it("deletes a role", async () => {
    mockedGetRoles.mockResolvedValue([
      { id: 1, name: "Admin", permissions: [] },
    ]);
    mockedDeleteRole.mockResolvedValue({});

    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    const roleSelect = screen.getByLabelText(/Select Role/i);
    fireEvent.change(roleSelect, { target: { value: "1" } });

    const deleteButton = screen.getByRole("button", { name: /Delete Role/i });
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(mockedDeleteRole).toHaveBeenCalledWith(1)
    );
  });
});
