// "use client";
// import { useState, useEffect } from "react";

// export default function Note({ courseId, videoId }) {
//   const [content, setContent] = useState("");
//   const [notes, setNotes] = useState([]);

//   // ✅ Fetch all notes for the current video
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!videoId || !token) return;

//     fetch(`${process.env.BACKEND_URL}/notes/${videoId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => (res.ok ? res.json() : []))
//       .then(setNotes)
//       .catch((err) => console.error("Error fetching notes:", err));
//   }, [videoId]);

//   // ✅ Save a new note
//   const handleSave = async () => {
//     const token = localStorage.getItem("token");
//     if (!content.trim()) return alert("Note cannot be empty.");

//     await fetch(`${process.env.BACKEND_URL}/notes/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ content, videoId }),
//     });

//     setContent("");

//     // Refresh notes
//     fetch(`${process.env.BACKEND_URL}/notes/${videoId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then(setNotes);
//   };

//   return (
//     <section className="mt-6 p-4 border rounded bg-gray-50">
//       <h3 className="text-xl font-semibold mb-3">My Notes</h3>

//       {/* Existing Notes */}
//       {notes.length === 0 ? (
//         <p className="text-gray-500 mb-4">No notes for this video yet.</p>
//       ) : (
//         <ul className="space-y-2 mb-4">
//           {notes.map((note) => (
//             <li key={note.id} className="p-2 bg-white border rounded">
//               {note.content}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Add Note */}
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         className="w-full p-2 border rounded mb-2"
//         rows={3}
//         placeholder="Write a new note..."
//       />
//       <button
//         onClick={handleSave}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Save Note
//       </button>
//     </section>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Check, X, Plus, Loader2 } from "lucide-react";

export default function Note({ courseId, videoId }) {
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [publicNotes, setPublicNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // ✅ Fetch all notes for the current video
  useEffect(() => {
    fetchNotes();
    fetchPublicNotes();
  }, [videoId]);

  const fetchPublicNotes = async () => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/notes/public/video/${videoId}`
      );
      const data = await response.json();
      setPublicNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching public notes:", err);
    }
  };

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!videoId || !token) return;

    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `${process.env.BACKEND_URL}/notes/${videoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load notes");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save a new note
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!content.trim()) {
      setError("Note cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${process.env.BACKEND_URL}/notes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, videoId }),
      });

      if (!response.ok) throw new Error("Failed to save note");

      setContent("");
      await fetchNotes();
    } catch (err) {
      setError("Failed to save note");
      console.error("Error saving note:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete a note
  const handleDelete = async (noteId) => {
    const token = localStorage.getItem("token");
    try {
      setError("");
      const response = await fetch(
        `${process.env.BACKEND_URL}/notes/${noteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete note");
      await fetchNotes();
    } catch (err) {
      setError("Failed to delete note");
      console.error("Error deleting note:", err);
    }
  };

  // ✅ Update a note
  const handleUpdate = async (noteId) => {
    const token = localStorage.getItem("token");
    if (!editContent.trim()) {
      setError("Note cannot be empty");
      return;
    }

    try {
      setError("");
      const response = await fetch(
        `${process.env.BACKEND_URL}/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editContent }),
        }
      );

      if (!response.ok) throw new Error("Failed to update note");
      setEditingId(null);
      setEditContent("");
      await fetchNotes();
    } catch (err) {
      setError("Failed to update note");
      console.error("Error updating note:", err);
    }
  };

  // ✅ Make a note public with AI rating
  const handleMakePublic = async (noteId) => {
    const token = localStorage.getItem("token");
    try {
      setError("");
      const response = await fetch(
        `${process.env.BACKEND_URL}/notes/make-public/${noteId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || "Failed to make note public");
      }

      const data = await response.json();
      const rating = data.rating || 4.0;
      alert(`Note made public with rating: ⭐ ${rating.toFixed(1)}`);
      await fetchNotes();
      await fetchPublicNotes();
    } catch (err) {
      setError(err.message || "Failed to make note public");
      console.error("Error making note public:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="mt-8 p-6 border border-slate-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
        <h3 className="text-2xl font-bold text-slate-900">My Notes</h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Add Note Section */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Add a new note
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Write your thoughts, key points, or questions..."
          disabled={loading}
        />
        <button
          onClick={handleSave}
          disabled={loading || !content.trim()}
          className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Save Note
            </>
          )}
        </button>
      </div>

      {/* Notes List */}
      {loading && notes.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : notes.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-slate-500 text-base">
            No notes yet. Start by adding your first note above!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center gap-1 bg-slate-400 text-white px-3 py-1 rounded text-sm hover:bg-slate-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-800 leading-relaxed mb-3">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {formatDate(note.createdAt)}
                    </span>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          setEditingId(note.id);
                          setEditContent(note.content);
                        }}
                        className="p-2 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                        aria-label="Edit note"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        aria-label="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action buttons row */}
                  <div className="flex items-center gap-3 mt-3 text-sm">
                    {!note.isPublic ? (
                      <button
                        onClick={() => handleMakePublic(note.id)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Make Public & Get AI Rating
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded">
                        <Check className="w-3 h-3" />
                        Public • ⭐ {note.rating?.toFixed(1)}
                      </span>
                    )}

                    {/* Share button */}
                    {!note.shared ? (
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            const res = await fetch(
                              `${process.env.BACKEND_URL}/notes/share/${note.id}`,
                              {
                                method: "POST",
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            const data = await res.json();
                            if (res.ok) {
                              navigator.clipboard.writeText(data.shareUrl);
                              alert("Share link copied!");
                              await fetchNotes();
                            } else {
                              alert(data.error || "Failed to share note");
                            }
                          } catch (err) {
                            console.error("Error sharing note:", err);
                            alert("Network error while sharing note");
                          }
                        }}
                        className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
                      >
                        Share
                      </button>
                    ) : (
                      <span className="text-slate-600 text-xs">Shared</span>
                    )}
                  </div>

                  {/* ✅ Share button / Shared link */}
                  {!note.shared ? (
                    <div className="mt-3">
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");
                            const res = await fetch(
                              `${process.env.BACKEND_URL}/notes/share/${note.id}`,
                              {
                                method: "POST",
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            const data = await res.json();
                            if (res.ok) {
                              navigator.clipboard.writeText(data.shareUrl);
                              alert("Share link copied!");
                              await fetchNotes();
                            } else {
                              alert(data.error || "Failed to share note");
                            }
                          } catch (err) {
                            console.error("Error sharing note:", err);
                            alert("Network error while sharing note");
                          }
                        }}
                        className="mt-2 text-blue-600 underline text-sm"
                      >
                        Share Note
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-green-600 mt-2">
                      Shared: {`http://localhost:3000/shared/${note.shareId}`}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Community Notes Section */}
      {publicNotes.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-slate-900">
              Community Notes
            </h3>
          </div>
          <div className="grid gap-3">
            {publicNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-amber-50 border border-amber-200 rounded-lg hover:border-amber-300 transition-colors"
              >
                <p className="text-slate-800 leading-relaxed mb-2">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    by <strong>{note.user?.username || "Anonymous"}</strong>
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
                    <span>⭐ {note.rating?.toFixed(1)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
