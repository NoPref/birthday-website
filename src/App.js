import React from 'react';
import WelcomePage from './components/WelcomePage';
import Countdown from './components/Countdown';
import LoveNotes from './components/LoveNotes';
import PhotoGallery from './components/PhotoGallery';
import './App.css';

function App() {
  const startDate = '2021-06-30T04:29:00'; // Days since we met

  return (
    <div>
      <section className="welcome-section">
        <WelcomePage />
      </section>

      <section className="countdown-section">
        <Countdown startDate={startDate} />
      </section>

      <section className="lovenotes-section">
        <LoveNotes />
      </section>

      <section className="photogallery-section">
        <PhotoGallery />
      </section>
    </div>
  );
}

export default App;
