import React, { useState, useEffect } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import Confetti from 'react-confetti';
import './WelcomePage.css';

function WelcomePage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const typingText = 'С днём рождения!';
  const typingSpeed = 100; // in ms per character
  const delayAfterTyping = 2000; // 2 seconds delay before showing confetti

  useEffect(() => {
    // Trigger confetti after a fixed delay
    const confettiTimeout = setTimeout(() => {
      setShowConfetti(true);

      // Trigger haptic feedback on mobile devices
      if (navigator.vibrate) {
        navigator.vibrate(200); // Vibrate for 200 milliseconds
      }

      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
    }, typingText.length * typingSpeed + delayAfterTyping); // Total time before showing confetti

    // Handle window resize for confetti dimensions
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(confettiTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [typingText.length, typingSpeed, delayAfterTyping]);

  return (
    <section className="welcome-section">
      <h1>
        <ReactTypingEffect
          text={[typingText]}
          speed={typingSpeed}
          eraseDelay={1000000} // Prevents erasing
          typingDelay={1000} // Start typing after a 1-second delay
        />
      </h1>
      {showConfetti && (
        <Confetti
          numberOfPieces={1500}
          width={dimensions.width}
          height={dimensions.height}
          confettiSource={{ x: 0, y: dimensions.height, w: dimensions.width, h: 0 }}
          gravity={0.5}
          initialVelocityY={{ min: -10, max: -20 }} // Adjust upwards velocity
          recycle={false}
        />
      )}
    </section>
  );
}

export default WelcomePage;
