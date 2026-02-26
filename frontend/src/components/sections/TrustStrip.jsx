function TrustStrip() {
  return (
    <section
      id="trust-strip"
      className="bg-gray-900 text-white py-2.5 px-4 border-b border-gray-700"
      aria-label="Trust and compliance"
    >
      <div className="container mx-auto flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm font-medium">
        <span className="inline-flex items-center gap-2">
          <i className="bi bi-shield-fill-check text-emerald-400" aria-hidden></i>
          HIPAA Compliant
        </span>
        <span className="text-gray-500 hidden sm:inline" aria-hidden>•</span>
        <span className="inline-flex items-center gap-2">
          <i className="bi bi-patch-check-fill text-cyan-400" aria-hidden></i>
          SOC 2 Type II Certified
        </span>
        <span className="text-gray-500 hidden sm:inline" aria-hidden>•</span>
        <span className="inline-flex items-center gap-2">
          <i className="bi bi-building text-white/80" aria-hidden></i>
          Trusted by <strong className="text-white">50+</strong> practices nationwide
        </span>
      </div>
    </section>
  );
}

export default TrustStrip;
