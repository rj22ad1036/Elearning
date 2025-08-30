"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Available Courses</h1>
      <div className="grid gap-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/course/${course.id}`}
            className="block border p-4 rounded"
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p>{course.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
