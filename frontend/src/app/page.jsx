import React from "react";
import Link from "next/link";

// src/app/page.jsx
async function Page() {
  const res = await fetch("http://localhost:4000/courses");
  const courses = await res.json();

  return (
    <div className="p-6">
      <Link href="/profile" className="mr-4 text-blue-500 hover:underline">
        Profile
      </Link>
      <div>
        {courses.map((course) => (
          <div key={course.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p className="mb-2">{course.description}</p>
            <img src={course.image} alt="Course Image" className="mb-2" />
            <h3 className="font-semibold">Videos:</h3>
            <ul className="list-disc ml-4">
              {course.videos.map((video) => (
                <li key={video.id}>
                  <a href={video.url} className="text-blue-500 hover:underline">
                    {video.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
