// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./pages/general/theme.css";
import "./pages/general/global.css";

// Public Pages
import Login from "./pages/general/Login.tsx";
import Register from "./pages/general/Register.tsx";
import NotAuthorized from "./pages/general/NotAuthorized.tsx";
import MyShifts from "./pages/MyShifts.tsx";

// Protected UI Pages (Admin, ShiftSupervisor, etc.)
import EmployeeManagement from "./pages/admin/EmployeeManagement.tsx";
import ShiftApprovalCalendar from "./pages/admin/ShiftApprovalCalendar.tsx";
import ShiftSwapAdmin from "./pages/admin/ShiftSwapAdmin.tsx";
import CreateShift from "./pages/admin/ShiftCreationForm.tsx";
import ShiftManagement from "./pages/admin/ShiftManagement.tsx";

// Employee Pages
import Shifts from "./pages/employee/Shifts.tsx";
import ShiftAvailability from "./pages/employee/ShiftAvailability.tsx";

import CompanyShiftCalendar from "./pages/employee/CompanyShiftCalendar.tsx";
import ShiftSwapRequests from "./pages/employee/ShiftSwapRequests.tsx";


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

          <Route element={<PrivateRoute allowedRoles={[
              "Admin",
              "ShiftSupervisor",
              "Technician",
              "Tester",
              "Incident Manager",
              "Extra Role",
            ]} />}>
            <Route element={<MainLayout />}>
              <Route path="employee-management" element={<EmployeeManagement />} />
              <Route path="shift-approval" element={<ShiftApprovalCalendar />} />
              <Route path="shift-swap-admin" element={<ShiftSwapAdmin />} />
              <Route path="create-shift" element={<CreateShift />} />
              <Route path="shift-management" element={<ShiftManagement />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="shift-availability" element={<ShiftAvailability />} />
              <Route path="shift-view" element={<CompanyShiftCalendar />} />
              <Route path="shift-swap" element={<ShiftSwapRequests />} />
              
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;