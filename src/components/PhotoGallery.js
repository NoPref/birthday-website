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
      try {
        const response = await axios.get('https://backend-production-8c13.up.railway.app/api/photos');
        setPhotos(response.data);
      } catch (error) {
        console.error("Failed to fetch photos", error);
      }
    };
    fetchPhotos();

    // Listen to socket events for new and deleted photos
    socket.on('photoUploaded', (newPhoto) => {
      setPhotos((prevPhotos) => [...prevPhotos, newPhoto]);
    });

    socket.on('photoDeleted', (deletedId) => {
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== deletedId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);

    await Promise.all(files.map(async (file) => {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const response = await axios.post('https://backend-production-8c13.up.railway.app/api/uploadPhoto', formData);
        // Emit the uploaded photo to all clients
        socket.emit('photoUploaded', response.data); // Emit the photo after successful upload
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
  
      // Send delete request to the server
      await axios.delete(`https://backend-production-8c13.up.railway.app/api/photos/${photoId}`);
      
      // The socket event will handle the update, no need to update local state manually
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };
  


  const openFullscreen = (photo) => setSelectedPhoto(photo);
  const closeFullscreen = () => setSelectedPhoto(null);

  return (
    <div className="photo-gallery">
      <input type="file" accept="image/*" onChange={handleUpload} className="upload-button" />

      <div className="photo-gallery-grid">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="photo-item"
            style={{ backgroundImage: `url(${photo.url})` }}
            onClick={() => openFullscreen(photo)}
          >
            <div className="photo-timestamp">{photo.timestamp}</div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(photo._id); // Ensure we're passing the correct ID
              }}
            >
              ✖
            </button>
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
