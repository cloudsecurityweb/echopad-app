import { useState, useEffect, useRef } from 'react';

function BeforeAfterSlider({ 
  title = "The Old Way vs The EchoPad Way",
  subtitle = "Compare how providers documented before AI Scribe to how they do it now",
  beforeLabel = "Without EchoPad",
  afterLabel = "With EchoPad AI Scribe",
  beforeTitle = "❌ Traditional Way",
  afterTitle = "✅ With AI Scribe",
  beforeItems = [
    { icon: 'bi-clock', text: '<strong>15-20 minutes</strong> per patient note' },
    { icon: 'bi-keyboard', text: 'Manual typing after each visit' },
    { icon: 'bi-hourglass', text: 'Stay late to catch up on charts' },
    { icon: 'bi-emoji-frown', text: 'Provider burnout & fatigue' }
  ],
  afterItems = [
    { icon: 'bi-lightning-charge-fill', text: '<strong>30 seconds</strong> per patient note' },
    { icon: 'bi-mic-fill', text: 'Speak naturally during visit' },
    { icon: 'bi-house-check', text: 'Leave on time, every day' },
    { icon: 'bi-emoji-smile', text: 'Happy providers & patients' }
  ],
  beforeStat = { value: '15-20 min', label: 'Traditional charting time' },
  afterStat = { value: '30 sec', label: 'With AI Scribe' }
}) {
  const [sliderPosition, setSliderPosition] = useState(0); // Start with old way (0%)
  const [isDragging, setIsDragging] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const animationRef = useRef(null);

  // Auto-animate slider from 0% to 100% if user hasn't interacted
  useEffect(() => {
    if (!hasUserInteracted) {
      let startTime = null;
      const duration = 3000; // 3 seconds to slide from old to new
      const startDelay = 500; // Wait 500ms before starting

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < startDelay) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }

        const adjustedElapsed = elapsed - startDelay;
        const progress = Math.min(adjustedElapsed / duration, 1);
        
        // Ease-in-out function for smooth animation
        const easeInOutQuad = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        setSliderPosition(easeInOutQuad * 100);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // After reaching 100%, wait 1 second, then slide back to 0%
          setTimeout(() => {
            let resetStartTime = null;
            const resetAnimate = (timestamp) => {
              if (!resetStartTime) resetStartTime = timestamp;
              const resetElapsed = timestamp - resetStartTime;
              const resetProgress = Math.min(resetElapsed / duration, 1);
              
              const easeInOutQuad = resetProgress < 0.5
                ? 2 * resetProgress * resetProgress
                : 1 - Math.pow(-2 * resetProgress + 2, 2) / 2;

              setSliderPosition(100 - (easeInOutQuad * 100));

              if (resetProgress < 1) {
                animationRef.current = requestAnimationFrame(resetAnimate);
              } else {
                // Wait 1 second at 0%, then restart
                setTimeout(() => {
                  if (!hasUserInteracted) {
                    startTime = null;
                    animationRef.current = requestAnimationFrame(animate);
                  }
                }, 1000);
              }
            };
            
            if (!hasUserInteracted) {
              animationRef.current = requestAnimationFrame(resetAnimate);
            }
          }, 1000);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [hasUserInteracted]);

  const handleMove = (e) => {
    if (!isDragging && e.type !== 'click') return;

    // Stop auto-animation when user interacts
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    const container = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - container.left;
    const percentage = Math.max(0, Math.min(100, (x / container.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 shadow-2xl overflow-hidden">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-5 py-2 rounded-full text-sm font-semibold mb-4 shadow-md">
          <i className="bi bi-arrow-left-right text-orange-600"></i>
          Traditional vs AI-Powered
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-lg text-gray-600 mb-4">
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">{beforeLabel}</span>
          </div>
          <div className="text-gray-400">vs</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">{afterLabel}</span>
          </div>
        </div>
      </div>

      <div
        className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none touch-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        style={{ msOverflowStyle: 'none' }}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onClick={handleMove}
      >
        {/* Before Image (Right Side - Traditional Way) */}
        <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-br from-red-100 to-orange-100 overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 overflow-hidden">
            <div className="text-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <i className="bi bi-x-circle text-white text-5xl"></i>
              </div>
              <h4 className="text-2xl md:text-3xl font-bold text-red-900 mb-4">
                {beforeTitle}
              </h4>
              <div className="space-y-3 text-left max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                {beforeItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <i className={`bi ${item.icon} text-red-600 text-2xl`}></i>
                    <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: item.text }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* After Image (Left Side - AI Scribe Way) */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 overflow-hidden">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <i className="bi bi-check-circle text-white text-5xl"></i>
              </div>
              <h4 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">
                {afterTitle}
              </h4>
              <div className="space-y-3 text-left max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                {afterItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <i className={`bi ${item.icon} text-green-600 text-2xl`}></i>
                    <span className="text-gray-800" dangerouslySetInnerHTML={{ __html: item.text }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-blue-500">
            <i className="bi bi-arrow-left-right text-blue-600 text-xl font-bold"></i>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 font-medium">
          {hasUserInteracted ? (
            <>
              <i className="bi bi-hand-index-thumb mr-2"></i>
              Drag or click the slider to compare
            </>
          ) : (
            <>
              <i className="bi bi-eye mr-2"></i>
              Watch the automatic comparison • Click to take control
            </>
          )}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-600 mb-1">{beforeStat.value}</div>
          <div className="text-sm text-gray-600">{beforeStat.label}</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{afterStat.value}</div>
          <div className="text-sm text-gray-600">{afterStat.label}</div>
        </div>
      </div>
    </div>
  );
}

export default BeforeAfterSlider;
