import { useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./styles.css";

const navItems = [
 { label: "Dashboard", path: "/expense-tracker", icon: "home" },
 { label: "Transactions", path: "/transactions", icon: "credit" },
 { label: "Add Transaction", path: "/add-transaction", icon: "plus" },
 { label: "Analytics", path: "/analytics", icon: "chart" },
 { label: "Settings", path: "/settings", icon: "settings" },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
 style: "currency",
 currency: "USD",
});

const formatCurrency = (value) => currencyFormatter.format(Number(value || 0));

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

 switch (name) {
   case "home":
     return (
       <svg {...commonProps}>
         <path d="M3 10.5 12 3l9 7.5" />
         <path d="M5 9.5V20h14V9.5" />
         <path d="M9 20v-7h6v7" />
       </svg>
     );
   case "credit":
     return (
       <svg {...commonProps}>
         <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
         <path d="M2.5 10h19" />
         <path d="M7 15h4" />
       </svg>
     );
   case "plus":
     return (
       <svg {...commonProps}>
         <path d="M12 5v14M5 12h14" />
       </svg>
     );
   case "chart":
     return (
       <svg {...commonProps}>
         <path d="M4 18.5V8.5" />
         <path d="M10 18.5V5.5" />
         <path d="M16 18.5v-8" />
         <path d="M22 18.5V3.5" />
       </svg>
     );
   case "settings":
     return (
       <svg {...commonProps}>
         <circle cx="12" cy="12" r="3.25" />
         <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .46 1.7 1.7 0 0 0-.4 1.08V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.45-.66 1.7 1.7 0 0 0-1.08.4l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.46-1 1.7 1.7 0 0 0-1.08-.4H2.97a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0 .66-1.45 1.7 1.7 0 0 0-.4-1.08l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.46 1.7 1.7 0 0 0 .4-1.08V2.97a2 2 0 1 1 4 0v.09c.04.42.2.8.46 1.08.26.28.64.46 1.08.4h.1a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.08.4 1.7 1.7 0 0 0-.4 1.08v.09a2 2 0 0 1 0 4h-.09A1.7 1.7 0 0 0 15 13.1c.26.28.63.46 1.08.4z" />
       </svg>
     );
   case "wallet":
     return (
       <svg {...commonProps}>
         <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-12A2.5 2.5 0 0 1 3 16.5v-6A2.5 2.5 0 0 1 4 8.5z" />
         <path d="M15 12h5v4h-5" />
         <path d="M3 10.5h15" />
       </svg>
     );
   case "bell":
     return (
       <svg {...commonProps}>
         <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
         <path d="M10 20a2 2 0 0 0 4 0" />
       </svg>
     );
   case "menu":
     return (
       <svg {...commonProps}>
         <path d="M4 7h16M4 12h16M4 17h16" />
       </svg>
     );
   case "search":
     return (
       <svg {...commonProps}>
         <circle cx="11" cy="11" r="5.5" />
         <path d="m16 16 4 4" />
       </svg>
     );
   case "arrow-up":
     return (
       <svg {...commonProps}>
         <path d="M12 19V5" />
         <path d="m6 11 6-6 6 6" />
       </svg>
     );
   case "arrow-down":
     return (
       <svg {...commonProps}>
         <path d="M12 5v14" />
         <path d="m18 13-6 6-6-6" />
       </svg>
     );
   case "logout":
     return (
       <svg {...commonProps}>
         <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
         <path d="M16 17l5-5-5-5" />
         <path d="M21 12H9" />
       </svg>
     );
   case "dots":
     return (
       <svg {...commonProps}>
         <circle cx="5" cy="12" r="1.5" />
         <circle cx="12" cy="12" r="1.5" />
         <circle cx="19" cy="12" r="1.5" />
       </svg>
     );
   default:
     return null;
 }
};

