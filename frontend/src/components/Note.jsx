"use client";
import { useState, useEffect } from "react";

export default function Note({ videoId }) {
  const [note, setNote] = useState("");

  // Load saved note (from localStorage)
  useEffect(() => {
    const saved = localStorage.getItem(`note_${videoId}`);
    if (saved) setNote(saved);
  }, [videoId]);

  const saveNote = () => {
    localStorage.setItem(`note_${videoId}`, note);
    alert("Note saved ✅");
  };

  return (
    <div className="mt-4">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full h-32 p-2 border rounded"
        placeholder="Write your note here..."
      />
      <button
        onClick={saveNote}
        className="mt-2 px-4 py-2 bg-black text-white rounded"
      >
        Save Note
      </button>
    </div>
  );
}
