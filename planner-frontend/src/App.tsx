import React, { useEffect, useState } from "react";
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

// Protected UI Pages (Admin, Shift-Supervisor, etc.)
import EmployeeManagement from "./pages/admin/EmployeeManagement.tsx";
import RoleManagement from "./pages/admin/RoleManagement.tsx";
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

// Ensure language load to avoid flicker
import { useTranslation } from "react-i18next";

// Global Layout for authenticated pages (includes GlobalSidebar and Header)
import MainLayout from "./components/MainLayout.tsx";

const App: React.FC = () => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "de";
    i18n.changeLanguage(storedLang).then(() => setLoading(false));
  }, []);

  // Only render the app once the language has been loaded
  if (loading) return null;

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

          {/* Protected Routes */}
          <Route element={<PrivateRoute requiredPermissions={["EMPLOYEE_MANAGEMENT"]} />}>
            <Route element={<MainLayout />}>
              <Route path="employee-management" element={<EmployeeManagement />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredPermissions={["ROLE_MANAGEMENT"]} />}>
            <Route element={<MainLayout />}>
              <Route path="role-management" element={<RoleManagement />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredPermissions={["PROPOSAL_APPROVAL"]} />}>
            <Route element={<MainLayout />}>
              <Route path="shift-approval" element={<ShiftApprovalCalendar />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredPermissions={["SWAP_APPROVAL"]} />}>
            <Route element={<MainLayout />}>
              <Route path="shift-swap-admin" element={<ShiftSwapAdmin />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredPermissions={["SHIFT_MANAGEMENT"]} />}>
            <Route element={<MainLayout />}>
              <Route path="shift-management" element={<ShiftManagement />} />
              <Route path="create-shift" element={<CreateShift />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredPermissions={["SHIFT_PROPOSAL"]} />}>
            <Route element={<MainLayout />}>
              <Route path="shift-availability" element={<ShiftAvailability />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredPermissions={["CALENDAR_VIEW"]} />}>
            <Route element={<MainLayout />}>
              <Route path="shift-view" element={<CompanyShiftCalendar />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute requiredPermissions={["SWAP_PROPOSAL"]} />}>
            <Route element={<MainLayout />}>
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