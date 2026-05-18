import React from 'react';

const FremorLoader = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fremor-loader-container">
      <style>{`
        :root {
          --primary-dark: #112b3c;
          --secondary-dark: #0f2534;
          --primary-light: #b8dfef;
          --secondary-light: #8ecae6;
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
          z-index: 9999;
          animation: fadeIn 0.5s ease-out;
          overflow: hidden;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
          gap: 30px;
        }

        .logo-wrapper { margin-bottom: 15px; }

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

        .flight-trail {
          position: absolute;
          top: 50px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(184, 223, 239, 0.4) 50%, rgba(184, 223, 239, 0.8) 100%);
          z-index: 2;
          transform: scaleX(0);
          transform-origin: left;
          animation: trailReveal 2s forwards ease-out, trailBlink 1.5s 2s infinite;
        }
        .flight-trail-glow {
          position: absolute;
          top: 45px;
          left: 0;
          width: 100%;
          height: 15px;
          background: radial-gradient(circle at right center, rgba(142, 202, 230, 0.3), transparent 80%);
          z-index: 1;
          animation: trailReveal 2s forwards ease-out 0.3s;
        }

        @keyframes trailReveal {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }

        @keyframes trailBlink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .airplane-wrapper {
          position: absolute;
          top: 0;
          left: -20%;
          width: 100%;
          height: 100%;
          z-index: 5;
          animation: flyHorizontally 6s infinite cubic-bezier(0.65, 0, 0.35, 1);
          filter: drop-shadow(0 0 15px rgba(184, 223, 239, 0.3));
        }

        @keyframes flyHorizontally {
          0% { transform: translateX(0); }
          100% { transform: translateX(140%); }
        }

        @keyframes turbulence {
          0%, 100% { transform: rotate(-1deg) translateY(-5px); }
          50% { transform: rotate(1deg) translateY(5px); }
        }

        .airplane-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          animation: flyHorizontally 6s infinite cubic-bezier(0.65, 0, 0.35, 1), turbulence 3s infinite ease-in-out;
          filter: drop-shadow(0 0 15px rgba(184, 223, 239, 0.5));
        }

        @media (max-width: 600px) {
          .loader-content { gap: 10px; }
          .flight-scene { height: 80px; }
          .logo-img { width: 180px; }
          .logo-tagline { font-size: 0.6rem; letter-spacing: 3px; }
          .airplane-img { width: 60px; height: 60px; }
        }
      `}</style>

      <div className="bg-layer"></div>
      
      <div className="radar-container">
        <div className="radar-ring ring-1"></div>
        <div className="radar-ring ring-2"></div>
      </div>

      <div className="loader-content">
        <div className="logo-wrapper">
          <img src="/assets/img/logo/FremorLogo.png" alt="Fremor" className="logo-img" />
          <div className="logo-tagline">START THE TRIP FROM HOME</div>
        </div>

        <div className="flight-scene">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          
          <div className="flight-trail"></div>
          <div className="flight-trail-glow"></div>

          <div className="airplane-wrapper">
            <img src="/assets/img/transitions/airplane.png" alt="Airplane" className="airplane-img" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FremorLoader;