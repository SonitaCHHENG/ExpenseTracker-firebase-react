import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./styles.css";

const navItems = [
  { label: "Dashboard", path: "/expense-tracker", icon: "home" },
  { label: "Transactions", path: "/transactions", icon: "credit" },
  { label: "Add Transaction", path: "/add-transaction", icon: "plus" },
  { label: "Analytics", path: "/analytics", icon: "chart" },
  { label: "Settings", path: "/settings", icon: "settings" },
];

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

    case "logout":
      return (
        <svg {...commonProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );

    default:
      return null;
  }
};

export const Sidebar = ({
  isMobileOpen = false,
  onClose = () => {},
}) => {
  const { name, profilePhoto } = useGetUserInfo();

  const location = useLocation();
  const navigate = useNavigate();

  const profileName =
    auth.currentUser?.displayName ||
    (name && name !== "Guest" ? name : "Sonita Chheng");

  const profileAvatar =
    auth.currentUser?.photoURL || profilePhoto;

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
    <>
      <div
        className={`sidebar-overlay ${
          isMobileOpen ? "sidebar-overlay--visible" : ""
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${
          isMobileOpen ? "sidebar--open" : ""
        }`}
      >
        <div className="sidebar__profile-block">
          <div className="sidebar__profile">
            {profileAvatar && (
              <img
                src={profileAvatar}
                alt="User avatar"
              />
            )}

            <div className="sidebar__identity">
              <h2>{profileName}</h2>
              <span>Personal Account</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar__logout"
            onClick={signUserOut}
          >
            <Icon
              name="logout"
              className="sidebar__logout-icon"
            />
            <span>Sign Out</span>
          </button>
        </div>

        <nav
          className="sidebar__nav"
          aria-label="Sidebar navigation"
        >
          {navItems.map(({ label, path, icon }) => {
            const isActive = location.pathname === path;

            return (
              <Link
                key={label}
                to={path}
                className={`nav-item ${
                  isActive ? "nav-item--active" : ""
                }`}
                onClick={onClose}
              >
                <span className="nav-item__icon">
                  <Icon name={icon} />
                </span>

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};