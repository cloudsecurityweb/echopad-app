import { useEffect, useRef } from 'react';

/**
 * Hook to handle scroll animations using Intersection Observer
 * @param {string} animationType - Type of animation (fade-up, fade-in, etc.)
 * @param {number} delay - Animation delay in milliseconds
 * @param {number} threshold - Intersection threshold (0-1)
 */
export function useAnimation(animationType = 'fade-up', delay = 0, threshold = 0.1) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [delay, threshold]);

  return elementRef;
}

/**
 * Hook to initialize all elements with data-animate attributes
 * Enhanced with support for modern animations
 */
export function useScrollAnimations() {
  useEffect(() => {
    const animatedElements = document.querySelectorAll('[data-animate], .animate-fade-up, .animate-fade-in-scale, .animate-slide-in-left, .animate-slide-in-right');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
            const animationType = entry.target.getAttribute('data-animate') || 'fade-up';
            
            // Support for both data-animate attributes and direct animation classes
            if (entry.target.hasAttribute('data-animate')) {
              setTimeout(() => {
                entry.target.classList.add('animate-in', `animate-${animationType}`);
              }, delay);
            } else {
              // For elements with direct animation classes, just add animate-in
              setTimeout(() => {
                entry.target.classList.add('animate-in');
              }, delay);
            }
            
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}

