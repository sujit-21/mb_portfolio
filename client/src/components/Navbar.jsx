import React from 'react';

export default function Navbar({ profile, servicesCount = 0, isAuthenticated = false, onOpenAdmin }) {
  const rawName = profile?.name?.trim();
  const name = (!rawName || rawName.toLowerCase() === 'manish')
    ? 'MANISH BHAGAT'
    : (rawName.toLowerCase().includes('bhagat') ? rawName.toUpperCase() : `${rawName.toUpperCase()} BHAGAT`);

  return (
    <nav>
      <a href="#" className="nav-logo">
        {name}
      </a>

      <ul className="nav-links">
        <li><a href="#work">Work</a></li>
        {servicesCount > 0 && <li><a href="#services">Services</a></li>}
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
        {isAuthenticated && (
          <li>
            <button 
              className="admin-trigger-btn" 
              onClick={onOpenAdmin}
              title="Open Studio Admin Console (Authenticated)"
            >
              <span className="status-dot" style={{ width: 6, height: 6, background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }} />
              <span>Admin Console</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
