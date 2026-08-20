import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { auth } from "../../config/firebase-config";
import { useTheme } from "../../context/ThemeContext";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./styles.css";

export const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { name, profilePhoto } = useGetUserInfo();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const parsedAuth = (() => {
    try { return JSON.parse(localStorage.getItem("auth") || "null"); } catch { return null; }
  })();
  const currentUserEmail = auth.currentUser?.email || parsedAuth?.email || "sonita@example.com";
  const profileName = auth.currentUser?.displayName || (name && name !== "Guest" ? name : "Sonita Chheng");
  const profileAvatar = auth.currentUser?.photoURL || profilePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80";

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
    <div className="page-shell">
      <Sidebar isMobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="content-shell">
        <Header onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />

        <main className="page-content">
          <section className="settings-header">
            <h2>Settings</h2>
          </section>

          <section className="settings-grid">
            <article className="settings-card">
              <div className="settings-card__header">
                <h3>Profile</h3>
              </div>

              <div className="profile-box">
                <img
                  src={profileAvatar}
                  alt="Profile"
                />
                <div>
                  <strong>{profileName}</strong>
                  <span>{currentUserEmail}</span>
                </div>
              </div>
            </article>

            <article className="settings-card">
              <div className="settings-card__header">
                <h3>Appearance</h3>
              </div>

              <div className="settings-options">
                <label className="toggle-row">
                  <span>Light Mode</span>
                  <input type="radio" name="theme" checked={theme === "light"} onChange={() => setTheme("light")} />
                </label>
                <label className="toggle-row">
                  <span>Dark Mode</span>
                  <input type="radio" name="theme" checked={theme === "dark"} onChange={() => setTheme("dark")} />
                </label>
              </div>
            </article>

            <article className="settings-card">
              <div className="settings-card__header">
                <h3>Currency</h3>
              </div>
              <div className="currency-pill">USD ($)</div>
            </article>

            <article className="settings-card">
              <div className="settings-card__header">
                <h3>Account</h3>
              </div>
              <button type="button" className="settings-signout" onClick={signUserOut}>
                Sign Out
              </button>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};
