// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* 1) Import your theme and global styles here */
import "./pages/styling/theme.css";
import "./pages/styling/global.css";

/* 2) If you still want Bootstrap, keep this import */
import "bootstrap/dist/css/bootstrap.min.css";

/* 3) Import your pages */
import Login from "./pages/code/Login.tsx";
import Register from "./pages/Register.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import CreateShift from "./pages/ShiftCreationForm.tsx";
import Employees from "./pages/Employees.tsx";
import Shifts from "./pages/Shifts.tsx";
import ShiftManagement from "./pages/ShiftManagement.tsx";
import ShiftAvailability from "./pages/code/ShiftAvailability.tsx";
import CompanyShiftCalendar from "./pages/code/CompanyShiftCalendar.tsx";
import EmployeeManagement from "./pages/EmployeeManagement.tsx";
import ShiftApprovalCalendar from "./pages/code/ShiftApprovalCalendar.tsx";
import NotAuthorized from "./pages/NotAuthorized.tsx";
import ShiftSwapRequests from "./pages/ShiftSwapRequests.tsx";
import ShiftSwapAdmin from "./pages/ShiftSwapAdmin.tsx";
import ShiftSupervisorDashboard from "./pages/ShiftSupervisorDashboard.tsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.tsx";
import MyShifts from "./pages/MyShifts.tsx";
import TesterDashboard from "./pages/TesterDashboard.tsx";
import TechnicianDashboard from "./pages/TechnicianDashboard.tsx";

/* 4) Import Auth context and PrivateRoute */
import { AuthProvider } from "./AuthContext.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";

/* 5) Import Global Header component */
import Header from "./components/Header.tsx";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />  {/* Global header with company logo */}
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
            <Route path="/shift-swap-admin" element={<ShiftSwapAdmin />} />
            <Route path="/shift-supervisor-dashboard" element={<ShiftSupervisorDashboard />} />
            <Route element={<PrivateRoute allowedRoles={["Employee", "Technician", "Tester"]} />}>
              <Route path="/my-shifts" element={<MyShifts />} />
            </Route>
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
            <Route path="/shift-swap" element={<ShiftSwapRequests />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/shifts" element={<Shifts />} />
            <Route path="/shift-availability" element={<ShiftAvailability />} />
            <Route path="/shift-view" element={<CompanyShiftCalendar />} />
            <Route path="/tester-dashboard" element={<TesterDashboard />} />
            <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          </Route>

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
