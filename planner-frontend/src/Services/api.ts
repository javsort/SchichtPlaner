import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

/*
 * Working endpoints:
*/

// Login endpoint
/*
  Body sample expected in the backend:
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
*/
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      email: email,
      password: password
    });

    const data = await response;

    localStorage.setItem('token', data.data.token);

    return { email: data.data.email, role: data.data.role, token: data.data.token };

  } catch (error) {
    console.error('Error logging in', error);

  }
};


/*
  Untested endpoints:
*/

// Shift proposal
/*
  Body sample expected in the backend:
  {
    "employeeId": 1,
    "proposedTitle": "Test Shift I",
    "proposedStartTime": "2025-02-24T12:34:56",
    "proposedEndTime": "2025-02-24T14:00:00",
    "status": "PROPOSED"
  }
*/
export const proposeShift = async (employeeId: number, proposedTitle: string, proposedStartTime: string, proposedEndTime: string, status: string) => {
  try {
    const response = await axios.post(`${baseUrl}/api/scheduler/shift-proposals/create`, {
      employeeId: employeeId,
      proposedTitle: proposedTitle,
      proposedStartTime: proposedStartTime,
      proposedEndTime: proposedEndTime,
      status: status
    });

    const data = await response;

    if (data.status === 200) {
      console.log('Shift proposed successfully', data);
      return true;
    
    } else {
      console.error('Error proposing shift', data);
      return false;

    }
    
  } catch (error) {
    console.error('Error logging in', error);

  }
};

const fetchShifts = async () => {
  try {
    const response = await axios.get('/api/shifts');
    setShifts(response.data);
  } catch (error) {
    console.error('Error fetching shifts', error);
}
};
