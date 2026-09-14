import React from 'react';

export default function Hero({ profile, onOpenVideo }) {
  const rawTagline = profile?.heroTagline || 'Video Editor';
  const tagline = rawTagline.replace(/\s*&\s*colorist/gi, '').trim() || 'Video Editor';
  const heading = profile?.heroHeading || {
    part1: 'Craft the',
    highlight: 'Perfect',
    part2: 'Frame.',
  };
  const oldDefaultSubtext =
    'Cinematic storytelling for brands, films, and creators who refuse to blend in. Every cut is intentional. Every moment counts.';
  const newSubtext =
    'I transform raw footage into compelling cinematic narratives. With over 2 years of experience in commercial, documentary, and creative video editing.';
  const subtext =
    !profile?.heroSubtext || profile.heroSubtext.trim() === oldDefaultSubtext.trim()
      ? newSubtext
      : profile.heroSubtext;
  const showreelLabel = profile?.showreelLabel || 'Play Showreel';
  const showreelUrl = profile?.showreelVideoUrl || '';

  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-tag">{tagline}</div>
        <h1 className="hero-title">
          {heading.part1}
          <br />
          <span>{heading.highlight}</span>
          {heading.part2}
        </h1>
        <p className="hero-sub">{subtext}</p>
        <div className="hero-cta">
          <a href="#work" className="btn-primary">
            View My Work
          </a>
          <a href="#contact" className="btn-ghost">
            <span>Start a Project</span>
            <span className="arrow-symbol">→</span>
          </a>
        </div>
      </div>

      <div className="hero-right">
        {/* Film strip left decor */}
        <div className="hero-filmstrip-decor" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="fhole" />
          ))}
        </div>

        {/* Interactive Showreel Preview Frame */}
        <div
          className="hero-reel-frame"
          onClick={() => onOpenVideo(showreelUrl, showreelLabel)}
          title="Click to play full showreel"
        >
          <div className="hero-reel-placeholder">
            <div className="play-btn" aria-label="Play showreel">
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <polygon points="6,3 15,9 6,15" fill="currentColor" />
              </svg>
            </div>
            <div className="reel-label">
              <span>▶</span> {showreelLabel}
            </div>
          </div>

          {/* Film strip right on frame */}
          <div className="filmstrip" aria-hidden="true">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="filmstrip-hole" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
