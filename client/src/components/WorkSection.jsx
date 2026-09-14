import React, { useState } from 'react';

export default function WorkSection({ projects, onOpenVideo }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Brand Film', 'Documentary', 'Music Video', 'Commercial', 'Short Film'];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const renderSceneIcon = (gradientType) => {
    switch (gradientType) {
      case 'card-bg-1':
        return (
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
            <rect x="10" y="22" width="50" height="32" rx="2" stroke="#C9A84C" strokeOpacity="0.3" strokeWidth="1" />
            <polygon points="28,30 28,44 44,37" fill="#C9A84C" fillOpacity="0.25" />
            <rect x="10" y="56" width="14" height="6" rx="1" fill="#C9A84C" fillOpacity="0.12" />
            <circle cx="60" cy="12" r="6" stroke="#8B2E2E" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="56" y1="8" x2="64" y2="16" stroke="#8B2E2E" strokeOpacity="0.4" strokeWidth="1" />
            <line x1="64" y1="8" x2="56" y2="16" stroke="#8B2E2E" strokeOpacity="0.4" strokeWidth="1" />
          </svg>
        );
      case 'card-bg-2':
        return (
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="20" stroke="#5DCAA5" strokeOpacity="0.2" strokeWidth="1" />
            <circle cx="30" cy="30" r="12" stroke="#5DCAA5" strokeOpacity="0.3" strokeWidth="1" />
            <circle cx="30" cy="30" r="4" fill="#5DCAA5" fillOpacity="0.4" />
            <line x1="30" y1="10" x2="30" y2="4" stroke="#5DCAA5" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="30" y1="56" x2="30" y2="50" stroke="#5DCAA5" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="10" y1="30" x2="4" y2="30" stroke="#5DCAA5" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="56" y1="30" x2="50" y2="30" stroke="#5DCAA5" strokeOpacity="0.3" strokeWidth="1" />
          </svg>
        );
      case 'card-bg-3':
        return (
          <svg width="55" height="55" viewBox="0 0 55 55" fill="none">
            <rect x="8" y="20" width="16" height="22" rx="1" stroke="#EF9F27" strokeOpacity="0.3" strokeWidth="1" />
            <rect x="28" y="14" width="16" height="28" rx="1" stroke="#EF9F27" strokeOpacity="0.4" strokeWidth="1" />
            <rect x="8" y="44" width="36" height="1" fill="#EF9F27" fillOpacity="0.2" />
          </svg>
        );
      case 'card-bg-4':
        return (
          <svg width="75" height="55" viewBox="0 0 75 55" fill="none">
            <rect x="5" y="15" width="65" height="28" rx="2" stroke="#AFA9EC" strokeOpacity="0.25" strokeWidth="1" />
            <line x1="5" y1="22" x2="70" y2="22" stroke="#AFA9EC" strokeOpacity="0.1" strokeWidth="0.5" />
            <rect x="10" y="26" width="10" height="10" rx="1" fill="#AFA9EC" fillOpacity="0.12" />
            <rect x="24" y="26" width="20" height="10" rx="1" fill="#AFA9EC" fillOpacity="0.08" />
            <rect x="48" y="26" width="15" height="10" rx="1" fill="#AFA9EC" fillOpacity="0.08" />
            <rect x="20" y="45" width="35" height="4" rx="1" fill="#AFA9EC" fillOpacity="0.1" />
          </svg>
        );
      default:
        return (
          <svg width="55" height="55" viewBox="0 0 55 55" fill="none">
            <path d="M10 40 Q20 10 27 28 Q34 42 45 15" stroke="#85B7EB" strokeOpacity="0.4" strokeWidth="1.5" fill="none" />
            <circle cx="10" cy="40" r="2.5" fill="#85B7EB" fillOpacity="0.3" />
            <circle cx="45" cy="15" r="2.5" fill="#85B7EB" fillOpacity="0.3" />
          </svg>
        );
    }
  };

  return (
    <section id="work" className="section work-section">
      <div className="work-header">
        <div>
          <div className="section-tag">Selected Work</div>
          <h2 className="section-title">Portfolio</h2>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="work-grid">
        {!projects || projects.length === 0 ? (
          <div
            style={{
              gridColumn: 'span 12',
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(201, 168, 76, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(201, 168, 76, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C9A84C',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 500, letterSpacing: '0.05em' }}>
              Selected Works Coming Soon
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: 0, fontSize: '0.88rem', lineHeight: '1.6' }}>
              Projects and showreels are currently being curated. Projects can be uploaded and managed directly via the Admin panel.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ gridColumn: 'span 12', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No projects found in this category.
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div
              key={proj._id || proj.title}
              className={`project-card ${proj.layoutSpan || 'medium'}`}
              onClick={() => onOpenVideo(proj.videoUrl || '', proj.title)}
            >
              <div className="card-thumb">
                <div className={`card-bg ${proj.gradientType || 'card-bg-1'}`}>
                  <div className="card-scene">
                    <div className="scene-lines" />
                    <div className="scene-icon">{renderSceneIcon(proj.gradientType)}</div>
                  </div>
                </div>
                <div className="card-play-overlay">
                  <div className="mini-play" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <polygon points="4,2 12,7 4,12" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="card-category">{proj.category}</div>
                <div className="card-title">{proj.title}</div>
                <div className="card-meta">
                  {proj.duration && (
                    <span className="meta-item">
                      <span className="meta-dot" />
                      {proj.duration}
                    </span>
                  )}
                  {proj.year && (
                    <span className="meta-item">
                      <span className="meta-dot" />
                      {proj.year}
                    </span>
                  )}
                  {proj.tag && (
                    <span className="meta-item">
                      <span className="meta-dot" />
                      {proj.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
