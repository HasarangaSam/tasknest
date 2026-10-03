import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/protected-route.js";
import { useAuth } from "./context/auth-context.js";
import { Dashboard } from "./pages/dashboard.js";
import { Login } from "./pages/auth/login.js";
import { Register } from "./pages/auth/register.js";

function HomeRedirect() {
  const { user } = useAuth();

  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
