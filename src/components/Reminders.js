import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReminderForm = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ title: '', description: '', date: '' });

  const fetchReminders = async () => {
    const res = await axios.get('https://backend-production-8c13.up.railway.app/api/reminders');
    setReminders(res.data);
  };

  const addReminder = async (e) => {
    e.preventDefault(); // Prevent form reload
    await axios.post('https://backend-production-8c13.up.railway.app/api/reminders', newReminder);
    fetchReminders(); // Refresh the reminders list after adding a new one
  };
  
  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div>
      <h1>Напоминалки</h1>
      <form onSubmit={addReminder}>
        <input type="text" placeholder="Название" onChange={e => setNewReminder({ ...newReminder, title: e.target.value })} />
        <input type="text" placeholder="Описание" onChange={e => setNewReminder({ ...newReminder, description: e.target.value })} />
        <input type="datetime-local" onChange={e => setNewReminder({ ...newReminder, date: e.target.value })} />
        <button type="submit">Добавить</button>
      </form>

      <ul>
        {reminders.map(reminder => (
          <li key={reminder._id}>
            {reminder.title} - {reminder.description} at {new Date(reminder.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderForm;
