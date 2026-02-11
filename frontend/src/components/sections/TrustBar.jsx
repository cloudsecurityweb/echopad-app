function TrustBar() {
  return (
    <section id="trust-bar" className="py-8 md:py-10 2xl:py-12 3xl:py-14 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-14">
          <div className="flex items-center gap-2 md:gap-3 glass-card px-4 md:px-5 2xl:px-6 3xl:px-8 py-2 md:py-3 2xl:py-4 3xl:py-5 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-shield-fill-check text-green-500 text-xl md:text-2xl 2xl:text-3xl 3xl:text-4xl group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium text-sm md:text-base 2xl:text-lg 3xl:text-xl">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 glass-card px-4 md:px-5 2xl:px-6 3xl:px-8 py-2 md:py-3 2xl:py-4 3xl:py-5 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-patch-check-fill text-cyan-500 text-xl md:text-2xl 2xl:text-3xl 3xl:text-4xl group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium text-sm md:text-base 2xl:text-lg 3xl:text-xl">SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 glass-card px-4 md:px-5 2xl:px-6 3xl:px-8 py-2 md:py-3 2xl:py-4 3xl:py-5 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-hospital text-purple-500 text-xl md:text-2xl 2xl:text-3xl 3xl:text-4xl group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium text-sm md:text-base 2xl:text-lg 3xl:text-xl">Works with Epic, Cerner, Athena</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3 glass-card px-4 md:px-5 2xl:px-6 3xl:px-8 py-2 md:py-3 2xl:py-4 3xl:py-5 rounded-xl hover-scale group shadow-sm">
            <i className="bi bi-lock-fill text-pink-500 text-xl md:text-2xl 2xl:text-3xl 3xl:text-4xl group-hover:scale-110 transition-transform"></i>
            <span className="text-gray-800 font-medium text-sm md:text-base 2xl:text-lg 3xl:text-xl">Zero Data Retention</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBar;
