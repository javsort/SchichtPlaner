// src/Services/api.ts
import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

// Test logicGate
export const testLogicGate = async (): Promise<void> => {
  console.log('Testing logicGate API Endpoint... URL:', `${baseUrl}/api/hello`);
  try {
    const response = await axios.get(`${baseUrl}/api/hello`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Test scheduler
export const testScheduler = async (): Promise<void> => {
  console.log('Testing scheduler API Endpoint... URL:', `${baseUrl}/api/scheduler/assignments/test-jwt`);
  try {
    const response = await axios.get(`${baseUrl}/api/scheduler/assignments/test-jwt`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
  }
};

// Test auth
export const testAuth = async (): Promise<void> => {
  console.log('Testing auth API Endpoint... URL:', `${baseUrl}/api/auth/test-jwt`);
  try {
    const response = await axios.get(`${baseUrl}/api/auth/test-jwt`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
  }
};

/*
 * User management stuff
*/
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      email: email,
      password: password
    });

    const data = await response.data;

    const permissionsArray = data.permissions ? data.permissions.split(",") : [];

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('role', data.role);
    localStorage.setItem('permissions', JSON.stringify(permissionsArray));

    console.log('Logged in successfully! user:', data.email, 'role:', data.role, 'token:', data.token, 'userId:', data.userId, 'permissions:', permissionsArray);

    return { email: data.email, role: data.role, token: data.token, userId: data.userId, permissions: permissionsArray };

  } catch (error) {
    console.error('Error logging in', error);

  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/auth/users`, {
      headers: {
        'Content-Type': 'application/json',
        // Provide a default empty string if no token is found
        'Authorization': localStorage.getItem('token') || ''
      }
    });

    console.log('Users fetched successfully!', response.data);

    return response.data;

  } catch (error) {
    console.error('Error getting all users', error)
  }
}

export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/auth/roles`, {
      headers: {
        'Content-Type': 'application/json',
        // Provide a default empty string if no token is found
        'Authorization': localStorage.getItem('token') || ''
      }
    });

    console.log('Roles fetched successfully!: ', response.data);

    return response.data;

  } catch (error) {
    console.error('Error retrieving roles: ', error)
  }
}

export const createUser = async (user) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/auth/users`, 
      user,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      }
    )

  } catch (error) {
    console.error('Error creating user: ', error)
  }
}

export const updateUser = async (user) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/auth/users/update`, 
      user,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      }
    )

  } catch (error) {
    console.error('Error creating user: ', error)
  }
}

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/auth/users/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      }
    )

  } catch (error) {
    console.error('Error creating user: ', error)
  }
}

/*
 * Shift stuff
*/
export const fetchShifts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/scheduler/shifts`, {
      headers: {
        'Content-Type': 'application/json',
        // Provide a default empty string if no token is found
        'Authorization': localStorage.getItem('token') || ''
      }
    });

    console.log('Shifts fetched successfully', response.data);

    return response.data;

  } catch (error) {
    console.error('Error with the request', error);
    return [];
  }
}

/*
 * Shift proposal stuff
*/
export const proposeShift = async (
  employeeId: number,
  proposedTitle: string,
  proposedStartTime: string,
  proposedEndTime: string,
  status: string
) => {
  try {
    const proposal = {
      employeeId: employeeId,
      proposedTitle: proposedTitle,
      proposedStartTime: proposedStartTime,
      proposedEndTime: proposedEndTime,
      status: status
    }

    const response = await axios.post(
      `${baseUrl}/api/scheduler/shift-proposals/create`,
      proposal,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      }
    );
    console.log('Shift proposed successfully', response.data);
    if (response.status === 200) {
      return true;
    } else {
      console.error('Error proposing shift', response.data);
      return false;
    }
  } catch (error) {
    console.error('Error submitting proposed shift', error);
  }
};

export const fetchUserProposalShifts = async (empId) => {

  console.log('Fetching shifts for user: ', empId);

  try {
    const response = await axios.get(`${baseUrl}/api/scheduler/shift-proposals/employee/${empId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    console.log('Shifts fetched successfully for user: ', empId, "Resp: ", response.data);
    return response.data;

  } catch (error) {
    console.error('Error with the request', error);
    return [];
  }
}

export const updateShiftProposal = async (propId, empId, proposal) => {

  console.log('Updating proposal shift for user: ', empId);

  try {
    const response = await axios.put(`${baseUrl}/api/scheduler/shift-proposals/${propId}/update`, 
      proposal,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
    });

    console.log('Shift proposal updated successfully for user: ', empId, "Resp: ", response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error with the request', error);
    return [];
  }
}

export const deleteShiftProposal = async (propId, empId) => {

  console.log('Cancelling proposal shift for user: ', empId);

  try {
    const response = await axios.delete(`${baseUrl}/api/scheduler/shift-proposals/${propId}/cancel`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });

    console.log('Shifts proposal deleted successfully for user: ', empId, "Resp: ", response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error with the request', error);
    return [];
  }
}

