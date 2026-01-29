function TrustBar() {
  return (
    <section id="trust-bar" className="py-10 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-shield-fill-check text-green-500 text-2xl group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-patch-check-fill text-cyan-500 text-2xl group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium">SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-hospital text-purple-500 text-2xl group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium">Works with Epic, Cerner, Athena</span>
          </div>
          <div className="flex items-center gap-3 glass-card px-5 py-3 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-lock-fill text-pink-500 text-2xl group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium">Zero Data Retention</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBar;

