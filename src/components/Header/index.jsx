import { auth } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./styles.css";

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
    case "menu":
      return (
        <svg {...commonProps}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "bell":
      return (
        <svg {...commonProps}>
          <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      );
    default:
      return null;
  }
};

export const Header = ({ onMenuToggle }) => {
  const { name, profilePhoto } = useGetUserInfo();
  const profileName = auth.currentUser?.displayName || (name && name !== "Guest" ? name : "Sonita Chheng");
  const profileAvatar = auth.currentUser?.photoURL || profilePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";
  const today = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
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
          src={profileAvatar}
          alt={profileName}
        />
      </div>
    </header>
  );
};
