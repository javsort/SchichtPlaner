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

// Login endpoint
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      email: email,
      password: password
    });

    const data = await response;

    localStorage.setItem('token', data.data.token);
    localStorage.setItem('userId', data.data.userId);

    return { email: data.data.email, role: data.data.role, token: data.data.token, userId: data.data.userId };

  } catch (error) {
    console.error('Error logging in', error);

  }
};

// Shifts
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

// Shift proposal
export const proposeShift = async (
  employeeId: number,
  proposedTitle: string,
  proposedStartTime: string,
  proposedEndTime: string,
  status: string
) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/scheduler/shift-proposals/create`,
      {
        employeeId: employeeId,
        proposedTitle: proposedTitle,
        proposedStartTime: proposedStartTime,
        proposedEndTime: proposedEndTime,
        status: status
      },
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

export const approveShift = async (shiftId: string) => {
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
