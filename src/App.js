import React from 'react';
import WelcomePage from './components/WelcomePage';
import Countdown from './components/Countdown';
import LoveNotes from './components/LoveNotes';
import './App.css';

function App() {
  const startDate = '2021-06-30T04:29:00'; // Days since we met

  return (
    <div>
      <div className="welcome-section">
        <WelcomePage />
      </div>

      <div className="countdown-section">
        <Countdown startDate={startDate} />
      </div>

      <div className="lovenotes-section">
        <LoveNotes />
      </div>
    </div>
  );
}

export default App;
