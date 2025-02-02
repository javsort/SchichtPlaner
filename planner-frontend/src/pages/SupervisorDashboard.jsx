// src/pages/SupervisorDashboard.jsx
import React, { useState } from 'react';

const SupervisorDashboard = () => {
  // Sample shift data for Shift Schedule
  const shifts = [
    { date: '2025-01-26', shift: 'Morning (8 AM - 4 PM)', employee: 'John Doe' },
    { date: '2025-01-27', shift: 'Afternoon (4 PM - 12 AM)', employee: 'Jane Smith' },
    { date: '2025-01-28', shift: 'Night (12 AM - 8 AM)', employee: 'Alice Johnson' }
  ];

  // Sample team performance data
  const teamPerformance = [
    { employee: 'John Doe', tasksCompleted: 5, performance: 'Good' },
    { employee: 'Jane Smith', tasksCompleted: 3, performance: 'Average' },
    { employee: 'Alice Johnson', tasksCompleted: 7, performance: 'Excellent' }
  ];

  // Sample task monitoring data
  const [tasks, setTasks] = useState([
    { task: 'Monitor network', assignedTo: 'John Doe', completed: false },
    { task: 'System check', assignedTo: 'Jane Smith', completed: true },
    { task: 'Security maintenance', assignedTo: 'Alice Johnson', completed: false }
  ]);

  const handleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  return (
    <div className="supervisor-dashboard">
      <h2>Shift Supervisor Dashboard</h2>

      {/* Shift Schedule Section */}
      <div className="shift-schedule">
        <h3>Upcoming Shifts</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Shift</th>
              <th>Employee</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index}>
                <td>{shift.date}</td>
                <td>{shift.shift}</td>
                <td>{shift.employee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Team Performance Section */}
      <div className="team-performance">
        <h3>Team Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Tasks Completed</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {teamPerformance.map((teamMember, index) => (
              <tr key={index}>
                <td>{teamMember.employee}</td>
                <td>{teamMember.tasksCompleted}</td>
                <td>{teamMember.performance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Monitoring Section */}
      <div className="task-monitoring">
        <h3>Task Monitoring</h3>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskCompletion(index)}
              />
              {task.task} (Assigned to: {task.assignedTo})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SupervisorDashboard;



