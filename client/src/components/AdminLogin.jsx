import React, { useState } from 'react';
import { API_BASE } from '../config/api';

export default function AdminLogin({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState(null);
  const [loadingForgot, setLoadingForgot] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Handle Remember Me persistence
        if (rememberMe) {
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          sessionStorage.removeItem('admin_token');
          sessionStorage.removeItem('admin_user');
        } else {
          sessionStorage.setItem('admin_token', data.token);
          sessionStorage.setItem('admin_user', JSON.stringify(data.user));
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
        }

        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Invalid credentials. Please verify username and password.');
      }
    } catch (err) {
      setError('Connection error: Could not connect to backend server. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = async () => {
    setShowForgotPassword(!showForgotPassword);
    if (!forgotPasswordData && !showForgotPassword) {
      setLoadingForgot(true);
      try {
        const res = await fetch(`${API_BASE}/auth/forgot-password`, { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          setForgotPasswordData(data);
        }
      } catch (err) {
        console.error('Failed to retrieve forgot password hint:', err);
      } finally {
        setLoadingForgot(false);
      }
    }
  };

  return (
    <div className="admin-login-overlay" onClick={onClose}>
      <div className="admin-login-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="admin-login-close"
          onClick={onClose}
          title="Return to Public Portfolio"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header Badge */}
        <div className="login-header-badge">
          <span className="login-lock-icon"></span>
          <span>ADMIN PANEL</span>
        </div>

        {/*<h2 className="login-title">Admin Panel</h2>*/}
        <p className="login-subtext">
          To unlock project management, client inquiries & Dashboard.
        </p>

        {/* Error Feedback */}
        {error && (
          <div className="login-error-banner">
            <span style={{ marginRight: '0.4rem' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username / Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="admin-username">
              Username or Email
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">👤</span>
              <input
                id="admin-username"
                className="form-input login-input"
                type="text"
                placeholder="e.g. manish or manish.edit@portfolio.dev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Master Password
            </label>
            <div className="login-input-wrap password-wrap">
              <span className="login-input-icon">🔑</span>
              <input
                id="admin-password"
                className="form-input login-input password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Options Row: Remember Me & Forgot Password */}
          <div className="login-options-row">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-me-checkbox"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password-trigger"
              onClick={handleForgotPasswordClick}
            >
              Forgot Password?
            </button>
          </div>

          {/* Expandable Forgot Password Box */}
          {showForgotPassword && (
            <div className="forgot-password-panel">
              <div className="forgot-header">
                <strong>🔒 Administrator Recovery Guidance</strong>
              </div>
              {loadingForgot ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Retrieving recovery instructions...</div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                  {forgotPasswordData?.message || 'Master credentials can be viewed and updated in server/.env file.'}
                  {forgotPasswordData?.adminEmail && (
                    <div style={{ marginTop: '0.4rem', color: 'var(--gold)' }}>
                      Contact: <code>{forgotPasswordData.adminEmail}</code>
                    </div>
                  )}
                  <div style={{ marginTop: '0.4rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    File path: <code>server/.env</code> &rarr; <code>ADMIN_PASSWORD</code>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="form-submit login-submit-btn"
            disabled={loading || !username || !password}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <span>LOGIN &rarr;</span>
            )}
          </button>
        </form>

        {/* Footer & Stealth Mode Hint */}
        <div className="login-card-footer">
          <button
            type="button"
            className="login-back-link"
            onClick={onClose}
          >
            &larr; Return to Public Portfolio
          </button>
          <div className="stealth-mode-hint">
            <span>⚡ Stealth Shortcut: </span>
            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
