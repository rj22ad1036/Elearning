"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // fetch notes
    fetch("http://localhost:4000/notes/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch notes");
      })
      .then(setNotes)
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setNotes([]);
      });

    // fetch scores
    fetch("http://localhost:4000/scores/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch scores");
      })
      .then(setScores)
      .catch((err) => {
        console.error("Error fetching scores:", err);
        setScores([]);
      });
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <h2 className="text-xl mb-2">My Notes</h2>
      {notes.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        notes.map((n) => (
          <div key={n.id} className="border p-2 mb-2 rounded">
            {n.content}
          </div>
        ))
      )}

      <h2 className="text-xl mt-6 mb-2">My Quiz Scores</h2>
      {scores.length === 0 ? (
        <p>No quizzes yet.</p>
      ) : (
        scores.map((s) => (
          <div key={s.id} className="border p-2 mb-2 rounded">
            {s.course?.title ? (
              <>
                Course: <strong>{s.course.title}</strong> → Score: {s.score}
              </>
            ) : (
              <>
                Course #{s.courseId} → Score: {s.score}
              </>
            )}
          </div>
        ))
      )}
    </main>
  );
}
