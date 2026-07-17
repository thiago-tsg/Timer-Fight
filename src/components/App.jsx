import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Timer from "./Timer";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { user, userData, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : userData?.gymId ? (
              <Navigate
                to={`/timer/${encodeURIComponent(userData.gymId)}`}
                replace
              />
            ) : (
              <div>Usuário sem academia vinculada.</div>
            )
          }
        />

        <Route
          path="/timer/:gymId"
          element={
            <PrivateRoute>
              <Timer />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </Router>
  );
}

export default App;
