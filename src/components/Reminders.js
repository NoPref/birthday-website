import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reminders.css'; // External CSS file for styling
import { requestNotificationPermission } from '../../firebase-config';

const ReminderForm = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    repeat: 'None', // Default repeat option
  });
  const [loading, setLoading] = useState(false);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://backend-production-8c13.up.railway.app/api/reminders');
      setReminders(res.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
    setLoading(false);
  };

  const addReminder = async (e) => {
    e.preventDefault();
    const token = await requestNotificationPermission();
    try {
      await axios.post('https://backend-production-8c13.up.railway.app/api/reminders', newReminder);
      setNewReminder({ title: '', description: '', date: '', repeat: 'None' });
      fetchReminders();
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`https://backend-production-8c13.up.railway.app/api/reminders/${id}`);
      fetchReminders(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', { hour12: false });
  };

  return (
    <div className="reminder-container">
      <h1>Напоминалки</h1>
      <form className="reminder-form" onSubmit={addReminder}>
  <label>
    Название:
    <input
      type="text"
      placeholder="Введите название"
      value={newReminder.title}
      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
    />
  </label>
  <label>
    Описание:
    <input
      type="text"
      placeholder="Введите описание"
      value={newReminder.description}
      onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
    />
  </label>
  <label>
    Дата и время:
    <input
      type="datetime-local"
      value={newReminder.date}
      onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
    />
  </label>
  <label>
    Повторение:
    <select
      value={newReminder.repeat || ''}
      onChange={(e) => setNewReminder({ ...newReminder, repeat: e.target.value })}
    >
      <option value="">Не повторять</option>
      <option value="daily">Каждый день</option>
      <option value="weekly">Каждую неделю</option>
      <option value="monthly">Каждый месяц</option>
      <option value="yearly">Каждый год</option>
    </select>
  </label>
  <button type="submit">Добавить</button>
</form>


      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <ul className="reminder-list">
          {reminders.map((reminder) => (
            <li key={reminder._id} className="reminder-item">
              <h3>{reminder.title}</h3>
              <p>{reminder.description}</p>
              <span>{formatDate(reminder.date).toLocaleString()}</span>
              {reminder.repeat && <p>Повторение: {reminder.repeat}</p>}
              <button className="delete-button" onClick={() => deleteReminder(reminder._id)}>X</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReminderForm;
