import React, { useState, useEffect } from 'react';
import './LoveNotes.css';
import io from 'socket.io-client';

const socket = io('https://backend-production-8c13.up.railway.app'); // Your backend URL

function LoveNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetch('https://backend-production-8c13.up.railway.app/api/lovenotes')
      .then(response => response.json())
      .then(data => setNotes(data));

    // Listen for 'noteAdded' event
    socket.on('noteAdded', (note) => {
      setNotes((prevNotes) => [...prevNotes, note]);
      showNotification('New note added!', note.note);
    });

    // Listen for 'noteDeleted' event
    socket.on('noteDeleted', (noteId) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      showNotification('A note was deleted');
    });

    return () => {
      socket.off('noteAdded');
      socket.off('noteDeleted');
    };
  }, []);

  const showNotification = (title, body = '') => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('https://backend-production-8c13.up.railway.app/api/lovenotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note: newNote }),
    })
      .then(response => response.json())
      .then(data => {
        setNewNote('');
      });
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`https://backend-production-8c13.up.railway.app/api/lovenotes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) console.error('Failed to delete note');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="love-notes">
      <h2>Любовные записки</h2>
      <ul className="note-list">
        {notes.map(note => (
          <li key={note._id} className="note">
            {note.note}
            <button className="delete-button" onClick={() => deleteNote(note._id)}>X</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Напиши о чём думаешь..."
          required
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}

export default LoveNotes;
