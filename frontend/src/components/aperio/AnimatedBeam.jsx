import { useEffect, useState } from 'react';

/**
 * AnimatedBeam – draws an SVG path between two refs with optional curvature.
 * Uses stroke-dashoffset animation for the "beam" effect. No external deps.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  /** Vertical offset for control point: negative = upper arc, positive = lower arc */
  controlYOffset = 0,
  reverse = false,
  duration = 3,
  pathColor = '#94a3b8',
  pathWidth = 2,
  startYOffset = 0,
  endYOffset = 0,
  startXOffset = 0,
  endXOffset = 0,
  gradientId = 'beam-gradient',
}) {
  const [pathD, setPathD] = useState('');
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (!containerRef?.current || !fromRef?.current || !toRef?.current) return;

    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;

    const updatePath = () => {
      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();

      const fromCenterX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const fromCenterY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const toCenterX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const toCenterY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

      const midX = (fromCenterX + toCenterX) / 2;
      const midY = (fromCenterY + toCenterY) / 2;
      const dx = toCenterX - fromCenterX;
      const ctrlX = midX + curvature;
      const ctrlY = midY + (controlYOffset !== 0 ? controlYOffset : (Math.abs(dx) * 0.2 || 20));

      const d = `M ${fromCenterX},${fromCenterY} Q ${ctrlX},${ctrlY} ${toCenterX},${toCenterY}`;
      setPathD(d);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      setLength(path.getTotalLength());
    };

    updatePath();
    const ro = new ResizeObserver(updatePath);
    ro.observe(container);

    return () => ro.disconnect();
  }, [containerRef, fromRef, toRef, curvature, controlYOffset, startXOffset, endXOffset, startYOffset, endYOffset]);

  if (!pathD || length <= 0) return null;

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 h-full w-full"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length}
        style={{
          '--beam-length': length,
          animation: `animated-beam-draw ${duration}s ease-in-out infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      />
    </svg>
  );
}
