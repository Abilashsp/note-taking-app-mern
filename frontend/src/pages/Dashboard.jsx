"use client"

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

// Helper: get first two letters of email
const getInitials = (email) => {
  if (!email) return "";
  const parts = email.split("@")[0];
  return parts.slice(0, 2).toUpperCase();
};

// Helper: generate consistent color based on email
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
};

"use client"



export default function Dashboard() {
  const { logout, user } = useAuth()
  const [notes, setNotes] = useState([])
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State to manage menu visibility

  useEffect(() => {
    api.get("/notes").then((res) => setNotes(res.data))
  }, [])

  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`)
    setNotes((prev) => prev.filter((n) => n._id !== id))
  }

  const handleSearchResults = (results) => setNotes(results)

  return (
    <div className="min-h-screen bg-gray-50 :bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 p-4 bg-white :bg-gray-800 rounded-lg shadow-md">
        {/* Title & Notes count */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 sm:mb-0">
          <h1 className="text-3xl font-extrabold text-gray-900 :text-white text-balance">AI Note Searcher</h1>
          <span className="text-base text-gray-500 :text-gray-400 font-medium">{notes.length} notes</span>
        </div>

        {/* Actions & Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/notes/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            + Add Note
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
              style={{ backgroundColor: stringToColor(user?.email) }}
            >
              {getInitials(user?.email)}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white :bg-gray-800 rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 :text-red-400 hover:bg-gray-100 :hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearchResults} />

      {/* Notes List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="relative border border-gray-200 :border-gray-700 rounded-xl p-5 bg-white :bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out cursor-pointer group"
            onClick={() => navigate(`/notes/${note._id}`)}
          >
            <h2 className="text-xl font-bold text-gray-900 :text-white mb-2">{note.title || "Untitled"}</h2>
            <p className="text-sm text-gray-600 :text-gray-400 line-clamp-3 mb-4">{note.content || "No content"}</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(note._id)
              }}
              className="absolute bottom-4 right-4 text-red-500 :text-red-400 text-xs font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              Delete
            </button>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full text-center text-gray-500 :text-gray-400 py-10 text-lg">No notes found.</div>
        )}
      </div>
    </div>
  )
}

