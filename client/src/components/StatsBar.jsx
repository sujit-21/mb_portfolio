import React from 'react';

export default function StatsBar({ profile }) {
  const stats = [
    {
      num: profile?.experienceYears || '2+',
      label: 'Years Experience',
    },
    {
      num: profile?.projectsDelivered || '120+',
      label: 'Projects Delivered',
    },
    {
      num: profile?.viewsGenerated || '40M+',
      label: 'Views Generated',
    },
    {
      num: profile?.clientSatisfaction || '98%',
      label: 'Client Satisfaction',
    },
  ];

  return (
    <div className="stats-bar" aria-label="Professional Statistics">
      {stats.map((item, index) => (
        <div className="stat-item" key={index}>
          <div className="stat-num">{item.num}</div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
