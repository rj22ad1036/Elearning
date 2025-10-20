"use client";
import { useState, useEffect, use } from "react";
import Note from "@/components/Note";

export default function CourseDetail({ params }) {
  const { id } = use(params);
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        setSelectedVideo(data.videos[0]);
      });
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>

      {selectedVideo && (
        <>
          <video
            controls
            src={selectedVideo.url}
            className="w-full rounded mb-2"
          />
          <h2 className="text-lg font-semibold mb-4">{selectedVideo.title}</h2>

          {/* ✅ Note Component */}
          <Note courseId={course.id} videoId={selectedVideo.id} />
        </>
      )}

      {/* Video List */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Other Videos</h3>
      <ul>
        {course.videos.map((v) => (
          <li
            key={v.id}
            className={`cursor-pointer hover:text-blue-500 ${
              selectedVideo?.id === v.id ? "font-bold text-blue-600" : ""
            }`}
            onClick={() => setSelectedVideo(v)}
          >
            {v.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
