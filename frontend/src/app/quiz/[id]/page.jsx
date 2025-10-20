"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function QuizPage() {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:4000/quiz/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setQuizzes);
  }, [id]);

  const handleAnswer = (quizId, answer) => {
    setAnswers({ ...answers, [quizId]: answer });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const formatted = Object.entries(answers).map(([id, answer]) => ({
      id: Number(id),
      answer,
    }));

    const res = await fetch("http://localhost:4000/quiz/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId: Number(id), answers: formatted }),
    });

    const data = await res.json();
    alert(`You scored ${data.score} / ${quizzes.length}`);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course Quiz</h1>
      {quizzes.map((q) => (
        <div key={q.id} className="mb-6 border p-4 rounded">
          <p className="font-semibold mb-2">{q.question}</p>
          {q.options.map((opt) => (
            <label key={opt.key} className="block mb-1">
              <input
                type="radio"
                name={q.id}
                value={opt.key}
                onChange={() => handleAnswer(q.id, opt.key)}
              />{" "}
              {opt.key}. {opt.text}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Submit Quiz
      </button>
    </main>
  );
}
