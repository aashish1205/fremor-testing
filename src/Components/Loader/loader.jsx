import React, { useState, useEffect } from 'react';

const FremorLoader = ({ show }) => {
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(show);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [fadeFlight, setFadeFlight] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setIsFadingOut(false);
      setFadeFlight(false);
      setProgress(0);
    }
  }, [show]);

  useEffect(() => {
    if (!shouldRender) return;

    let intervalId;

    if (show) {
      // Simulate loading progress (crawls up to 96%)
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev < 60) {
            return prev + Math.random() * 2 + 1; // 1% to 3% increments
          } else if (prev < 85) {
            return prev + Math.random() * 1 + 0.5; // 0.5% to 1.5% increments
          } else if (prev < 96) {
            return prev + 0.15; // slow crawl
          } else {
            return prev; // hold at 96%
          }
        });
      }, 30);
    } else {
      // Complete loading (fast-forward to 100%)
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            const next = prev + Math.random() * 6 + 4; // 4% to 10% increments
            return next >= 100 ? 100 : next;
          } else {
            clearInterval(intervalId);
            return 100;
          }
        });
      }, 20);
    }

    return () => clearInterval(intervalId);
  }, [show, shouldRender]);

  useEffect(() => {
    if (progress === 100) {
      setFadeFlight(true);
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 500); // Wait 500ms for flight scene to fade out first
      
      const unmountTimer = setTimeout(() => {
        setShouldRender(false);
      }, 1400); // Wait another 900ms for the logo and container to fade out completely
      
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [progress]);

  if (!shouldRender) return null;

  return (
    <div className={`fremor-loader-container ${isFadingOut ? 'fade-out' : ''}`}>
      <style>{`
        :root {
          --primary-dark: #112b3c;
          --secondary-dark: #0f2534;
          --primary-light: #b8dfef;
          --secondary-light: #8ecae6;
          --airplane-size: 80px;
          --track-margin: calc(var(--airplane-size) / 2);
          --track-width: calc(100% - var(--airplane-size));
          --track-top: 80px;
        }

        @media (max-width: 600px) {
          :root {
            --airplane-size: 60px;
            --track-margin: calc(var(--airplane-size) / 2);
            --track-width: calc(100% - var(--airplane-size));
            --track-top: 50px;
          }
        }

        .fremor-loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: radial-gradient(circle at center, var(--primary-dark) 0%, var(--secondary-dark) 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999; /* Higher z-index to overlay headers */
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
        }

        .fremor-loader-container.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .bg-layer {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: radial-gradient(circle at 30% 40%, rgba(142, 202, 230, 0.03) 0%, transparent 60%);
          animation: bgPulse 10s infinite alternate ease-in-out;
          z-index: 0;
        }

        @keyframes bgPulse {
          0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          100% { transform: scale(1.1) rotate(5deg); opacity: 1; }
        }

        .radar-container {
          position: absolute;
          width: 600px;
          height: 600px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }

        .radar-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(142, 202, 230, 0.1);
          border-radius: 50%;
          animation: radarPulse 4s infinite ease-out;
        }

        .ring-1 { width: 100%; height: 100%; animation-delay: 0s; }
        .ring-2 { width: 70%; height: 70%; animation-delay: 1.5s; }

        @keyframes radarPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; }
        }

        .loader-content {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1000px;
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 35px;
        }

        .logo-wrapper {
          margin-bottom: 15px;
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
        }

        .logo-wrapper.fade-out {
          opacity: 0;
          transform: translateY(-15px);
        }

        .logo-img { 
          width: clamp(200px, 40vw, 350px);
          height: auto;
          filter: drop-shadow(0 0 30px rgba(184, 223, 239, 0.4));
        }

        .logo-tagline {
          font-size: clamp(0.7rem, 1.5vw, 1rem);
          letter-spacing: 6px;
          text-transform: uppercase;
          color: rgba(184, 223, 239, 0.5);
          margin-top: -5px;
          font-weight: 700;
        }

        .flight-scene {
          position: relative;
          width: 100%;
          height: 120px;
          max-width: 700px;
          overflow: hidden;
          margin: 0 auto;
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flight-scene.fade-out {
          opacity: 0;
          transform: translateY(15px);
        }

        .cloud {
          position: absolute;
          background: rgba(184, 223, 239, 0.08);
          border-radius: 50px;
          filter: blur(20px);
          z-index: 1;
        }
        .cloud-1 {
          width: 200px; height: 50px;
          top: 10px; left: -10%;
          animation: cloudMove 25s infinite linear;
        }
        .cloud-2 {
          width: 250px; height: 70px;
          bottom: 10px; left: 30%;
          animation: cloudMove 35s infinite linear 5s;
        }
        .cloud-3 {
          width: 150px; height: 40px;
          top: 30px; left: 60%;
          animation: cloudMove 20s infinite linear 10s;
          background: rgba(142, 202, 230, 0.05);
        }

        @keyframes cloudMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(150vw); }
        }

        .flight-track {
          position: absolute;
          top: var(--track-top);
          left: var(--track-margin);
          width: var(--track-width);
          height: 2px;
          background: rgba(184, 223, 239, 0.12);
          border-radius: 2px;
          z-index: 1;
        }

        .flight-trail {
          position: absolute;
          top: var(--track-top);
          left: var(--track-margin);
          height: 2px;
          background: linear-gradient(90deg, rgba(142, 202, 230, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%);
          border-radius: 2px;
          z-index: 3;
          transition: width 0.08s linear;
        }
        
        .flight-trail-glow {
          position: absolute;
          top: calc(var(--track-top) - 5px);
          left: var(--track-margin);
          height: 12px;
          background: linear-gradient(90deg, transparent 0%, rgba(142, 202, 230, 0.25) 100%);
          border-radius: 6px;
          filter: blur(4px);
          z-index: 2;
          transition: width 0.08s linear;
        }

        .airplane-wrapper {
          position: absolute;
          top: var(--track-top);
          width: var(--airplane-size);
          height: var(--airplane-size);
          margin-top: calc(var(--airplane-size) * -1);
          margin-left: calc(var(--airplane-size) / -2);
          z-index: 5;
          transition: left 0.08s linear;
        }

        .airplane-glow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          width: calc(var(--airplane-size) * 1.5);
          height: calc(var(--airplane-size) * 0.35);
          background: radial-gradient(ellipse at center, rgba(142, 202, 230, 0.45) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        }

        @keyframes turbulence {
          0%, 100% { transform: rotate(-1.5deg) translateY(-2px); }
          50% { transform: rotate(1.5deg) translateY(2px); }
        }

        .airplane-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          animation: turbulence 3.5s infinite ease-in-out;
          filter: drop-shadow(0 0 10px rgba(184, 223, 239, 0.4));
        }

        @media (max-width: 600px) {
          .loader-content { gap: 15px; }
          .flight-scene { height: 80px; }
          .logo-img { width: 180px; }
          .logo-tagline { font-size: 0.6rem; letter-spacing: 3px; }
        }
      `}</style>

      <div className="bg-layer"></div>
      
      <div className="radar-container">
        <div className="radar-ring ring-1"></div>
        <div className="radar-ring ring-2"></div>
      </div>

      <div className="loader-content">
        <div className={`logo-wrapper ${isFadingOut ? 'fade-out' : ''}`}>
          <img src="/assets/img/logo/FremorLogo.png" alt="Fremor" className="logo-img" />
          <div className="logo-tagline">START THE TRIP FROM HOME</div>
        </div>

        <div className={`flight-scene ${fadeFlight ? 'fade-out' : ''}`}>
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          
          <div className="flight-track"></div>
          <div className="flight-trail" style={{ width: `calc(var(--track-width) * ${progress / 100})` }}></div>
          <div className="flight-trail-glow" style={{ width: `calc(var(--track-width) * ${progress / 100})` }}></div>

          <div className="airplane-wrapper" style={{ left: `calc(var(--track-margin) + var(--track-width) * ${progress / 100})` }}>
            <div className="airplane-glow"></div>
            <img src="/assets/img/transitions/airplane.png" alt="Airplane" className="airplane-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FremorLoader;