import React, { useState, useEffect } from 'react';

const IntroAnimation = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [stage, setStage] = useState(0); // 0: initial, 1: pulsating, 2: zoom in
  const [typedText, setTypedText] = useState('');
  const fullText = 'CurbsideCuisine';

  useEffect(() => {
    // Ensure we start at the top
    window.scrollTo(0, 0);
    
    // Stage 1: Start pulsating
    const stage1Timer = setTimeout(() => {
      setStage(1);
    }, 100);

    // Typing animation - starts after a brief delay
    let typingIndex = 0;
    const typingTimer = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (typingIndex < fullText.length) {
          setTypedText(fullText.slice(0, typingIndex + 1));
          typingIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100); // Type each character every 100ms
      
      return () => clearInterval(typingInterval);
    }, 500); // Start typing after 500ms

    // Stage 2: Zoom into the hole
    const stage2Timer = setTimeout(() => {
      setStage(2);
    }, 3000);

    // Stage 3: Complete animation
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setAnimationComplete(true);
        // Ensure we end at the top of the page
        window.scrollTo(0, 0);
        onComplete();
      }, 800);
    }, 4000);

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(typingTimer);
      clearTimeout(stage2Timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (animationComplete) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-[9999] overflow-hidden`}>
      {/* Dark overlay that fades as we zoom */}
      <div className={`absolute inset-0 bg-slate-900 transition-opacity duration-1000 ${
        stage >= 2 ? 'opacity-0' : 'opacity-100'
      }`}></div>
      
      {/* Circle hole with logo - zooms in and becomes transparent */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in ${
        stage >= 2 ? 'scale-[20]' : 'scale-100'
      }`}>
        <div className={`relative ${
          stage >= 1 ? 'animate-pulse-circle' : ''
        }`}>
          {/* Pulsating rings - 3 rings with different delays */}
          <div className={`absolute inset-0 -m-16 rounded-full border-4 border-sky-400/40 animate-ping-ring-1 transition-opacity duration-500 ${
            stage >= 2 ? 'opacity-0' : 'opacity-100'
          }`}></div>
          <div className={`absolute inset-0 -m-12 rounded-full border-4 border-sky-400/60 animate-ping-ring-2 transition-opacity duration-500 ${
            stage >= 2 ? 'opacity-0' : 'opacity-100'
          }`}></div>
          <div className={`absolute inset-0 -m-8 rounded-full border-4 border-sky-500/80 animate-ping-ring-3 transition-opacity duration-500 ${
            stage >= 2 ? 'opacity-0' : 'opacity-100'
          }`}></div>
          
          {/* Glowing rings - fade out when zooming */}
          <div className={`absolute inset-0 -m-4 rounded-full bg-sky-400/20 blur-lg transition-opacity duration-500 ${
            stage >= 2 ? 'opacity-0' : 'opacity-100'
          }`}></div>
          
          {/* Circle hole - becomes transparent when zooming */}
          <div className={`relative w-64 h-64 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-8 transition-all duration-700 ${
            stage >= 2 ? 'bg-transparent border-transparent' : 'bg-white border-white'
          }`}>
            {/* Logo - fades out when zooming */}
            <div className={`transition-opacity duration-300 ${
              stage >= 2 ? 'opacity-0' : 'opacity-100'
            }`}>
              <img 
                src="/images/CurbsideLogo.png" 
                alt="Curbside Cuisine Logo" 
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>
          
          {/* Brand name */}
          <div className={`absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-500 ${
            stage >= 1 && stage < 2 ? 'opacity-100' : 'opacity-0'
          }`}>
            <h1 className="text-5xl font-black text-white tracking-wider">
              {typedText.slice(0, 8)}
              <span className="text-sky-400">{typedText.slice(8)}</span>
              <span className="animate-blink">|</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;
