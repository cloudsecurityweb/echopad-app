import React, { useRef } from 'react';
import { Circle } from './Circle';
import { AnimatedBeam } from './AnimatedBeam';

function HospitalIcon({ className }) {
  return (
    <svg
      className={className || ''}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 6v4" />
      <path d="M14 14h-4" />
      <path d="M14 18h-4" />
      <path d="M14 8h-4" />
      <path d="M18 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2Z" />
      <path d="M18 2v4" />
      <path d="M6 2v4" />
    </svg>
  );
}

export function ReferralWorkflowBeam() {
  const containerRef = useRef(null);
  const referringRef = useRef(null);
  const receivingRef = useRef(null);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" aria-labelledby="workflow-heading">
      <div className="container mx-auto px-4">
        <h2 id="workflow-heading" className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
          Referral workflow between practices
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-xl mx-auto">
          Aperio connects referring and receiving sites so referrals move smoothly—send, acknowledge, accept, and close.
        </p>

        <div
          className="relative flex w-full max-w-[500px] mx-auto items-center justify-center overflow-hidden rounded-2xl border-2 border-blue-100 bg-white p-10 shadow-lg"
          ref={containerRef}
        >
          <div className="flex size-full flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center gap-2">
              <Circle ref={referringRef} className="border-blue-300 bg-blue-50">
                <HospitalIcon className="text-blue-600 w-6 h-6" />
              </Circle>
              <span className="text-xs font-semibold text-gray-700 text-center">Referring practice</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Circle ref={receivingRef} className="border-purple-300 bg-purple-50">
                <HospitalIcon className="text-purple-600 w-6 h-6" />
              </Circle>
              <span className="text-xs font-semibold text-gray-700 text-center">Receiving practice</span>
            </div>
          </div>

          <AnimatedBeam
            containerRef={containerRef}
            fromRef={referringRef}
            toRef={receivingRef}
            controlYOffset={-40}
            duration={2.5}
            gradientId="aperio-beam-1"
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={referringRef}
            toRef={receivingRef}
            controlYOffset={40}
            reverse
            duration={2.5}
            gradientId="aperio-beam-2"
          />
        </div>
      </div>
    </section>
  );
}
