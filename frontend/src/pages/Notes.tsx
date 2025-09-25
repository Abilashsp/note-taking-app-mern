import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import NoteEditor from "../components/NoteEditor";

export default function NotePage({ isNew = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNote() {
      if (!isNew && id) {
        try {
          const res = await api.get(`/notes/${id}`);
          console.log(res.data);
          setNote(res.data);
        } catch (err) {
          console.error(err);
          setError("Note not found.");
        }
      }
      setLoading(false);
    }
    fetchNote();
  }, [id, isNew]);

  function handleCreated(newNote) {
    navigate(`/notes/${newNote._id}`);
  }

  function handleUpdated(updatedNote) {
    setNote(updatedNote);
  }

  async function handleDelete() {
    if (!note) return;
    await api.delete(`/notes/${note._id}`);
    navigate("/");
  }

  function clearEditing() {
    navigate("/");
  }

  if (loading) return <div className="p-4 text-gray-500">Loading note...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-neutral-50">
      <NoteEditor
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        editingNote={isNew ? null : note}
        clearEditing={clearEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
