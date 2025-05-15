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
return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Write a comment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          onClick={handleAddComment}
        >
          Add
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border p-3 rounded relative bg-white shadow"
          >
            {editingId === comment.id ? (
              <>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-800">{comment.text}</p>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => handleEdit(comment.id, comment.text)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-600"
                    onClick={() => handleDelete(comment.id)}
                  ></button>