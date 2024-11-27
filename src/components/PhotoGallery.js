import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './PhotoGallery.css';

const socket = io('https://backend-production-8c13.up.railway.app');

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [error, setError] = useState(null);

  // Fetch photos and handle socket events
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('https://backend-production-8c13.up.railway.app/api/photos');
        setPhotos(response.data);
      } catch (err) {
        console.error("Failed to fetch photos", err);
        setError('Failed to load photos. Please try again later.');
      }
    };

    fetchPhotos();

    // Socket event listeners
    socket.on('photoUploaded', (newPhoto) => {
      setPhotos((prevPhotos) => [
        {
          _id: newPhoto._id,
          id: newPhoto.id, // Ensure `id` is correctly populated
          url: newPhoto.url,
          timestamp: newPhoto.timestamp,
        },
        ...prevPhotos,
      ]);
    });
    

    socket.on('photoDeleted', (deletedId) => {
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== deletedId));
    });

    return () => {
      socket.off('photoUploaded');
      socket.off('photoDeleted');
    };
  }, []);

  // Handle photo upload
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      await axios.post('https://backend-production-8c13.up.railway.app/api/photos/uploadPhoto', formData);
    } catch (err) {
      console.error("Photo upload failed", err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle photo delete
  const handleDelete = async (photoId) => {
    setError(null);
    try {
      await axios.delete(`https://backend-production-8c13.up.railway.app/api/photos/${photoId}`);
    } catch (err) {
      console.error("Failed to delete photo", err);
      setError('Failed to delete photo. Please try again.');
    }
  };

  // Handle fullscreen view
  const openFullscreen = (photo) => {
    setSelectedPhoto(photo);
  };
  const closeFullscreen = () => setSelectedPhoto(null);

  return (
    <div className="photo-gallery">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        id="file-upload"
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload" className="upload-button">
        {uploading ? 'Загрузка...' : 'Загрузить фото'}
      </label>

      {error && <div className="error-message">{error}</div>}

      <div className="photo-gallery-grid">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="photo-item"
            style={{
              backgroundImage: `url(https://drive.google.com/thumbnail?id=${photo.id})`,
            }}
          >
            <div className="photo-timestamp">{photo.timestamp}</div>
            <button
              className="delete-btn"
              onClick={() => handleDelete(photo._id)}
            >
              ✖
            </button>
            <div
              className="photo-fullscreen"
              onClick={() => openFullscreen(photo)}
            ></div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div className="fullscreen-view" onClick={closeFullscreen}>
          <img
            src={selectedPhoto.url}
            alt="Fullscreen view"
            onError={(e) => {
              // Fallback if URL is invalid
              const match = selectedPhoto.url.match(/id=([^&]+)/);
              if (match) {
                e.target.src = `https://drive.google.com/uc?id=${match[1]}`;
              }
            }}
          />
          <span className="close-btn" onClick={closeFullscreen}>✖</span>
        </div>
      )}
    </div>
  );
}

export default PhotoGallery;
