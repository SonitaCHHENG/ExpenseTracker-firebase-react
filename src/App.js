import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Auth } from "./pages/auth";
import { ExpenseTracker } from "./pages/expense-tracker";
import { Transactions } from "./pages/transactions";
import { AddTransaction } from "./pages/add-transaction";
import { AnalyticsPage } from "./pages/analytics";
import { Settings } from "./pages/settings";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/expense-tracker" element={<ExpenseTracker />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
