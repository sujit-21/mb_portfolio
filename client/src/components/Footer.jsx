import React from 'react';

export default function Footer({ profile }) {
  const name = profile?.name || 'Manish';
  const year = new Date().getFullYear();

  const defaultSocialLinks = [
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    {
      name: 'WhatsApp',
      url: "https://api.whatsapp.com/send?phone=+918102951819&text=Hello,%20I'm%20interested%20in%20your%20services",
    },
    { name: 'Youtube', url: 'https://youtube.com' },
  ];

  const socialLinks =
    profile?.socialLinks && profile.socialLinks.length > 0
      ? profile.socialLinks
      : defaultSocialLinks;

  return (
    <footer>
      <a href="#" className="footer-logo">
        {name}&nbsp;BHAGAT
      </a>
      <span className="footer-copy">
        © {year} {name} — All rights reserved
      </span>
      <div className="footer-socials">
        {socialLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            {link.name}
          </a>
        ))}
      </div>
    </footer>
  );
}
