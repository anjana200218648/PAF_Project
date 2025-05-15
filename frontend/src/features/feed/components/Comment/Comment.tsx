import React, { useState } from 'react';

export default function CommentSection() {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleAddComment = () => {
    if (!input.trim()) return;
    const newComment = {
      id: Date.now(),
      text: input,
    };
    setComments([newComment, ...comments]);
    setInput('');
  };

  const handleDelete = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = () => {
    setComments(
      comments.map((c) =>
        c.id === editingId ? { ...c, text: editingText } : c
      )
    );
    setEditingId(null);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };
