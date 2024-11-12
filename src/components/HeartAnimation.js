import React, { useEffect, useState } from 'react';
import './HeartAnimation.css';

function HeartAnimation() {
  const [hearts, setHearts] = useState([]);
  const heartEmojis = ['🖤', '🤍']; // Array of different heart emojis

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: Math.random() * 2 + 3, // between 3s and 5s
        size: Math.random() * 20 + 10, // between 10px and 30px
        emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      };
      setHearts(prevHearts => [...prevHearts, newHeart]);

      // Clean up hearts after they've fallen
      setTimeout(() => {
        setHearts(prevHearts => prevHearts.filter(heart => heart.id !== newHeart.id));
      }, newHeart.animationDuration * 1000);
    }, 500); // create a new heart every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="heart-container">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.animationDuration}s`,
            fontSize: `${heart.size}px`,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
}

export default HeartAnimation;
