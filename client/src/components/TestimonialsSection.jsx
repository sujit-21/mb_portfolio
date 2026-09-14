import React from 'react';

export default function TestimonialsSection({ testimonials }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section testimonials-section">
      <div className="section-tag">Kind Words</div>
      <h2 className="section-title">Client Feedback</h2>

      <div className="testimonials-grid">
        {testimonials.map((t) => (
          <div className="testimonial-card" key={t._id || t.author}>
            <div className="quote-mark">“</div>
            <p className="testimonial-text">{t.quote}</p>
            <div className="testimonial-author">
              <div className="author-avatar">{t.initials}</div>
              <div>
                <div className="author-name">{t.author}</div>
                <div className="author-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
