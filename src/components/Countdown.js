import React, { useState, useEffect } from 'react';
import './Countdown.css';

function Countdown({ startDate }) {
  const calculateTimeSince = () => {
    const difference = +new Date() - +new Date(startDate);
    let timeSince = {};

    if (difference > 0) {
      timeSince = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      // If the startDate is in the future (which shouldn't happen), return zeros
      timeSince = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeSince;
  };

  const [timeSince, setTimeSince] = useState(calculateTimeSince());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeSince(calculateTimeSince());
    }, 1000); // Update every second

    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown">
      <h2>С тех пор как мы встретились прошло</h2>
      <div className="time">
        <span>{timeSince.days}д</span> 
        <span>{timeSince.hours}ч</span> 
        <span>{timeSince.minutes}м</span> 
        <span>{timeSince.seconds}с</span>
      </div>
    </div>
  );
}

export default Countdown;
