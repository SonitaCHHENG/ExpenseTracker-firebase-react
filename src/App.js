import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Auth } from "./pages/auth";
import { ExpenseTracker } from "./pages/expense-tracker";
import { Transactions } from "./pages/transactions";
import { AddTransaction } from "./pages/add-transaction";
import { AnalyticsPage } from "./pages/analytics";
import { Settings } from "./pages/settings";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/" element={<Auth />} />

            {/* Protected Routes */}
            <Route
              path="/expense-tracker"
              element={
                <ProtectedRoute>
                  <ExpenseTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-transaction"
              element={
                <ProtectedRoute>
                  <AddTransaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;