export const fetchProposalShifts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/scheduler/shift-proposals`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    console.log('Shifts fetched successfully', response.data);
    return response.data;
  } catch (error) {
    console.error('Error with the request', error);
    return [];
  }
};

export const approveShiftProposal = async (shiftId: string) => {
  console.log('Approving shift with ID:', shiftId);
  const token = localStorage.getItem('token') || '';
  console.log('Approving shift with token:', token);
  try {
    const response = await axios.put(
      `${baseUrl}/api/scheduler/shift-proposals/${shiftId}/accept`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      }
    );
    console.log('Shift approved successfully', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error approving shift:", error.response ? error.response.data : error);
    throw error;
  }
};

export const rejectShiftProposal = async (shiftId: string) => {
  console.log('Rejecting shift with ID:', shiftId);
  const token = localStorage.getItem('token') || '';
  console.log('Rejecting shift with token:', token);
  try {
    const response = await axios.put(
      `${baseUrl}/api/scheduler/shift-proposals/${shiftId}/reject`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      }
    );
    console.log('Shift rejected successfully', response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error rejecting shift:", error.response ? error.response.data : error);
    throw error;
  }
};

export const supervisorCreateShift = async (shift) => {

  console.log('Creating shift:', shift);
  
  const shiftToCreate = {
    shiftOwnerId: shift.employeeId || null,
    title: shift.title,
    shiftOwnerName: shift.shiftOwner || "",
    shiftOwnerRole: shift.role, 
    startTime: new Date(shift.start).toISOString(),
    endTime: new Date(shift.end).toISOString(),
  };

  try {
    const response = await axios.post(
      `${baseUrl}/api/scheduler/shifts/create`,
      shiftToCreate,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      }
    );
    console.log('Shift created successfully', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating shift', error);
  }

};

export const supervisorUpdateShift = async (shiftId, shift) => {

  const shiftToUpdate = {
    shiftOwnerId: shift.employeeId || null,
    title: shift.title,
    shiftOwnerName: shift.shiftOwner || "",
    shiftOwnerRole: shift.role, 
    startTime: new Date(shift.start).toISOString(),
    endTime: new Date(shift.end).toISOString(),
  };

  console.log('Updating shift with ID:', shiftId);
  
  const token = localStorage.getItem('token') || '';
  
  console.log('Updating shift with token:', token);
  
  try {
    const response = await axios.put(
      `${baseUrl}/api/scheduler/shifts/${shiftId}`,
      shiftToUpdate,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      }
    );
    console.log('Shift updated successfully', response.data);

    return response.data;
  
  } catch (error: any) {
    console.error("Error updating shift:", error.response ? error.response.data : error);
    throw error;

  }

};

export const supervisorDeleteShift = async (shiftId) => {

  console.log('Deleting shift with ID:', shiftId);
  
  const token = localStorage.getItem('token') || '';
  
  console.log('Deleting shift with token:', token);
  
  try {
    const response = await axios.delete(
      `${baseUrl}/api/scheduler/shifts/${shiftId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      }
    );
    console.log('Shift deleted successfully', response.data);

    return response.data;
  
  } catch (error: any) {
    console.error("Error deleting shift:", error.response ? error.response.data : error);
    throw error;

  }
};

/*
 * Swap Proposal functions
 */
export const requestSwapProposal = async (proposal: any) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/scheduler/swap-proposals/request-change`,
      proposal,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token") || "",
        },
      }
    );
    console.log("Swap proposal submitted successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting swap proposal", error);
    throw error;
  }
};

export const approveSwapProposal = async (proposalId: string, swapEmployeeId: string) => {
  console.log('Approving swap proposal with ID:', proposalId);
  console.log('Target employee ID:', swapEmployeeId);
  
  // Ensure IDs are properly formatted
  if (!proposalId || !swapEmployeeId) {
    throw new Error('Missing required parameters: proposalId or swapEmployeeId');
  }
  
  const token = localStorage.getItem('token') || '';
  
  try {
    const response = await axios.put(
      `${baseUrl}/api/scheduler/swap-proposals/${proposalId}/accept-change/${swapEmployeeId}`,
      {}, // Empty body as per the controller definition
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    );
    
    console.log("Swap proposal approved successfully", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error approving swap proposal:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};

export const declineSwapProposal = async (proposalId: string, managerComment?: string) => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/scheduler/swap-proposals/${proposalId}/decline-change`,
      managerComment ? managerComment : "",
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token") || "",
        },
      }
    );
    console.log("Swap proposal declined successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error declining swap proposal", error);
    throw error;
  }
};

export const fetchSwapProposalsByEmployee = async (employeeId: number) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/scheduler/swap-proposals/employee/${employeeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token") || "",
        },
      }
    );
    console.log("Swap proposals for employee fetched successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching swap proposals for employee", error);
    return [];
  }
};

export const fetchAllSwapProposals = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/scheduler/swap-proposals`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token") || "",
        },
      }
    );
    console.log("All swap proposals fetched successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all swap proposals", error);
    return [];
  }
};

/*
 * Role admin stuff
 */
export const getRoles = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/auth/roles`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    console.log('Roles fetched successfully', response.data);

    return response.data;

  } catch (error) {
    console.error('Error with the request', error);
    return [];

  }
};

export const getRolePermissions = async (roleId) => {
  try {
    const response = await axios.get(`${baseUrl}/api/auth/roles/${roleId}/permissions`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') || ''
      }
    });
    console.log('Role permissions fetched successfully', response.data);

    return response.data;

  } catch (error) {
    console.error('Error with the request', error);
    return [];

  }
};

export const updateRole = async (roleId, permissions) => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/auth/roles/${roleId}/permissions`,
      permissions,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      }
    );

    console.log('Role updated successfully', response.data);
    return response.data;

  } catch (error) {
    console.error('Error with the request', error);
    return [];

  }
};

export const createRole = async (role) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/auth/roles`,
      role,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      }
    );

    console.log('Role created successfully', response.data);
    return response.data;

  } catch (error) {
    console.error('Error with the request', error);
    return [];

  }
};

export const deleteRole = async (roleId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/api/auth/roles/${roleId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') || ''
        }
      }
    );

    console.log('Role deleted successfully', response.data);
    return response.data;

  } catch (error) {
    console.error('Error with the request', error);
    return [];

  }
};