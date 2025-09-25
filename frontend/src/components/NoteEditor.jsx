"use client";

import { useState, useEffect } from "react";
import api from "../api/axios";
import { ArrowLeft, Trash2, Check } from "lucide-react";

export default function NoteEditor({
  onCreated,
  onUpdated,
  editingNote,
  clearEditing,
  onDelete,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (editingNote) {
      const res = await api.put(`/notes/${editingNote._id}`, {
        title,
        content,
      });
      onUpdated(res.data);
    } else {
      const res = await api.post("/notes", { title, content });
      onCreated(res.data);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full min-h-screen bg-background text-foreground"
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        {editingNote && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearEditing}
              className="text-primary p-2 rounded hover:bg-primary/10"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <span className="text-lg font-medium ml-2">
                {editingNote ? "Edit Note" : "New Note"}
              </span>
            </div>
          </div>
        )}
        {!editingNote &&<div>
           <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearEditing}
              className="text-primary p-2 rounded hover:bg-primary/10"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <span className="text-lg font-medium ml-2">
                 New Note
              </span>
            </div>
          </div>
        </div>}

        <div className="flex items-center gap-4 ml-auto">
          {editingNote && (
            <button
              type="button"
              onClick={onDelete}
              className="text-destructive p-2 rounded hover:bg-destructive/10"
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
          )}
          <button
            type="submit"
            className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90"
            title={editingNote ? "Update" : "Save"}
          >
            <Check size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 space-y-6">
        <input
          className="w-full text-4xl font-extrabold outline-none bg-transparent placeholder:text-muted-foreground focus:ring-0 border-none p-0"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full h-[70vh] resize-none text-lg leading-relaxed outline-none bg-transparent placeholder:text-muted-foreground focus:ring-0 border-none p-0"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </form>
  );
}
