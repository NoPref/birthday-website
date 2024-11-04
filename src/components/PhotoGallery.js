import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhotoGallery.css';
import { io } from 'socket.io-client';

const socket = io('https://backend-production-8c13.up.railway.app');

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    // Fetch photos from the backend on load
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('https://backend-production-8c13.up.railway.app/api/photos');
        setPhotos(response.data);
      } catch (error) {
        console.error("Failed to load photos", error);
      }
    };
    fetchPhotos();

    // Socket connection for real-time updates
    socket.on('photoUploaded', (newPhoto) => {
      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
  
    const newPhotos = await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append('photo', file);
      
      // Send request to upload the photo
      const response = await fetch('https://backend-production-8c13.up.railway.app/api/uploadPhoto', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        return { url: data.url, timestamp: data.timestamp };
      } else {
        console.error("Photo upload failed");
        return null;
      }
    }));
  
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos.filter(photo => photo !== null)]);
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
