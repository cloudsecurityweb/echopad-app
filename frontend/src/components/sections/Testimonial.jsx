import FullScreenSection from '../layout/FullScreenSection';

function Testimonial() {
  return (
    <FullScreenSection id="testimonial" className="bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6 pb-3 border-b border-gray-200 text-center">
            What Our Customers Say
          </h2>
          <blockquote className="border-l-4 border-gray-300 pl-6 md:pl-8 py-2">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
              AI Scribe
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              &ldquo;We cut charting time by over half. My team actually leaves on time now. Echopad fit into our workflow in under a month—no IT drama.&rdquo;
            </p>
            <footer className="text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">Dr. Sarah Chen</span>
              <span className="mx-1.5">·</span>
              <span>Family Medicine, Multi-Site Practice</span>
            </footer>
          </blockquote>
          <blockquote className="border-l-4 border-gray-300 pl-6 md:pl-8 py-2">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Aperio
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
              &ldquo;Before Aperio, we had no easy way to see which referrals were stuck. Now our team can spot issues in seconds and patients stop falling through the cracks. It&rsquo;s become our source of truth for care coordination.&rdquo;
            </p>
            <footer className="text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">Michael Reyes</span>
              <span className="mx-1.5">·</span>
              <span>Operations Director, Multi-Specialty Group</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </FullScreenSection>
  );
}

export default Testimonial;
