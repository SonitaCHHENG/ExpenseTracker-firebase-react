import React, { useState } from "react";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, provider } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./styles.css";

const FeatureIcon = ({ children, className = "" }) => (
  <span className={`feature-icon ${className}`.trim()}>{children}</span>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="google-icon">
    <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-1.4 3.5-5.4 3.5-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 .1l2.7-2.7C16.6 3.2 14.5 2.4 12 2.4 6.9 2.4 2.8 6.6 2.8 11.7S6.9 20.9 12 20.9c7 0 11.5-4.9 11.5-11.8 0-.8-.1-1.4-.2-2.1H12Z" />
    <path fill="#4285F4" d="M3.8 7.3l3.6 2.6c1-1.9 3-3.2 5.6-3.2 1.9 0 3.2.8 4 .1l2.7-2.7C16.6 3.2 14.5 2.4 12 2.4 8 2.4 4.7 4.8 3.8 7.3Z" />
    <path fill="#FBBC05" d="M3.8 16.1A9.6 9.6 0 0 1 3.3 12c0-1 .2-2 .6-2.9l3.7 2.8A5.9 5.9 0 0 0 7.3 12c0 1.2.4 2.3 1.2 3.3l-4.7 3.4Z" />
    <path fill="#34A853" d="M12 20.9c2.5 0 4.6-.8 6.2-2.3l-2.9-2.5c-.8.6-1.9 1-3.3 1-2.6 0-4.8-1.8-5.5-4.2L.8 9.2A10.1 10.1 0 0 0 12 20.9Z" />
  </svg>
);

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();
  const firebaseUser = auth.currentUser;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const saveAuthAndRedirect = (user, displayName = null) => {
    const authInfo = {
      userID: user.uid,
      name: displayName || user.displayName || user.email,
      profilePhoto: user.photoURL || null,
      isAuth: true,
    };
    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/expense-tracker");
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        saveAuthAndRedirect(userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        saveAuthAndRedirect(userCredential.user);
      }
    } catch (err) {
      console.error("Authentication failed:", err.code, err.message);

      // Clean user-friendly error messages
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        alert("Invalid email or password. If you don't have an account yet, click 'Sign Up' below.");
      } else if (err.code === "auth/email-already-in-use") {
        alert("An account with this email already exists. Please Sign In instead.");
      } else if (err.code === "auth/weak-password") {
        alert("Password should be at least 6 characters long.");
      } else if (err.code === "auth/too-many-requests") {
        alert("Too many failed attempts. Please try again later.");
      } else {
        alert("Authentication failed. Please check your network or try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      saveAuthAndRedirect(result.user);
    } catch (err) {
      if (err?.code !== "auth/cancelled-popup-request" && err?.code !== "auth/popup-closed-by-user") {
        console.error("Google sign-in failed:", err);
        alert("Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isAuth || firebaseUser) {
    return <Navigate to="/expense-tracker" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <aside className="login-brand-panel" aria-label="Brand panel">
          <div className="login-brand-panel__badge">Finance</div>
          <h1>Expense Tracker</h1>
          <p>Manage your money easily</p>

          <div className="feature-list">
            <div className="feature-item">
              <FeatureIcon>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 18.5V8.5" />
                  <path d="M10 18.5V5.5" />
                  <path d="M16 18.5v-8" />
                  <path d="M22 18.5V3.5" />
                </svg>
              </FeatureIcon>
              <span>Track your income and expenses</span>
            </div>

            <div className="feature-item">
              <FeatureIcon>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3.8 5.4 6.8v6.4c0 4.2 2.8 7.8 6.6 9 3.8-1.2 6.6-4.8 6.6-9V6.8L12 3.8Z" />
                  <path d="m9.5 12 1.7 1.7 3.3-3.5" />
                </svg>
              </FeatureIcon>
              <span>Secure and private</span>
            </div>

            <div className="feature-item">
              <FeatureIcon>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="13" rx="2" />
                  <path d="M7 20h10" />
                  <path d="m9 9 2 2 4-4" />
                </svg>
              </FeatureIcon>
              <span>View financial analytics</span>
            </div>
          </div>
        </aside>

        <section className="login-card" aria-label="Login card">
          <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
          <p>{isSignUp ? "Sign up with your email to start" : "Sign in to continue"}</p>

          <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginBottom: "15px" }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <button type="submit" disabled={loading} style={{ padding: "10px", borderRadius: "6px", background: "#4f46e5", color: "#fff", border: "none", cursor: "pointer" }}>
              {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In with Email"}
            </button>
          </form>

          <p style={{ fontSize: "0.9rem", textAlign: "center", marginBottom: "15px" }}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: "#4f46e5", cursor: "pointer", fontWeight: "bold" }}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>

          <div style={{ textAlign: "center", margin: "10px 0", color: "#888" }}>OR</div>

          <button type="button" className="login-with-google-btn" onClick={signInWithGoogle} disabled={loading} aria-disabled={loading}>
            <GoogleIcon />
            <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
          </button>

          <div className="login-card__footer">Secure authentication powered by Firebase</div>
        </section>
      </div>
    </div>
  );
};