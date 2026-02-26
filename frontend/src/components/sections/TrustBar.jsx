function TrustBar() {
  const practiceLabels = [
    'Family Medicine',
    'Multi-Specialty Group',
    'Orthopedics',
    'Cardiology',
    'Pediatrics',
  ];

  return (
    <section id="trust-bar" className="py-4 md:py-6 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        {/* Trusted by practices + logos row */}
        <div className="flex flex-col items-center gap-4 mb-4 md:mb-5">
          <p className="text-sm font-semibold text-gray-600">
            Trusted by <span className="text-cyan-600 font-bold">50+</span> practices nationwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {practiceLabels.map((label, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 text-sm font-medium shadow-sm"
              >
                <i className="bi bi-building text-cyan-500"></i>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Trust signals */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-shield-fill-check text-green-500 text-lg group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium text-sm">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-patch-check-fill text-cyan-500 text-lg group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium text-sm">SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-hospital text-purple-500 text-lg group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium text-sm">Epic, Cerner, Athena</span>
          </div>
          <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-lock-fill text-pink-500 text-lg group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium text-sm">Zero Data Retention</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBar;
