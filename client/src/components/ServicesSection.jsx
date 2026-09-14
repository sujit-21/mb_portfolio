import React from 'react';

export default function ServicesSection({ services }) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="section services-section">
      <div className="section-tag">What I Do</div>
      <h2 className="section-title">Services</h2>

      <div className="services-grid">
        {services.map((svc) => (
          <div className="service-item" key={svc._id || svc.num}>
            <div className="service-num">{svc.num}</div>
            <div className="service-name">{svc.name}</div>
            <p className="service-desc">{svc.desc}</p>
            <div className="service-tools">
              {svc.tools?.map((tool, idx) => (
                <span className="tool-tag" key={idx}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
