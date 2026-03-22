import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const scrollRaf = window.requestAnimationFrame(() => {
      if (hash) {
        const targetId = decodeURIComponent(hash.slice(1));
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ block: 'start' });
          return;
        }
      }

      window.scrollTo(0, 0);
    });

    const targets = Array.from(document.querySelectorAll('.reveal'));
    if (!targets.length) {
      return () => {
        window.cancelAnimationFrame(scrollRaf);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const raf = window.requestAnimationFrame(() => {
      targets.forEach((target) => observer.observe(target));
    });

    // Fallback: never leave content hidden if a route is captured without scroll.
    const timeout = window.setTimeout(() => {
      targets.forEach((target) => target.classList.add('visible'));
    }, 1400);

    return () => {
      window.cancelAnimationFrame(scrollRaf);
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
