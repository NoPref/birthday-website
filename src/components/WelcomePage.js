import React, { useState, useEffect } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import Confetti from 'react-confetti';
import './WelcomePage.css';

function WelcomePage() {
  const [showTyping, setShowTyping] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const typingText = ['С днём рождения!', 'Я тебя люблю', 'Ты - самая лучшая!'];
  const typingSpeed = 100; // in ms per character
  const delayAfterTyping = 2000; // 2 seconds delay before showing confetti

  useEffect(() => {
    // Trigger typing effect after the drop animation
    const typingTimeout = setTimeout(() => {
      setShowTyping(true);
    }, 1500); // Adjust this duration to match the CSS animation duration

    // Trigger confetti after typing is done (only once)
    const confettiTimeout = setTimeout(() => {
      setShowConfetti(true);
      if (navigator.vibrate) navigator.vibrate(200); // Haptic feedback on mobile

      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
    }, 2000);

    // Handle window resize for confetti dimensions
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(confettiTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [typingText, typingSpeed, delayAfterTyping]);

  return (
    <section className="welcome-section">
      <div className="drop-animation"></div>
      {showTyping && (
        <h1>
          <ReactTypingEffect
            text={typingText}
            speed={typingSpeed}
            eraseDelay={1000} // Delay before erasing
            typingDelay={1000} // Start typing after a 1-second delay
          />
        </h1>
      )}
      {showConfetti && (
        <Confetti
          numberOfPieces={150}
          width={dimensions.width}
          height={dimensions.height}
          confettiSource={{ x: 0, y: dimensions.height, w: dimensions.width, h: 0 }}
          gravity={0.5}
          initialVelocityY={{ min: -10, max: -20 }}
          recycle={false}
        />
      )}
    </section>
  );
}

export default WelcomePage;
