"use client"

export default function NotesList({ notes, onEdit, onDelete }) {
  if (!notes?.length)
    return <div className="p-5 text-center text-gray-500 bg-white shadow rounded-lg">No notes yet ✨</div>

  return (
    <div className="space-y-4">
      {notes.map((n) => (
        <div
          key={n._id}
          className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-800">{n.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(n)}
                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(n._id)}
                className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
              >
                🗑 Delete
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">
            {n.content.length > 200 ? n.content.slice(0, 200) + "..." : n.content}
          </p>

          {n.score && <div className="text-xs text-gray-500 mt-2">🔎 Relevance: {(n.score * 100).toFixed(1)}%</div>}
        </div>
      ))}
    </div>
  )
}
