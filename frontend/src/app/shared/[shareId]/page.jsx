"use client";
import { useEffect, useState } from "react";

export default function SharedNote({ params }) {
  const { shareId } = params;
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/notes/public/${shareId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setNote)
      .catch(() => setNote(null));
  }, [shareId]);

  if (!note)
    return (
      <p className="p-6 text-center text-gray-600">
        Note not found or not shared.
      </p>
    );

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shared Note</h1>
      <p className="text-gray-700 mb-4">{note.content}</p>
      <p className="text-sm text-gray-500">
        Shared by <strong>{note.user}</strong>
        {note.courseTitle ? (
          <span>
            {" "}
            from course <em>{note.courseTitle}</em>
          </span>
        ) : null}
      </p>
    </main>
  );
}
