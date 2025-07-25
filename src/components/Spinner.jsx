import React from 'react'

const Spinner = ({ size = 'medium', message = 'Loading amazing movies...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="spinner-container">
      {/* Main Spinner */}
      <div className="spinner-wrapper">
        {/* Outer Ring */}
        <div className={`spinner-ring ${sizeClasses[size]}`}>
          <div className="spinner-ring-inner"></div>
        </div>
        
        {/* Inner Pulse */}
        <div className={`spinner-pulse ${sizeClasses[size]}`}>
          <div className="pulse-dot"></div>
        </div>
      </div>

      {/* Loading Message */}
      {message && (
        <div className="spinner-message">
          <p className="message-text">{message}</p>
          <div className="message-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      )}

      {/* Floating Elements */}
      <div className="spinner-particles">
        <div className="particle particle-1">🎬</div>
        <div className="particle particle-2">🍿</div>
        <div className="particle particle-3">⭐</div>
        <div className="particle particle-4">🎭</div>
      </div>

      <style jsx>{`
        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          position: relative;
          padding: 2rem;
        }

        .spinner-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .spinner-ring {
          position: relative;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(99, 102, 241, 0.4) 90deg,
            rgba(139, 92, 246, 0.8) 180deg,
            rgba(59, 130, 246, 0.6) 270deg,
            transparent 360deg
          );
          animation: spinRing 2s linear infinite;
          padding: 3px;
        }

        .spinner-ring-inner {
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(10, 10, 15, 0.9) 40%,
            rgba(26, 26, 46, 0.8) 100%
          );
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }

        .spinner-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .pulse-dot {
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.8) 0%,
            rgba(139, 92, 246, 0.6) 50%,
            transparent 100%
          );
          border-radius: 50%;
          animation: pulseDot 2s ease-in-out infinite;
        }

        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.6;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
        }

        @keyframes pulseDot {
          0%, 100% { 
            transform: scale(0.5);
            opacity: 0.4;
          }
          50% { 
            transform: scale(1);
            opacity: 0.8;
          }
        }

        .spinner-message {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
        }

        .message-text {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 8px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(99, 102, 241, 0.8) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .message-dots {
          display: flex;
          justify-content: center;
          gap: 4px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: rgba(99, 102, 241, 0.6);
          border-radius: 50%;
          animation: dotPulse 1.4s ease-in-out infinite both;
        }

        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotPulse {
          0%, 80%, 100% { 
            transform: scale(0.8);
            opacity: 0.5; 
          }
          40% { 
            transform: scale(1.2);
            opacity: 1; 
          }
        }

        .spinner-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          font-size: 20px;
          opacity: 0.6;
          animation: float 6s ease-in-out infinite;
        }

        .particle-1 {
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }

        .particle-2 {
          top: 30%;
          right: 20%;
          animation-delay: 1.5s;
        }

        .particle-3 {
          bottom: 30%;
          left: 25%;
          animation-delay: 3s;
        }

        .particle-4 {
          bottom: 20%;
          right: 25%;
          animation-delay: 4.5s;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          33% { 
            transform: translateY(-15px) rotate(5deg);
            opacity: 0.7;
          }
          66% { 
            transform: translateY(10px) rotate(-5deg);
            opacity: 0.5;
          }
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .spinner-container {
            min-height: 150px;
            padding: 1.5rem;
          }

          .message-text {
            font-size: 14px;
          }

          .particle {
            font-size: 16px;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .spinner-ring,
          .spinner-pulse,
          .pulse-dot,
          .dot,
          .particle {
            animation: none;
          }
          
          .spinner-ring {
            background: rgba(99, 102, 241, 0.6);
          }
        }
      `}</style>
    </div>
  )
}

export default Spinner