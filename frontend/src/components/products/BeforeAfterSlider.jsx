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
    // Allow dragging on mouse move or touch move
    if (!isDragging && e.type !== 'click' && e.type !== 'touchstart') return;

    // Stop auto-animation when user interacts
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    const container = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || (e.changedTouches && e.changedTouches[0]?.clientX);
    if (clientX === undefined) return;
    
    const x = clientX - container.left;
    const percentage = Math.max(0, Math.min(100, (x / container.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl overflow-hidden">
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4 shadow-md">
          <i className="bi bi-arrow-left-right text-orange-600 text-sm md:text-base"></i>
          <span>Traditional vs AI-Powered</span>
        </div>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3 px-2">
          {title}
        </h3>
        <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-4 md:mb-6 px-2">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs md:text-sm font-semibold text-gray-700">{beforeLabel}</span>
          </div>
          <div className="text-gray-400 text-sm md:text-base">vs</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs md:text-sm font-semibold text-gray-700">{afterLabel}</span>
          </div>
        </div>
      </div>

      <div
        className="relative w-full max-w-4xl mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none touch-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        style={{ msOverflowStyle: 'none' }}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e);
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleMove(e);
        }}
        onTouchEnd={() => setIsDragging(false)}
        onClick={handleMove}
      >
        {/* Before Image (Right Side - Traditional Way) */}
        <div className="relative w-full h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] bg-gradient-to-br from-red-100 to-orange-100 overflow-hidden z-0">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
            <div className="text-center w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 animate-pulse">
                <i className="bi bi-x-circle text-white text-3xl sm:text-4xl md:text-5xl"></i>
              </div>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-900 mb-3 md:mb-4 px-2">
                {beforeTitle}
              </h4>
              <div className="space-y-2 sm:space-y-3 text-left max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
                {beforeItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-3">
                    <i className={`bi ${item.icon} text-red-600 text-xl sm:text-2xl flex-shrink-0 mt-0.5`}></i>
                    <span className="text-sm sm:text-base text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.text }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* After Image (Left Side - AI Scribe Way) */}
        <div
          className="absolute top-0 left-0 h-full w-full overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 z-10"
          style={{ 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden w-full">
            <div className="text-center w-full max-w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 animate-bounce flex-shrink-0">
                <i className="bi bi-check-circle text-white text-3xl sm:text-4xl md:text-5xl"></i>
              </div>
              <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900 mb-3 md:mb-4 px-2">
                {afterTitle}
              </h4>
              <div className="space-y-2 sm:space-y-3 text-left max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-4 sm:p-5 md:p-6 shadow-lg w-full">
                {afterItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-3 flex-shrink-0">
                    <i className={`bi ${item.icon} text-green-600 text-xl sm:text-2xl flex-shrink-0 mt-0.5`}></i>
                    <span className="text-sm sm:text-base text-gray-800 leading-relaxed flex-shrink-0" dangerouslySetInnerHTML={{ __html: item.text }}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 md:w-1 bg-white shadow-2xl z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 md:border-4 border-blue-500 pointer-events-auto cursor-ew-resize">
            <i className="bi bi-arrow-left-right text-blue-600 text-base md:text-xl font-bold"></i>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4 md:mt-6 px-4">
        <p className="text-xs sm:text-sm text-gray-600 font-medium">
          {hasUserInteracted ? (
            <>
              <i className="bi bi-hand-index-thumb mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Drag or click the slider to compare</span>
              <span className="sm:hidden">Drag to compare</span>
            </>
          ) : (
            <>
              <i className="bi bi-eye mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">Watch the automatic comparison • Click to take control</span>
              <span className="sm:hidden">Watch auto comparison • Tap to control</span>
            </>
          )}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-8 max-w-2xl mx-auto px-2">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">{beforeStat.value}</div>
          <div className="text-xs sm:text-sm text-gray-600 leading-tight">{beforeStat.label}</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{afterStat.value}</div>
          <div className="text-xs sm:text-sm text-gray-600 leading-tight">{afterStat.label}</div>
        </div>
      </div>
    </div>
  );
}

export default BeforeAfterSlider;
