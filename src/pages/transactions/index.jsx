import { useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useDeleteTransaction } from "../../hooks/useDeleteTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useUpdateTransaction } from "../../hooks/useUpdateTransaction";
import "./styles.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

const formatDate = (dateValue) => {
  const date = dateValue && typeof dateValue === "object" && "seconds" in dateValue
    ? new Date(dateValue.seconds * 1000)
    : new Date(dateValue || Date.now());

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getDefaultFormState = (transaction = null) => ({
  description: transaction?.description || "",
  transactionAmount: Number(transaction?.transactionAmount || 0),
  transactionType: transaction?.transactionType || "expense",
});

const Icon = ({ name, className = "" }) => {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  if (name === "search") {
    return (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="5.5" />
        <path d="m16 16 4 4" />
      </svg>
    );
  }

  if (name === "dots") {
    return (
      <svg {...commonProps}>
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </svg>
    );
  }

  return null;
};

export const Transactions = () => {
  const { transactions } = useGetTransactions();
  const { updateTransaction } = useUpdateTransaction();
  const { deleteTransaction } = useDeleteTransaction();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [editForm, setEditForm] = useState(getDefaultFormState());
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchMatch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const typeMatch = filterType === "all" || transaction.transactionType === filterType;
      return searchMatch && typeMatch;
    });
  }, [transactions, searchTerm, filterType]);

  const transactionToDelete = transactions.find((transaction) => transaction.id === deleteTargetId) || null;

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setEditForm(getDefaultFormState(transaction));
    setFeedback({ type: "", message: "" });
  };

  const closeEditModal = () => {
    setEditingTransaction(null);
    setEditForm(getDefaultFormState());
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (!editingTransaction) {
      return;
    }

    const trimmedDescription = editForm.description.trim();
    const amountValue = Number(editForm.transactionAmount);

    if (!trimmedDescription || Number.isNaN(amountValue) || amountValue <= 0) {
      setFeedback({ type: "error", message: "Please enter a valid description and amount." });
      return;
    }

    try {
      await updateTransaction(editingTransaction.id, {
        description: trimmedDescription,
        transactionAmount: amountValue,
        transactionType: editForm.transactionType,
      });

      setFeedback({ type: "success", message: "Transaction updated successfully." });
      closeEditModal();
    } catch (error) {
      console.error("Failed to update transaction:", error);
      setFeedback({ type: "error", message: "Failed to update transaction. Please try again." });
    }
  };

  const handleDeleteTransaction = async () => {
    if (!deleteTargetId) {
      return;
    }

    try {
      await deleteTransaction(deleteTargetId);
      setFeedback({ type: "success", message: "Transaction deleted successfully." });
      setDeleteTargetId(null);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      setFeedback({ type: "error", message: "Failed to delete transaction. Please try again." });
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="page-shell">
      <Sidebar isMobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="content-shell">
        <Header onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />

        <main className="page-content">
          <section className="page-card page-card--wide">
            <div className="page-card__header">
              <h2>All Transactions</h2>

              <div className="page-card__controls">
                <label className="search-field" aria-label="Search transactions">
                  <Icon name="search" className="search-field__icon" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search transactions..."
                  />
                </label>

                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>

            {feedback.message && (
              <div className={`status-banner status-banner--${feedback.type}`}>
                {feedback.message}
              </div>
            )}

            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">💸</div>
                <h4>No transactions yet</h4>
                <p>Start tracking your money by adding your first transaction.</p>
              </div>
            ) : (
              <div className="transactions-table-wrap">
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => {
                      const isIncome = transaction.transactionType === "income";

                      return (
                        <tr key={transaction.id}>
                          <td data-label="Description">
                            <div className="transaction-name">
                              <span className={`transaction-pill transaction-pill--${transaction.transactionType}`}>
                                {isIncome ? "↗" : "↘"}
                              </span>
                              {transaction.description}
                            </div>
                          </td>
                          <td data-label="Type">
                            <span
                              className={`transaction-type transaction-type--${transaction.transactionType}`}
                            >
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td data-label="Amount">
                            <span
                              className={`transaction-amount transaction-amount--${transaction.transactionType}`}
                            >
                              {isIncome ? "+" : "-"}
                              {formatCurrency(transaction.transactionAmount)}
                            </span>
                          </td>
                          <td data-label="Date">{formatDate(transaction.createdAt)}</td>
                          <td data-label="Action">
                            <div className="table-actions">
                              <button type="button" className="table-action table-action--edit" onClick={() => openEditModal(transaction)}>
                                Edit
                              </button>
                              <button type="button" className="table-action table-action--delete" onClick={() => setDeleteTargetId(transaction.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {editingTransaction && (
        <div className="modal-backdrop" onClick={closeEditModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h3>Edit Transaction</h3>

            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="field-group">
                <label htmlFor="edit-description">Description</label>
                <input
                  id="edit-description"
                  type="text"
                  value={editForm.description}
                  onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Enter description..."
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="edit-amount">Amount</label>
                <input
                  id="edit-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editForm.transactionAmount}
                  onChange={(event) => setEditForm((current) => ({ ...current, transactionAmount: Number(event.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="field-group">
                <label>Type</label>
                <div className="type-toggle-group">
                  <button
                    type="button"
                    className={`type-toggle ${editForm.transactionType === "income" ? "type-toggle--active type-toggle--income" : ""}`}
                    onClick={() => setEditForm((current) => ({ ...current, transactionType: "income" }))}
                  >
                    ↑ Income
                  </button>
                  <button
                    type="button"
                    className={`type-toggle ${editForm.transactionType === "expense" ? "type-toggle--active type-toggle--expense" : ""}`}
                    onClick={() => setEditForm((current) => ({ ...current, transactionType: "expense" }))}
                  >
                    ↓ Expense
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-button modal-button--secondary" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-button modal-button--primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTargetId && (
        <div className="modal-backdrop" onClick={() => setDeleteTargetId(null)}>
          <div className="modal-card modal-card--confirm" onClick={(event) => event.stopPropagation()}>
            <h3>Delete Transaction?</h3>
            <p>
              {transactionToDelete
                ? `Are you sure you want to delete "${transactionToDelete.description} - ${formatCurrency(transactionToDelete.transactionAmount)}"? This action cannot be undone.`
                : "Are you sure you want to delete this transaction? This action cannot be undone."}
            </p>
            <div className="modal-actions">
              <button type="button" className="modal-button modal-button--secondary" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </button>
              <button type="button" className="modal-button modal-button--danger" onClick={handleDeleteTransaction}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
