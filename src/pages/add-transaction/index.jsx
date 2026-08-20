import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import "./styles.css";

export const AddTransaction = () => {
  const { addTransaction } = useAddTransaction();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    const trimmedDescription = description.trim();
    if (!trimmedDescription) {
      return;
    }

    await addTransaction(trimmedDescription, Number(transactionAmount) || 0, transactionType);
    setDescription("");
    setTransactionAmount(0);
    setTransactionType("expense");
    navigate("/expense-tracker");
  };

  return (
    <div className="page-shell">
      <Sidebar isMobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="content-shell">
        <Header onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />

        <main className="page-content page-content--centered">
          <section className="page-card add-transaction-card">
            <div className="page-card__header page-card__header--align-left">
              <h2>Add New Transaction</h2>
            </div>

            <form className="transaction-form" onSubmit={onSubmit}>
              <div className="field-group">
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Enter description..."
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={transactionAmount}
                  onChange={(event) => setTransactionAmount(Number(event.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="field-group">
                <label>Type</label>
                <div className="type-toggle-group">
                  <button
                    type="button"
                    className={`type-toggle ${transactionType === "income" ? "type-toggle--active type-toggle--income" : ""}`}
                    onClick={() => setTransactionType("income")}
                  >
                    ↑ Income
                  </button>
                  <button
                    type="button"
                    className={`type-toggle ${transactionType === "expense" ? "type-toggle--active type-toggle--expense" : ""}`}
                    onClick={() => setTransactionType("expense")}
                  >
                    ↓ Expense
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-button">
                + Add Transaction
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};
