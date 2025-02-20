import axios from 'axios';

const fetchShifts = async () => {
  try {
    const response = await axios.get('/api/shifts');
    setShifts(response.data);
  } catch (error) {
    console.error('Error fetching shifts', error);
}
};
