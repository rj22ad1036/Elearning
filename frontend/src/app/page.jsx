import React from "react";
import { courses } from "../data/courses";

const Page = () => {
  return (
    <div>
      {courses.map((course) => (
        <div key={course.id}>
          <h2>{course.title}</h2>
          <p>{course.description}</p>
          <img src={course.image} alt="Course Image" />
          <h3>Videos:</h3>
          <ul>
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
  );
};

export default Page;
