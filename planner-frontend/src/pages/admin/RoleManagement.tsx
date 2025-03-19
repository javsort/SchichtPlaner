import React, { useEffect, useState } from "react";
import {
  getRoles,
  updateRole,
  createRole,
  deleteRole,
} from "../../Services/api.ts";
import "./RoleManagement.css";

const PERMISSION_DESCRIPTIONS: { [key: string]: string } = {
  ROLE_MANAGEMENT: "Manage roles and permissions.",
  EMPLOYEE_MANAGEMENT: "Manage employee details and assignments.",
  EMPLOYEE_DELETE: "Delete employees from the system.",
  SHIFT_MANAGEMENT: "Manage shifts and schedules.",
  PROPOSAL_APPROVAL: "Approve or reject shift proposals.",
  SWAP_APPROVAL: "Approve or reject shift swap requests.",
  SHIFT_PROPOSAL: "Propose shift swaps.",
  SWAP_PROPOSAL: "Request shift swaps.",
  CALENDAR_VIEW: "View shift calendar.",
};

const ALL_PERMISSIONS = Object.keys(PERMISSION_DESCRIPTIONS);

const RoleManagement: React.FC = () => {
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

  // Handle role selection OR start new role creation
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
    alert("Permissions updated successfully!");
    fetchRoles();
  };

  // Create a new role
  const handleCreateRole = async () => {
    if (!roleName.trim()) return alert("Enter a valid role name.");
    await createRole({ name: roleName, permissions });
    setRoleName("");
    setPermissions([]);
    fetchRoles();
  };

  // Delete selected role
  const handleDeleteRole = async () => {
    if (!selectedRole || !window.confirm("Are you sure you want to delete this role?")) return;
    await deleteRole(selectedRole);
    fetchRoles();
    setSelectedRole(null);
    setRoleName("");
    setPermissions([]);
  };

  return (
    <div className="role-management-container">
      <h2>Role Management</h2>

      {/* Role Selection or Create New */}
      <div className="role-selection">
        <label>Select Role:</label>
        <select onChange={(e) => handleRoleChange(e.target.value)} value={selectedRole ?? "new"}>
          <option value="new" data-test-id="new-role-input">-- Create New Role --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id} data-test-id={`role-${role.name}-select`}>
              {role.name}
            </option>
          ))}
        </select>
        {selectedRole && (
          <button className="delete-btn" onClick={handleDeleteRole} data-test-id="delete-role-button">
            Delete Role
          </button>
        )}
      </div>

      {/* Role Name Input */}
      <div className="role-name-container">
        <label>Role Name:</label>
        <input
          type="text"
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          data-test-id="role-name-input"
        />
      </div>

      {/* Permissions Table */}
      <div className="permissions-container">
        <h3>Permissions</h3>
        <table className="permissions-table">
          <thead>
            <tr>
              <th>Permission</th>
              <th>Description</th>
              <th>Enabled</th>
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
                    data-test-id={`permission-checkbox-${permission}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-container">
        {selectedRole === null ? (
            <button className="create-btn" onClick={handleCreateRole} data-test-id="create-role-button">
            Create Role
            </button>
        ) : (
            <button className="save-btn" onClick={handleUpdatePermissions} data-test-id="save-changes-button">
            Save Changes
            </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
