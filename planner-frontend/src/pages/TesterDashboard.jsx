import React from 'react';

const TesterDashboard = () => {
  return (
    <div>
      <h2>Tester Dashboard</h2>

      <section>
        <h3>Assigned Tests</h3>
        <ul>
          <li>Test 1: User Login</li>
          <li>Test 2: Payment Gateway</li>
          <li>Test 3: Mobile Responsiveness</li>
          {/* Dynamic tests assigned from backend */}
        </ul>
      </section>

      <section>
        <h3>Bug Tracking</h3>
        <table>
          <thead>
            <tr>
              <th>Bug ID</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BUG-001</td>
              <td>Login screen crash</td>
              <td>Open</td>
            </tr>
            <tr>
              <td>BUG-002</td>
              <td>Payment gateway timeout</td>
              <td>Fixed</td>
            </tr>
            {/* Dynamic bug data */}
          </tbody>
        </table>
      </section>

      <section>
        <h3>Test Results</h3>
        <button>View Test Reports</button>
        {/* Button to view detailed reports */}
        <ul>
          <li>Test 1: Passed</li>
          <li>Test 2: Failed</li>
          <li>Test 3: Pending</li>
          {/* Dynamic results */}
        </ul>
      </section>
    </div>
  );
}

export default TesterDashboard;