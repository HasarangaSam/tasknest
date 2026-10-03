import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/protected-route.js";
import { Dashboard } from "./pages/dashboard.js";
import { Login } from "./pages/auth/login.js";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
