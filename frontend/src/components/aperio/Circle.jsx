import React, { forwardRef } from 'react';

export const Circle = forwardRef(function Circle({ className = '', children }, ref) {
  return (
    <div
      ref={ref}
      className={
        'z-10 flex size-12 items-center justify-center rounded-full border-2 border-blue-200 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.25)] ' +
        (className || '')
      }
    >
      {children}
    </div>
  );
});