const Sidebar = ({ profilePhoto, profileName, onSignOut, isMobileOpen, onClose }) => {
 const location = useLocation();
 const navigate = useNavigate();

 return (
   <aside className={`sidebar ${isMobileOpen ? "sidebar--open" : ""}`}>
     <div className="sidebar__content">
       <div className="sidebar__profile">
         <img
           src={profilePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"}
           alt="User avatar"
         />
         <div>
           <h2>{profileName}</h2>
           <span>Personal Account</span>
         </div>
       </div>

       <nav className="sidebar__nav" aria-label="Sidebar navigation">
         {navItems.map(({ label, icon, path }) => (
           <button
             key={label}
             type="button"
             className={`nav-item ${location.pathname === path ? "nav-item--active" : ""}`}
             onClick={() => {
               onClose();
               navigate(path);
             }}
           >
             <span className="nav-item__icon">
               <Icon name={icon} />
             </span>
             <span>{label}</span>
           </button>
         ))}
       </nav>
     </div>

     <button type="button" className="sign-out-button" onClick={onSignOut}>
       <Icon name="logout" className="sign-out-button__icon" />
       <span>Sign Out</span>
     </button>
   </aside>
 );
};

const Header = ({ profilePhoto, profileName, today, onMenuToggle }) => (
 <header className="topbar">
   <div className="topbar__left">
     <button type="button" className="menu-button" aria-label="Open menu" onClick={onMenuToggle}>
       <Icon name="menu" />
     </button>
     <div className="topbar__title-group">
       <h1>Expense Tracker</h1>
       <p>Manage your money easily</p>
     </div>
   </div>

   <div className="topbar__right">
     <button type="button" className="icon-button" aria-label="Notifications">
       <Icon name="bell" />
     </button>
     <span className="date-pill">{today}</span>
     <img
       className="topbar__avatar"
       src={profilePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"}
       alt={profileName}
     />
   </div>
 </header>
);

const SummaryCard = ({ title, amount, accent, iconName }) => (
 <div className={`summary-card summary-card--${accent}`}>
   <div className="summary-card__icon">
     <Icon name={iconName} />
   </div>
   <div className="summary-card__content">
     <span>{title}</span>
     <strong>{formatCurrency(amount)}</strong>
   </div>
 </div>
);

const BalanceCard = ({ balance }) => (
 <div className="balance-card">
   <div className="balance-card__content">
     <div className="balance-card__label-wrap">
       <div className="balance-card__icon">
         <Icon name="wallet" />
       </div>
       <span className="balance-card__label">Total Balance</span>
     </div>
     <div className="balance-card__value-wrap">
       <strong className={`balance-card__value ${balance < 0 ? "balance-card__value--negative" : ""}`}>
         {balance < 0 ? "-$" : "$"}
         {Math.abs(balance).toFixed(2)}
       </strong>
       <span className="balance-card__meta">Available balance</span>
     </div>
   </div>
   <div className="balance-card__chart" aria-hidden="true">
     <span />
     <span />
     <span />
     <span />
     <span />
   </div>
 </div>
);

const TransactionForm = ({ description, setDescription, transactionAmount, setTransactionAmount, transactionType, setTransactionType, onSubmit }) => (
 <form className="transaction-form" onSubmit={onSubmit}>
   <div className="transaction-form__field">
     <label htmlFor="description">Description</label>
     <input
       id="description"
       type="text"
       placeholder="Enter description..."
       value={description}
       onChange={(e) => setDescription(e.target.value)}
       required
     />
   </div>

   <div className="transaction-form__field">
     <label htmlFor="amount">Amount</label>
     <input
       id="amount"
       type="number"
       min="0"
       step="0.01"
       value={transactionAmount}
       onChange={(e) => setTransactionAmount(Number(e.target.value) || 0)}
       required
     />
   </div>

   <div className="transaction-form__type">
     <button
       type="button"
       className={`type-toggle ${transactionType === "income" ? "type-toggle--active type-toggle--income" : ""}`}
       onClick={() => setTransactionType("income")}
     >
       Income
     </button>
     <button
       type="button"
       className={`type-toggle ${transactionType === "expense" ? "type-toggle--active type-toggle--expense" : ""}`}
       onClick={() => setTransactionType("expense")}
     >
       Expense
     </button>
   </div>

   <button type="submit" className="submit-button">
     <span>+</span> Add Transaction
   </button>
 </form>
);

const TransactionItem = ({ transaction }) => {
 const isIncome = transaction.transactionType === "income";

 return (
   <li className="transaction-item">
     <div className="transaction-item__main">
       <div className={`transaction-item__icon transaction-item__icon--${transaction.transactionType}`}>
         {isIncome ? "↗" : "↘"}
       </div>
       <div className="transaction-item__details">
         <h4>{transaction.description}</h4>
         <span className={`transaction-item__type transaction-item__type--${transaction.transactionType}`}>
           {transaction.transactionType}
         </span>
       </div>
     </div>

     <div className="transaction-item__meta">
       <span className={`transaction-item__amount ${isIncome ? "transaction-item__amount--income" : "transaction-item__amount--expense"}`}>
         {isIncome ? "+" : "-"}
         {formatCurrency(transaction.transactionAmount)}
       </span>
       <span className="transaction-item__date">{formatDate(transaction.createdAt)}</span>
     </div>

     <button type="button" className="transaction-item__menu" aria-label="Transaction actions">
       <Icon name="dots" />
     </button>
   </li>
 );
};

const TransactionList = ({ transactions }) => {
 if (transactions.length === 0) {
   return (
     <div className="empty-state">
       <div className="empty-state__icon">💸</div>
       <h4>No transactions yet</h4>
       <p>Start tracking your money by adding your first transaction.</p>
       <button type="button" className="empty-state__button">Add Transaction</button>
     </div>
   );
 }

 return (
   <ul className="transaction-list">
     {transactions.map((transaction) => (
       <TransactionItem key={transaction.id} transaction={transaction} />
     ))}
   </ul>
 );
};

export const ExpenseTracker = () => {
 const { addTransaction } = useAddTransaction();
 const { transactions, transactionTotals } = useGetTransactions();
 const { name, profilePhoto } = useGetUserInfo();
 const navigate = useNavigate();

 const [description, setDescription] = useState("");
 const [transactionAmount, setTransactionAmount] = useState(0);
 const [transactionType, setTransactionType] = useState("expense");
 const [searchTerm, setSearchTerm] = useState("");
 const [filterType, setFilterType] = useState("all");
 const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

 const { balance, expense, income } = transactionTotals;
 const profileName = auth.currentUser?.displayName || (name && name !== "Guest" ? name : "Sonita Chheng");
 const profileAvatar = auth.currentUser?.photoURL || profilePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80";
 const today = new Date().toLocaleDateString(undefined, {
   month: "short",
   day: "numeric",
   year: "numeric",
 });

 const filteredTransactions = useMemo(() => {
   return transactions.filter((transaction) => {
     const searchMatch = transaction.description
       .toLowerCase()
       .includes(searchTerm.toLowerCase());

     const filterMatch = filterType === "all" || transaction.transactionType === filterType;

     return searchMatch && filterMatch;
   });
 }, [transactions, searchTerm, filterType]);

 const onSubmit = (e) => {
   e.preventDefault();

   const trimmedDescription = description.trim();
   if (!trimmedDescription) {
     return;
   }

   addTransaction(trimmedDescription, transactionAmount, transactionType);
   setDescription("");
   setTransactionAmount(0);
   setTransactionType("expense");
 };

 const signUserOut = async () => {
   try {
     await signOut(auth);
     localStorage.removeItem("auth");
     navigate("/");
   } catch (error) {
     console.error("Error signing out: ", error);
   }
 };

 return (
   <div className="finance-shell">
     <Sidebar
       profilePhoto={profilePhoto}
       profileName={profileName}
       onSignOut={signUserOut}
       isMobileOpen={mobileSidebarOpen}
       onClose={() => setMobileSidebarOpen(false)}
     />

     <div className="main-panel">
       <Header
         profilePhoto={profilePhoto}
         profileName={profileName}
         today={today}
         onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)}
       />

       <main className="dashboard-content">
         <section className="summary-grid">
           <BalanceCard balance={balance} />
           <SummaryCard title="Income" amount={income} accent="income" iconName="arrow-up" />
           <SummaryCard title="Expenses" amount={expense} accent="expense" iconName="arrow-down" />
         </section>

         <section className="panel-grid">
           <div className="panel">
             <div className="panel__header">
               <h3>Add New Transaction</h3>
             </div>
             <TransactionForm
               description={description}
               setDescription={setDescription}
               transactionAmount={transactionAmount}
               setTransactionAmount={setTransactionAmount}
               transactionType={transactionType}
               setTransactionType={setTransactionType}
               onSubmit={onSubmit}
             />
           </div>

           <div className="panel panel--wide">
             <div className="panel__header panel__header--stacked">
               <h3>Recent Transactions</h3>
               <div className="panel__controls">
                 <div className="search-box">
                   <Icon name="search" className="search-box__icon" />
                   <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search transactions..."
                   />
                 </div>

                 <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                   <option value="all">All</option>
                   <option value="income">Income</option>
                   <option value="expense">Expense</option>
                 </select>
               </div>
             </div>

             <TransactionList transactions={filteredTransactions} />
           </div>
         </section>
       </main>
     </div>
   </div>
 );
};