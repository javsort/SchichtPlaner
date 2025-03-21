// src/pages/admin/RoleManagement.tsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  getRoles,
  updateRole,
  createRole,
  deleteRole,
} from "../../Services/api.ts";
import "./RoleManagement.css";

const RoleManagement: React.FC = () => {
  const { t } = useTranslation();

  // Translated Permission Descriptions (INSIDE COMPONENT)
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

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const rolesData = await getRoles();
    setRoles(rolesData);
  };

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
    alert(t("permissionsUpdated", "Permissions updated successfully!"));
    fetchRoles();
  };

  // Create a new role
  const handleCreateRole = async () => {
    if (!roleName.trim()) return alert(t("validRoleNameError", "Enter a valid role name."));
    await createRole({ name: roleName, permissions });
    setRoleName("");
    setPermissions([]);
    fetchRoles();
  };

  // Delete selected role
  const handleDeleteRole = async () => {
    if (!selectedRole || !window.confirm(t("confirmDeleteRole", "Are you sure you want to delete this role?"))) return;
    await deleteRole(selectedRole);
    fetchRoles();
    setSelectedRole(null);
    setRoleName("");
    setPermissions([]);
  };

  // Simple info icon for tooltips
  const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#4da8d6" strokeWidth="1" />
      <path fill="#000000" d="M7.5 12h1V7h-1v5zm0-6h1V5h-1v1z" />
    </svg>
  );

  return (
    <div className="role-management-container">
      <h2>{t("Role Management", "Role Management")}</h2>

      {/* Role Selection or Create New */}
      <div className="role-selection">
        <label>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="select-role-tooltip" className="custom-tooltip">
                {t("selectRoleTooltip", "Select a role from the list or create a new one.")}
              </Tooltip>
            }
          >
            <span className="tooltip-icon">
              <InfoIcon />
            </span>
          </OverlayTrigger>
          {t("selectRole", "Select Role:")}
        </label>
        <select onChange={(e) => handleRoleChange(e.target.value)} value={selectedRole ?? "new"}>
          <option value="new" data-test-id="new-role-input">
            {t("createRole", "-- Create New Role --")}
          </option>
          {roles.map((role) => (
            <option key={role.id} value={role.id} data-test-id={`role-${role.name}-select`}>
              {role.name}
            </option>
          ))}
        </select>
        {selectedRole && (
          <button
            className="delete-btn"
            onClick={handleDeleteRole}
            data-test-id="delete-role-button"
          >
            {t("deleteRole", "Delete Role")}
          </button>
        )}
      </div>

      {/* Role Name Input */}
      <div className="role-name-container">
        <label>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="role-name-tooltip" className="custom-tooltip">
                {t("roleNameTooltip", "Enter a unique role name.")}
              </Tooltip>
            }
          >
            <span className="tooltip-icon">
              <InfoIcon />
            </span>
          </OverlayTrigger>
          {t("roleName", "Role Name:")}
        </label>
        <input
          type="text"
          placeholder={t("enterRoleName", "Enter role name")}
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          data-test-id="role-name-input"
        />
      </div>

      {/* Permissions Table */}
      <div className="permissions-container">
        <h3>{t("permissionsTitle", "Permissions")}</h3>
        <table className="permissions-table">
          <thead>
            <tr>
              <th>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="permission-tooltip" className="custom-tooltip">
                      {t("permissionTooltip", "Permission identifier.")}
                    </Tooltip>
                  }
                >
                  <span className="tooltip-icon">
                    <InfoIcon />
                  </span>
                </OverlayTrigger>
                {t("permissionHeader", "Permission")}
              </th>
              <th>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="description-tooltip" className="custom-tooltip">
                      {t("descriptionTooltip", "Permission description.")}
                    </Tooltip>
                  }
                >
                  <span className="tooltip-icon">
                    <InfoIcon />
                  </span>
                </OverlayTrigger>
                {t("descriptionHeader", "Description")}
              </th>
              <th>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="enabled-tooltip" className="custom-tooltip">
                      {t("enabledTooltip", "Toggle permission on or off.")}
                    </Tooltip>
                  }
                >
                  <span className="tooltip-icon">
                    <InfoIcon />
                  </span>
                </OverlayTrigger>
                {t("enabledHeader", "Enabled")}
              </th>
            </tr>
          </thead>
          <tbody>
            {ALL_PERMISSIONS.map((permission) => (
              <tr key={permission}>
                <td>{t(permission, permission)}</td>
                <td>{PERMISSION_DESCRIPTIONS[permission]}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    data-test-id={`permission-checkbox-${permission}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-container">
          {selectedRole === null ? (
            <button
              className="create-btn"
              onClick={handleCreateRole}
              data-test-id="create-role-button"
            >
              {t("createRole", "Create Role")}
            </button>
          ) : (
            <button
              className="save-btn"
              onClick={handleUpdatePermissions}
              data-test-id="save-changes-button"
            >
              {t("saveChanges", "Save Changes")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
