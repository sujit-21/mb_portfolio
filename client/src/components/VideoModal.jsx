import React, { useEffect } from 'react';

function formatEmbedUrl(url) {
  if (!url) return '';
  try {
    const trimmed = url.trim();
    if (trimmed.includes('youtube.com/watch?v=')) {
      const videoId = trimmed.split('watch?v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : trimmed;
    }
    if (trimmed.includes('youtu.be/')) {
      const videoId = trimmed.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : trimmed;
    }
    if (trimmed.includes('youtube.com/embed/')) {
      return trimmed.includes('?') ? trimmed : `${trimmed}?autoplay=1&rel=0`;
    }
    if (trimmed.includes('vimeo.com/') && !trimmed.includes('player.vimeo.com')) {
      const vimeoId = trimmed.split('vimeo.com/')[1]?.split('?')[0];
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1` : trimmed;
    }
    return trimmed;
  } catch {
    return url;
  }
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const embedSrc = formatEmbedUrl(videoUrl);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title || 'Video Player'}</div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-video-wrapper">
          {embedSrc ? (
            <iframe
              src={embedSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              style={{
                height: '100%',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0d0d11',
                padding: '2rem',
                textAlign: 'center',
                gap: '0.8rem',
              }}
            >
              <div style={{ fontSize: '2.5rem', color: '#C9A84C' }}>🎬</div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 500 }}>
                No Video URL Configured
              </h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '380px', margin: 0, fontSize: '0.88rem', lineHeight: '1.6' }}>
                You can attach a YouTube or Vimeo link anytime directly via the Admin panel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
