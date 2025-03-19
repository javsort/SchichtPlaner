import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getRoles,
  updateRole,
  createRole,
  deleteRole,
} from "../../Services/api.ts";
import "./RoleManagement.css";

const RoleManagement: React.FC = () => {
  const { t } = useTranslation();

  const PERMISSION_DESCRIPTIONS: { [key: string]: string } = {
    ROLE_MANAGEMENT: t("ROLE_MANAGEMENT_DESC", "Manage roles and permissions."),
    EMPLOYEE_MANAGEMENT: t("EMPLOYEE_MANAGEMENT_DESC", "Manage employee details and assignments."),
    EMPLOYEE_DELETE: t("EMPLOYEE_DELETE_DESC", "Delete employees from the system."),
    SHIFT_MANAGEMENT: t("SHIFT_MANAGEMENT_DESC", "Manage shifts and schedules."),
    PROPOSAL_APPROVAL: t("PROPOSAL_APPROVAL_DESC", "Approve or reject shift proposals."),
    SWAP_APPROVAL: t("SWAP_APPROVAL_DESC", "Approve or reject shift swap requests."),
    SHIFT_PROPOSAL: t("SHIFT_PROPOSAL_DESC", "Propose shift swaps."),
    SWAP_PROPOSAL: t("SWAP_PROPOSAL_DESC", "Request shift swaps."),
    CALENDAR_VIEW: t("CALENDAR_VIEW_DESC", "View shift calendar."),
  };

  const ALL_PERMISSIONS = Object.keys(PERMISSION_DESCRIPTIONS);

  const [roles, setRoles] = useState<{ id: number; name: string; permissions: string[] }[]>([]);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);

  // Fetch all roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const rolesData = await getRoles();
    setRoles(rolesData);
  };

  // Handle role selection or start new role creation
  const handleRoleChange = (roleId: string) => {
    if (roleId === "new") {
      setSelectedRole(null);
      setRoleName("");
      setPermissions([]);
    } else {
      const id = Number(roleId);
      setSelectedRole(id);
      const role = roles.find((r) => r.id === id);
      setRoleName(role?.name || "");
      setPermissions(role?.permissions || []);
    }
  };

  // Handle permission toggle
  const togglePermission = (permission: string) => {
    setPermissions((prevPermissions) =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter((p) => p !== permission)
        : [...prevPermissions, permission]
    );
  };

  // Update role permissions
  const handleUpdatePermissions = async () => {
    if (selectedRole === null) return;
    await updateRole(selectedRole, permissions);
    alert(t("permissionsUpdated", "Berechtigungen erfolgreich aktualisiert!"));
    fetchRoles();
  };

  // Create a new role
  const handleCreateRole = async () => {
    if (!roleName.trim())
      return alert(t("validRoleNameError", "Bitte geben Sie einen gültigen Rollennamen ein."));
    await createRole({ name: roleName, permissions });
    setRoleName("");
    setPermissions([]);
    fetchRoles();
  };

  // Delete selected role
  const handleDeleteRole = async () => {
    if (
      !selectedRole ||
      !window.confirm(t("confirmDeleteRole", "Möchten Sie diese Rolle wirklich löschen?"))
    )
      return;
    await deleteRole(selectedRole);
    fetchRoles();
    setSelectedRole(null);
    setRoleName("");
    setPermissions([]);
  };

  return (
    <div className="role-management-container">
      <h2>{t("Role Management", "Rollen und Berechtigungen verwalten")}</h2>

      {/* Role Selection or Create New */}
      <div className="role-selection">
        <label>{t("selectRole", "Rolle auswählen:")}</label>
        <select onChange={(e) => handleRoleChange(e.target.value)} value={selectedRole ?? "new"}>
          <option value="new">{t("createRole", "-- Create New Role --")}</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        {selectedRole && (
          <button className="delete-btn" onClick={handleDeleteRole}>
            {t("deleteRole", "Delete Role")}
          </button>
        )}
      </div>

      {/* Role Name Input */}
      <div className="role-name-container">
        <label>{t("roleName", "Role Name:")}</label>
        <input
          type="text"
          placeholder={t("enterRoleName", "Enter role name")}
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>

      {/* Permissions Table */}
      <div className="permissions-container">
        <h3>{t("permissionsTitle", "Permissions")}</h3>
        <table className="permissions-table">
          <thead>
            <tr>
              <th>{t("permissionHeader", "Permission")}</th>
              <th>{t("descriptionHeader", "Description")}</th>
              <th>{t("enabledHeader", "Enabled")}</th>
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map((permission) => (
              <tr key={permission}>
                <td>{permission}</td>
                <td>{PERMISSION_DESCRIPTIONS[permission]}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-container">
          {selectedRole === null ? (
            <button className="create-btn" onClick={handleCreateRole}>
              {t("createRole", "Create Role")}
            </button>
          ) : (
            <button className="save-btn" onClick={handleUpdatePermissions}>
              {t("saveChanges", "Save Changes")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
