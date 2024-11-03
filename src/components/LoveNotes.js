import React, { useState, useEffect } from 'react';
import './LoveNotes.css';

function LoveNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetch('http://birthday-website-production.up.railway.app:5000/api/lovenotes')
      .then(response => response.json())
      .then(data => setNotes(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://birthday-website-production.up.railway.app:5000/api/lovenotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ note: newNote }),
    })
      .then(response => response.json())
      .then(data => {
        setNotes(prevNotes => [...prevNotes, data.note]);
        setNewNote('');
      });
  };

  // Function to delete a note by ID
  const deleteNote = async (noteId) => {
    try {
      const response = await fetch(`http://birthday-website-production.up.railway.app:5000/api/lovenotes/${noteId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      } else {
        console.error('Failed to delete note');
      }
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
