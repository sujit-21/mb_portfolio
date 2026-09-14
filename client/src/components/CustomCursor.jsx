import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let animId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mx}px`;
        cursorRef.current.style.top = `${my}px`;
      }
    };

    const animate = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(animate);

    const handleMouseEnter = () => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.width = '22px';
        cursorRef.current.style.height = '22px';
        ringRef.current.style.width = '56px';
        ringRef.current.style.height = '56px';
        ringRef.current.style.borderColor = '#C9A84C';
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.width = '10px';
        cursorRef.current.style.height = '10px';
        ringRef.current.style.width = '38px';
        ringRef.current.style.height = '38px';
      }
    };

    const attachHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, input, textarea, .project-card, .service-item, .hero-reel-frame, .filter-btn'
      );
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    attachHoverListeners();
    const interval = setInterval(attachHoverListeners, 1500);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} aria-hidden="true" />
      <div id="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
