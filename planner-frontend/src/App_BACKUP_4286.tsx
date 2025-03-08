// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./pages/general/theme.css";
import "./pages/general/global.css";

<<<<<<< HEAD
import Header from "./components/Header.tsx"; // (Now used in MainLayout)


// Public Pages
import Login from "./pages/general/Login.tsx";
import Register from "./pages/general/Register.tsx";
import NotAuthorized from "./pages/general/NotAuthorized.tsx";
import MyShifts from "./pages/MyShifts.tsx";

// Protected UI Pages (Admin, ShiftSupervisor, etc.)
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import EmployeeManagement from "./pages/admin/EmployeeManagement.tsx";
import ShiftApprovalCalendar from "./pages/admin/ShiftApprovalCalendar.tsx";
import ShiftSwapAdmin from "./pages/admin/ShiftSwapAdmin.tsx";
import ShiftSupervisorDashboard from "./pages/admin/ShiftSupervisorDashboard.tsx";
import CreateShift from "./pages/admin/ShiftCreationForm.tsx";
import ShiftManagement from "./pages/admin/ShiftManagement.tsx";
=======
// Paths to general pages
import Login from "./pages/general/Login.tsx";
import Register from "./pages/general/Register.tsx";
import NotAuthorized from "./pages/general/NotAuthorized.tsx";

// Paths to admin/shift supervisor only
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import CreateShift from "./pages/admin/ShiftCreationForm.tsx"; // Assuming you want ShiftCreationForm as CreateShift
import Employees from "./pages/admin/Employees.tsx";
import ShiftManagement from "./pages/admin/ShiftManagement.tsx";
import EmployeeManagement from "./pages/admin/EmployeeManagement.tsx";
import ShiftSwapAdmin from "./pages/admin/ShiftSwapAdmin.tsx";
import ShiftSupervisorDashboard from "./pages/admin/ShiftSupervisorDashboard.tsx";
import ShiftApprovalCalendar from "./pages/admin/ShiftApprovalCalendar.tsx";

// Paths to employees
import Shifts from "./pages/employee/Shifts.tsx";
import ShiftAvailability from "./pages/employee/ShiftAvailability.tsx";
import CompanyShiftCalendar from "./pages/employee/CompanyShiftCalendar.tsx";
import ShiftSwapRequests from "./pages/employee/ShiftSwapRequests.tsx";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.tsx";
import TesterDashboard from "./pages/employee/TesterDashboard.tsx";
import TechnicianDashboard from "./pages/employee/TechnicianDashboard.tsx";

// Still to organize:
import MyShifts from "./pages/MyShifts.tsx";
>>>>>>> origin/main

// Employee Pages
import Shifts from "./pages/employee/Shifts.tsx";
import ShiftAvailability from "./pages/employee/ShiftAvailability.tsx";
import CompanyShiftCalendar from "./pages/employee/CompanyShiftCalendar.tsx";
import ShiftSwapRequests from "./pages/employee/ShiftSwapRequests.tsx";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.tsx";
import TesterDashboard from "./pages/employee/TesterDashboard.tsx";
import TechnicianDashboard from "./pages/employee/TechnicianDashboard.tsx";

// Context & Private Route
import { AuthProvider } from "./AuthContext.tsx";
import PrivateRoute from "./pages/PrivateRoute.tsx";

// Global Layout for authenticated pages (includes GlobalSidebar and Header)
import MainLayout from "./components/MainLayout.tsx";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Helmet>
          <title>My Shift Planner</title>
        </Helmet>

        {/* Protected Routes Wrapped in MainLayout */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="/my-shifts" element={<MyShifts />} />

<<<<<<< HEAD
          <Route element={<PrivateRoute allowedRoles={[
              "Admin",
              "ShiftSupervisor",
              "Technician",
              "Tester",
              "Incident Manager",
              "Extra Role",
            ]} />}>
            <Route element={<MainLayout />}>
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="employee-management" element={<EmployeeManagement />} />
              <Route path="shift-approval" element={<ShiftApprovalCalendar />} />
              <Route path="shift-swap-admin" element={<ShiftSwapAdmin />} />
              <Route path="shift-supervisor-dashboard" element={<ShiftSupervisorDashboard />} />
              <Route path="create-shift" element={<CreateShift />} />
              <Route path="shift-management" element={<ShiftManagement />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="shift-availability" element={<ShiftAvailability />} />
              <Route path="shift-view" element={<CompanyShiftCalendar />} />
              <Route path="shift-swap" element={<ShiftSwapRequests />} />
              <Route path="tester-dashboard" element={<TesterDashboard />} />
              <Route path="technician-dashboard" element={<TechnicianDashboard />} />
              <Route path="employee-dashboard" element={<EmployeeDashboard />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
=======
          {/* Protected Routes Group: Admin & Shift Supervisor */}
          <Route element={<PrivateRoute allowedRoles={["Admin", "ShiftSupervisor"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/employee-management" element={<EmployeeManagement />} />
            <Route path="/shift-approval" element={<ShiftApprovalCalendar />} />
            <Route path="/shift-swap-admin" element={<ShiftSwapAdmin />} />
            <Route path="/shift-supervisor-dashboard" element={<ShiftSupervisorDashboard />} />

            
            <Route element={<PrivateRoute allowedRoles={["Employee", "Technician", "Tester"]} />}> </Route>
          </Route>

        {/* Protected Routes Group: Shift Supervisor & Extra Role */}
        <Route element={<PrivateRoute allowedRoles={["ShiftSupervisor", "Extra Role"]} />}>
          <Route path="/create-shift" element={<CreateShift />} />
          <Route path="/shift-management" element={<ShiftManagement />} />
        </Route>

        {/* Protected Routes Group: Multiple Roles */}
        <Route
          element={
            <PrivateRoute
              allowedRoles={[
                "Admin",
                "ShiftSupervisor",
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
          {/* New routes for Tester and Technician dashboards */}
          <Route path="/tester-dashboard" element={<TesterDashboard />} />
          <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
          {/* New route for Employee Dashboard */}
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        </Route>

          {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
>>>>>>> origin/main
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
