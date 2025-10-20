"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function LeaderboardPage() {
  const { id } = useParams();
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/scores/leaderboard/${id}`)
      .then((res) => res.json())
      .then(setLeaders);
  }, [id]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      {leaders.length === 0 ? (
        <p>No scores yet.</p>
      ) : (
        <ol className="list-decimal ml-6">
          {leaders.map((l, i) => (
            <li key={i} className="mb-2">
              {l.user.username || l.user.email} — {l.score} pts
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
