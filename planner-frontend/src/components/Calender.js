// src/components/Calendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the default styling

function MyCalendar() {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Here you can add any logic you need when a date is selected
  };

  return (
    <div>
      <h2>My Calendar</h2>
      <Calendar
        onChange={handleDateChange}
        value={date}
        minDate={new Date()} // Optional: prevent selecting past dates
      />
      <p>Selected date: {date.toDateString()}</p>
    </div>
  );
}

export default MyCalendar;