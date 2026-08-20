import { useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import "./styles.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

export const AnalyticsPage = () => {
  const { transactions, transactionTotals } = useGetTransactions();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const summaryCards = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalIncome = transactionTotals.income || 0;
    const totalExpenses = transactionTotals.expense || 0;
    const netBalance = transactionTotals.balance || 0;

    return [
      { label: "Total Transactions", value: totalTransactions },
      { label: "Total Income", value: formatCurrency(totalIncome), accent: "green" },
      { label: "Total Expenses", value: formatCurrency(totalExpenses), accent: "red" },
      { label: "Net Balance", value: `${netBalance < 0 ? "-$" : "$"}${Math.abs(netBalance).toFixed(2)}`, accent: netBalance >= 0 ? "green" : "red" },
    ];
  }, [transactions, transactionTotals]);

  const dataPoints = useMemo(() => {
    const totalsByDate = {};

    transactions.forEach((transaction) => {
      const dateKey = new Date(transaction.createdAt?.seconds ? transaction.createdAt.seconds * 1000 : Date.now())
        .toLocaleDateString("en-US", { month: "short", day: "numeric" });

      totalsByDate[dateKey] = totalsByDate[dateKey] || { income: 0, expense: 0 };

      if (transaction.transactionType === "income") {
        totalsByDate[dateKey].income += Number(transaction.transactionAmount || 0);
      } else {
        totalsByDate[dateKey].expense += Number(transaction.transactionAmount || 0);
      }
    });

    return Object.entries(totalsByDate).slice(-6).map(([date, values]) => ({
      date,
      income: values.income,
      expense: values.expense,
    }));
  }, [transactions]);

  return (
    <div className="page-shell">
      <Sidebar isMobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="content-shell">
        <Header onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />

        <main className="page-content">
          <section className="analytics-header">
            <div>
              <h2>Analytics</h2>
              <p>Understand your spending habits</p>
            </div>
          </section>

          <section className="analytics-grid">
            {summaryCards.map((card) => (
              <article key={card.label} className={`analytics-card analytics-card--${card.accent || "neutral"}`}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </section>

          <section className="analytics-panels">
            <article className="panel-card">
              <div className="panel-card__heading">
                <h3>Income vs Expenses</h3>
              </div>

              <div className="donut-chart">
                <div className="donut-chart__inner">
                  <strong>
                    {formatCurrency(transactionTotals.balance)}
                  </strong>
                  <span>Net</span>
                </div>
              </div>

              <div className="legend-row">
                <div className="legend-item legend-item--income">
                  <span className="legend-swatch" />
                  <span>Income</span>
                  <strong>{formatCurrency(transactionTotals.income)}</strong>
                </div>
                <div className="legend-item legend-item--expense">
                  <span className="legend-swatch" />
                  <span>Expenses</span>
                  <strong>{formatCurrency(transactionTotals.expense)}</strong>
                </div>
              </div>
            </article>

            <article className="panel-card panel-card--wide">
              <div className="panel-card__heading">
                <h3>Income vs Expense Over Time</h3>
              </div>

              <div className="bar-chart" aria-label="Transaction trend by date">
                {dataPoints.length === 0 ? (
                  <div className="bar-chart__empty">No data available yet.</div>
                ) : (
                  dataPoints.map((point) => (
                    <div key={point.date} className="bar-chart__column-group">
                      <div className="bar-chart__stack">
                        <span
                          className="bar-chart__bar bar-chart__bar--income"
                          style={{ height: `${Math.max((point.income / Math.max(transactionTotals.income, 1)) * 100, 8)}%` }}
                        />
                        <span
                          className="bar-chart__bar bar-chart__bar--expense"
                          style={{ height: `${Math.max((point.expense / Math.max(transactionTotals.expense, 1)) * 100, 8)}%` }}
                        />
                      </div>
                      <small>{point.date}</small>
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};
