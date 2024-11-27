import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './PhotoGallery.css';

const socket = io('https://backend-production-8c13.up.railway.app');

function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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
      setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]); // Prepend new photo
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
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      await axios.post('https://backend-production-8c13.up.railway.app/api/photos/uploadPhoto', formData);
    } catch (error) {
      console.error("Photo upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await axios.delete(`https://backend-production-8c13.up.railway.app/api/photos/${photoId}`);
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
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </label>

      <div className="photo-gallery-grid">
  {photos.map((photo) => {
    // Extract the file ID from the URL using a regex
    const match = photo.url.match(/id=([^&]+)/);
    const fileId = match ? match[1] : null;

    if (!fileId) {
      console.error(`Invalid URL: ${photo.url}`);
      return null; // Skip rendering if file ID is missing
    }

    return (
      <div
        key={photo._id}
        className="photo-item"
        style={{ backgroundImage: `url(https://drive.google.com/thumbnail?id=${fileId})` }}
      >
        <div className="photo-timestamp">{photo.timestamp}</div>
        <button className="delete-btn" onClick={() => handleDelete(photo._id)}>✖</button>
        <div className="photo-fullscreen" onClick={() => openFullscreen(photo)}></div>
      </div>
    );
  })}
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
