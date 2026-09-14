import React from 'react';

export default function AboutSection({ profile }) {
  const name = profile?.name || 'Manish';
  const tagline = profile?.aboutTagline || 'The Craft Behind the Cut';
  const bio1 =
    profile?.aboutBio1 ||
    "I'm Manish, a freelance video editor based in Mumbai, working with brands, filmmakers, and content creators to bring stories to life. I started in broadcast television, cut my teeth on documentary series, and now work across commercial, narrative, and digital formats.";
  const bio2 =
    profile?.aboutBio2 ||
    'My approach is simple: understand the story first, then find the edit. Good editing is invisible — you feel it before you see it. I work closely with clients from rough cut to final delivery, making sure every frame earns its place.';
  const skills = profile?.skills || [
    'Adobe Premiere Pro',
    'DaVinci Resolve Studio',
    'After Effects',
    'Final Cut Pro X',
    'Narrative Editing',
    'Broadcast Standards',
    'Remote Collaboration',
    'Multi-cam Editing',
  ];

  return (
    <section id="about" className="section about-section">
      <div className="about-visual">
        <div className="about-frame">
          {profile?.profilePicture && profile.profilePicture.trim() !== '' && profile.profilePicture !== 'none' ? (
            <div className="about-photo-wrapper">
              <img
                src={profile.profilePicture}
                alt={name}
                className="about-profile-img"
              />
              <div className="about-photo-overlay" />
            </div>
          ) : (
            <div className="about-frame-inner">
              {name.toUpperCase()}<br />BHAGAT
            </div>
          )}
          <div className="about-corner tl" />
          <div className="about-corner tr" />
          <div className="about-corner bl" />
          <div className="about-corner br" />
        </div>
        <div className="about-badge">
          <div className="badge-num">{profile?.experienceYears || '2+'}</div>
          <div className="badge-label">Years<br />in the Cut</div>
        </div>
      </div>

      <div className="about-content">
        <div className="section-tag">About Me</div>
        <h2 className="section-title">{tagline}</h2>
        <p className="about-text">{bio1}</p>
        <p className="about-text">{bio2}</p>

        <div className="skills-list">
          {skills.map((skill, idx) => (
            <span className="skill-line" key={idx}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
