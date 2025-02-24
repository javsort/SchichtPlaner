// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Import pages with explicit extensions
import Login from "./pages/code/Login.tsx";
import Register from "./pages/Register.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import CreateShift from "./pages/ShiftCreationForm.tsx"; // Assuming you want ShiftCreationForm as CreateShift
import Employees from "./pages/Employees.tsx";
import Shifts from "./pages/Shifts.tsx";
import ShiftManagement from "./pages/ShiftManagement.tsx";
import ShiftAvailability from "./pages/ShiftAvailability.tsx";
import CompanyShiftCalendar from "./pages/CompanyShiftCalendar.tsx";
import EmployeeManagement from "./pages/EmployeeManagement.tsx";
import ShiftApprovalCalendar from "./pages/ShiftApprovalCalendar.tsx";
import NotAuthorized from "./pages/NotAuthorized.tsx";
import ShiftSwapRequests from "./pages/ShiftSwapRequests.tsx";

// Import Auth Context and PrivateRoute with explicit extensions
import { AuthProvider } from "./AuthContext.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />

          {/* Protected Routes Group: Admin & Shift Supervisor */}
          <Route element={<PrivateRoute allowedRoles={["Admin", "Shift Supervisor"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/employee-management" element={<EmployeeManagement />} />
            <Route path="/shift-approval" element={<ShiftApprovalCalendar />} />
          </Route>

          {/* Protected Routes Group: Shift Supervisor & Extra Role */}
          <Route element={<PrivateRoute allowedRoles={["Shift Supervisor", "Extra Role"]} />}>
            <Route path="/create-shift" element={<CreateShift />} />
            <Route path="/shift-management" element={<ShiftManagement />} />
          </Route>

          {/* Protected Routes Group: Multiple Roles */}
          <Route
            element={
              <PrivateRoute
                allowedRoles={[
                  "Admin",
                  "Shift Supervisor",
                  "Technician",
                  "Tester",
                  "Incident Manager",
                  "Extra Role",
                ]}
              />
            }
          >
            <Route path="/shift-swap" element={<ShiftSwapRequests currentUser={{ id: 1 }} isAdmin={false} />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/shifts" element={<Shifts />} />
            <Route path="/shift-availability" element={<ShiftAvailability />} />
            <Route path="/shift-view" element={<CompanyShiftCalendar />} />
          </Route>

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>// src/App.tsx
  );
};

export default App;
