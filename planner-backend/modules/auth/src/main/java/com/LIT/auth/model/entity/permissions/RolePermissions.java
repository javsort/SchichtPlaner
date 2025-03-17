package com.LIT.auth.model.entity.permissions;

public enum RolePermissions {
    // Admin
    ROLE_MANAGEMENT,
    EMPLOYEE_MANAGEMENT,
    EMPLOYEE_DELETE,
    SHIFT_MANAGEMENT,
    PROPOSAL_APPROVAL,
    SWAP_APPROVAL,

    // Regular employee permissions
    SHIFT_PROPOSAL,
    SWAP_PROPOSAL,
    CALENDAR_VIEW
}
