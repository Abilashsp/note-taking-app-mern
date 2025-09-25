"use client"

import { useState } from "react"
import api from "../api/axios"

export default function SearchBar({ onResults }) {
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState("keyword")

  async function doSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    const res = await api.get("/search", { params: { query, mode } })
    onResults(res.data)
  }

  return (
    <form onSubmit={doSearch} className="flex flex-col sm:flex-row gap-3 p-4 bg-background rounded-lg shadow-md">
      <input
        className="flex-1 p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground bg-card"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select
        className="p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground bg-card"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="keyword">Keyword</option>
        <option value="semantic">AI (semantic)</option>
      </select>
      <button className="bg-primary text-primary-foreground px-5 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        Search
      </button>
    </form>
  )
}
