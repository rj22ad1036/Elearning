import React from "react";
import { courses } from "../data/courses";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Note from "../components/Note";
const page = () => {
  const { id } = useParams();
  const course = courses.find((course) => course.id === id);
  if (!course) {
    return <div>Course not found</div>;
  }
  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <img src={course.image} alt="" />
      <h3>Videos:</h3>
      <ul>
        {course.video.map((video) => (
          <li key={video.id}>
            <a href={video.url}>{video.title}</a>
            <ReactPlayer url={video.url} controls width="100%" />
            <Note videoId={video.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};
1;
export default page;
