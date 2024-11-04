import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './LoveNotes.css';

const socket = io('https://backend-production-8c13.up.railway.app'); // Adjust this URL to match your backend

function LoveNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // Fetch initial notes
    fetch('https://backend-production-8c13.up.railway.app/api/lovenotes')
      .then(response => response.json())
      .then(data => setNotes(data));

    // Listen for new notes
    socket.on('newNote', (note) => {
      setNotes((prevNotes) => [...prevNotes, note]);
      alert('New note added!'); // Display notification for a new note
    });

    // Listen for deleted notes
    socket.on('deleteNote', (noteId) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    });

    return () => {
      // Clean up socket listeners on component unmount
      socket.off('newNote');
      socket.off('deleteNote');
    };
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
      await fetch(`https://backend-production-8c13.up.railway.app/api/lovenotes/${noteId}`, {
        method: 'DELETE',
      });
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
