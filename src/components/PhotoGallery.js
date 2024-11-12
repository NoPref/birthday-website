import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhotoGallery.css';
import { io } from 'socket.io-client';

const socket = io('https://backend-production-8c13.up.railway.app');

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('https://backend-production-8c13.up.railway.app/api/photos');
        setPhotos(response.data);
      } catch (error) {
        console.error("Failed to fetch photos", error);
      }
    };
    fetchPhotos();
  
    socket.on('photoUploaded', (newPhoto) => {
      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
    });
  
    socket.on('photoDeleted', (deletedId) => {
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== deletedId));
    });
  
    return () => {
      socket.off('photoUploaded');
      socket.off('photoDeleted');
    };
  }, []);

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);

    await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const response = await axios.post('https://backend-production-8c13.up.railway.app/api/photos/uploadPhoto', formData);
        socket.emit('photoUploaded', response.data);
      } catch (error) {
        console.error("Photo upload failed", error);
      }
    }));
  };

  const handleDelete = async (photoId) => {
    try {
      if (!photoId) {
        console.error("No photo ID provided for deletion");
        return;
      }
  
      await axios.delete(`https://backend-production-8c13.up.railway.app/api/photos/${photoId}`);
  
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== photoId));
      socket.emit('photoDeleted', photoId);  
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };

  const openFullscreen = (photo) => setSelectedPhoto(photo);
  const closeFullscreen = () => setSelectedPhoto(null);

  return (
    <div className="photo-gallery">
      <input type="file" accept="image/*" onChange={handleUpload} id="file-upload" style={{ display: 'none' }} />
      <label htmlFor="file-upload" className="upload-button">
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="upload-icon">
          <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H12M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125" stroke="#2a2a2a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17.5 21L17.5 15M17.5 15L20 17.5M17.5 15L15 17.5" stroke="#2a2a2a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Загрузить фото
      </label>

      <div className={`photo-gallery-grid ${showMore ? 'expanded' : ''}`}>
        {photos.map((photo, index) => (
          <div
            key={photo._id}
            className={`photo-item ${index >= 4 && !showMore ? 'hidden' : ''}`}
            style={{ backgroundImage: `url(${photo.url})` }}
            onClick={() => openFullscreen(photo)}
          >
            <div className="photo-timestamp">{photo.timestamp}</div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(photo._id);
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {!showMore && photos.length > 4 && (
        <button className="show-more-button" onClick={() => setShowMore(true)}>
          Показать
        </button>
      )}

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
