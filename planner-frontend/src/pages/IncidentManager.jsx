import React from 'react';

const IncidentManagerDashboard = () => {
  return (
    <div>
      <h2>Incident Manager Dashboard</h2>

      <section>
        <h3>Ongoing Incidents</h3>
        <table>
          <thead>
            <tr>
              <th>Incident ID</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>INC-001</td>
              <td>Network downtime</td>
              <td>Escalated</td>
              <td><button>Resolve</button> <button>Escalate</button></td>
            </tr>
            <tr>
              <td>INC-002</td>
              <td>Power failure</td>
              <td>In Progress</td>
              <td><button>Resolve</button> <button>Escalate</button></td>
            </tr>
            {/* Dynamic incident data */}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Manage Incident</h3>
        <button>Assign Incident</button>
        {/* Button to assign incidents to team members */}
      </section>
    </div>
  );
}

export default IncidentManagerDashboard;
