import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhotoGallery.css';
import { io } from 'socket.io-client';

const socket = io('https://backend-production-8c13.up.railway.app');

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const response = await axios.get('https://backend-production-8c13.up.railway.app/api/photos');
      setPhotos(response.data);
    };

    fetchPhotos();

    socket.on('photoAdded', (newPhoto) => {
      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
    });

    return () => socket.off('photoAdded');
  }, []);

  const handleUpload = async (event) => {
    const formData = new FormData();
    formData.append('photo', event.target.files[0]);

    const response = await axios.post('https://backend-production-8c13.up.railway.app/api/uploadPhoto', formData);
    setPhotos((prevPhotos) => [...prevPhotos, response.data]);
  };

  const openFullscreen = (photo) => setSelectedPhoto(photo);
  const closeFullscreen = () => setSelectedPhoto(null);

  return (
    <div className="photo-gallery">
      <input type="file" accept="image/*" onChange={handleUpload} className="upload-button" />

      <div className="photo-gallery-grid">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="photo-item"
            style={{ backgroundImage: `url(${photo.url})` }}
            onClick={() => openFullscreen(photo)}
          >
            <div className="photo-timestamp">{photo.timestamp}</div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="fullscreen-view" onClick={closeFullscreen}>
          <img src={selectedPhoto.url} alt="Fullscreen view" />
          <span className="close-btn">✖</span>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
