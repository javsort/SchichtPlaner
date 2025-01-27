import React from 'react';

const TechnicianDashboard = () => {
  return (
    <div>
      <h2>Technician Dashboard</h2>

      <section>
        <h3>Assigned Tasks</h3>
        <ul>
          <li>Task 1: Equipment check-up</li>
          <li>Task 2: System maintenance</li>
          <li>Task 3: Report faulty equipment</li>
          {/* Dynamic tasks can be added from the backend */}
        </ul>
      </section>

      <section>
        <h3>Equipment Status</h3>
        <table>
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Computer Server</td>
              <td>Working</td>
            </tr>
            <tr>
              <td>Router</td>
              <td>Needs Repair</td>
            </tr>
            {/* Dynamic equipment data can be fetched */}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Incident Tracking</h3>
        <button>Report an Issue</button>
        {/* Button to open form/modal for incident reporting */}
        <ul>
          <li>Incident 1: Network downtime - Reported</li>
          <li>Incident 2: Power failure - Pending</li>
          {/* Dynamic incident data */}
        </ul>
      </section>
    </div>
  );
}

export default TechnicianDashboard;