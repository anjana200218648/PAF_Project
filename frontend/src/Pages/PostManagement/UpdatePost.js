import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Trash2, Upload, Image as ImageIcon, Video as VideoIcon, Save, Loader2, Type, FileText, RefreshCw } from 'lucide-react';
import SideBar from '../../Components/SideBar/SideBar';
import './UpdatePost.css';

function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [newMediaPreviews, setNewMediaPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || '');
        setDescription(post.description || '');
        setExistingMedia(post.media || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Failed to fetch post details.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl));
      alert('Media file deleted successfully!');
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    setNewMedia(files);
    setNewMediaPreviews(previews);
  };

  const removeNewMedia = (index) => {
    const updatedMedia = [...newMedia];
    const updatedPreviews = [...newMediaPreviews];
    
    updatedMedia.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setNewMedia(updatedMedia);
    setNewMediaPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
      navigate('/allPost');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="update-post-container">
        <SideBar />
        <div className="update-post-content">
          <div className="loading-container">
            <Loader2 size={48} className="loader-icon accent" />
            <p>Loading post details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="update-post-container">
      <SideBar />
      <div className="update-post-content">
        <main className="update-post-main">
          <div className="update-post-card">
            <h1 className="update-post-title">
              <RefreshCw size={24} />
              Update Post
            </h1>
            
            <form onSubmit={handleSubmit} className="update-post-form">
              <div className="form-group">
                <label className="form-label">
                  <Type size={18} />
                  Title
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  <FileText size={18} />
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Write your post description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              
              {existingMedia.length > 0 && (
                <div className="form-group">
                  <label className="form-label">
                    <ImageIcon size={18} />
                    Existing Media
                  </label>
                  <div className="media-preview-container">
                    {existingMedia.map((mediaUrl, index) => (
                      <div key={`existing-${index}`} className="media-preview-item">
                        {mediaUrl.endsWith('.mp4') ? (
                          <video className="media-preview" controls>
                            <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                          </video>
                        ) : (
                          <img className="media-preview" src={`http://localhost:8080${mediaUrl}`} alt={`Media ${index}`} />
                        )}
                        <button 
                          type="button" 
                          className="remove-media-btn"
                          onClick={() => handleDeleteMedia(mediaUrl)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                
              <div className="form-group">
                <label className="form-label">
                  <Upload size={18} />
                  Add New Media
                </label>
                {newMediaPreviews.length > 0 && (
                  <div className="media-preview-container">
                    {newMediaPreviews.map((preview, index) => (
                      <div key={`new-${index}`} className="media-preview-item">
                        {preview.type.startsWith('video/') ? (
                          <video className="media-preview" controls>
                            <source src={preview.url} type={preview.type} />
                          </video>
                        ) : (
                          <img className="media-preview" src={preview.url} alt={`New Media ${index}`} />
                        )}
                        <button 
                          type="button" 
                          className="remove-media-btn"
                          onClick={() => removeNewMedia(index)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <label className="file-upload-label">
                  <Upload size={20} className="upload-icon" />
                  <span>Choose files (max 3 images or 1 video)</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,video/mp4"
                    multiple
                    onChange={handleNewMediaChange}
                    className="file-upload-input"
                  />
                </label>
                <p className="file-hint">Supports: JPEG, PNG, JPG, MP4 (max 50MB)</p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="submit-btn"
                  onClick={() => navigate('/allPost')}
                  style={{ backgroundColor: '#94a3b8' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn accent"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="loader-icon" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Update Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UpdatePost;