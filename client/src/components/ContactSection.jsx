import React, { useState } from 'react';
import { API_BASE } from '../config/api';

export default function ContactSection({ profile, onMessageSent }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }

  const email = profile?.email || 'manish.edit@portfolio.dev';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        type: 'error',
        text: 'Please fill in your name, email, and message.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: 'success',
          text: '✓ Message Sent Successfully ! I Will Get Back To You As Soon As Possible.',
        });
        setFormData({
          name: '',
          email: '',
          projectType: '',
          message: '',
        });

        if (onMessageSent) {
          onMessageSent();
        }

        setTimeout(() => {
          setStatus(null);
        }, 6000);
      } else {
        throw new Error(data.error || 'Failed to submit message.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setStatus({
        type: 'error',
        text: err.message || 'Error submitting message. Please check the backend server.',
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultContactChannels = [
    {
      icon: 'mail',
      label: email,
      url: `mailto:${email}`,
    },
    {
      icon: 'instagram',
      label: '@manish.edit',
      url: 'https://instagram.com',
    },
    {
      icon: 'paperplane',
      label: 'Available on Contra & Upwork Enterprise',
      url: 'https://contra.com',
    },
  ];

  const channels =
    profile?.contactChannels && profile.contactChannels.length > 0
      ? profile.contactChannels
      : defaultContactChannels;

  const renderContactIcon = (iconType) => {
    switch (iconType) {
      case 'instagram':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="3" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="11" cy="5" r="0.7" fill="currentColor" />
          </svg>
        );
      case 'paperplane':
      case 'contra':
      case 'upwork':
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 12L6.5 7.5M14 4l-3.5 3.5M2 12l4-1L14 4M2 12l1-4L14 4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        );
      case 'whatsapp':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        );
      case 'link':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        );
      case 'mail':
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        );
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="contact-info">
        <div className="section-tag">Get in Touch</div>
        <h2 className="contact-title">Let's make something worth watching.</h2>
        <p className="contact-subtitle">
          Open for freelance projects, long-term collabs, and anything in between. Response time: usually within 24 hours.
        </p>

        <div className="contact-links">
          {channels.map((channel, idx) => {
            const hasUrl = Boolean(channel.url && channel.url.trim());
            const isExternal = hasUrl && channel.url.startsWith('http');
            const iconSvg = renderContactIcon(channel.icon);

            if (hasUrl) {
              return (
                <a
                  key={channel._id || idx}
                  href={channel.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="contact-link"
                >
                  <div className="contact-link-icon">{iconSvg}</div>
                  <span>{channel.label}</span>
                </a>
              );
            }

            return (
              <div key={channel._id || idx} className="contact-link">
                <div className="contact-link-icon">{iconSvg}</div>
                <span>{channel.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        {status && (
          <div className={`form-status ${status.type}`}>
            {status.text}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name *
            </label>
            <input
              className="form-input"
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email *
            </label>
            <input
              className="form-input"
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="projectType">
            Project Type
          </label>
          <input
            className="form-input"
            id="projectType"
            name="projectType"
            type="text"
            placeholder="e.g. Brand Film, Commercial, Music Video, Documentary..."
            value={formData.projectType}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">
            Message *
          </label>
          <textarea
            className="form-textarea"
            id="message"
            name="message"
            placeholder="Tell me about your project — timeline, budget, footage format, vibe..."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? (
            <span>Sending...</span>
          ) : (
            <>
              <span>Send Message</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
