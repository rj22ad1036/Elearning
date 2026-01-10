"use client";
// import { useState, useEffect, use } from "react";
// import Note from "@/components/Note";

// export default function CourseDetail({ params }) {
//   const { id } = use(params);
//   const [course, setCourse] = useState(null);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   useEffect(() => {
//     fetch(`${process.env.BACKEND_URL}/courses/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setCourse(data);
//         setSelectedVideo(data.videos[0]);
//       });
//   }, [id]);

//   if (!course) return <p>Loading...</p>;

//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-bold mb-4">{course.title}</h1>

//       {selectedVideo && (
//         <>
//           <video
//             controls
//             src={selectedVideo.url}
//             className="w-full rounded mb-2"
//           />
//           <h2 className="text-lg font-semibold mb-4">{selectedVideo.title}</h2>

//           {/* ✅ Note Component */}
//           <Note courseId={course.id} videoId={selectedVideo.id} />
//         </>
//       )}

//       {/* Video List */}
//       <h3 className="text-xl font-semibold mt-6 mb-2">Other Videos</h3>
//       <ul>
//         {course.videos.map((v) => (
//           <li
//             key={v.id}
//             className={`cursor-pointer hover:text-blue-500 ${
//               selectedVideo?.id === v.id ? "font-bold text-blue-600" : ""
//             }`}
//             onClick={() => setSelectedVideo(v)}
//           >
//             {v.title}
//           </li>
//         ))}
//       </ul>
//     </main>
//   );
// }

import { useState, useEffect, use } from "react";
import {
  Play,
  ChevronRight,
  AlertCircle,
  Loader2,
  BookOpen,
} from "lucide-react";
import Note from "@/components/Note";

export default function CourseDetail({ params }) {
  const { id } = use(params);
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.BACKEND_URL}/courses/${id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load course: ${response.statusText}`);
        }

        const data = await response.json();
        setCourse(data);
        setSelectedVideo(data.videos?.[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-foreground/60">Loading course...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-foreground mb-1">
                Error Loading Course
              </h2>
              <p className="text-foreground/70">
                {error || "Course not found"}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {course.title}
              </h1>
              {course.description && (
                <p className="text-foreground/60">{course.description}</p>
              )}
              <p className="text-sm text-foreground/50 mt-2">
                {course.videos.length} video
                {course.videos.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            {selectedVideo && (
              <div className="space-y-6">
                {/* Video Player */}
                <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
                  <div className="bg-black aspect-video flex items-center justify-center">
                    <video
                      key={selectedVideo.id}
                      controls
                      src={selectedVideo.url}
                      className="w-full h-full"
                      controlsList="nodownload"
                    />
                  </div>
                </div>

                {/* Video Info */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {selectedVideo.title}
                  </h2>
                  {selectedVideo.duration && (
                    <p className="text-sm text-foreground/60">
                      Duration: {selectedVideo.duration}
                    </p>
                  )}
                </div>

                {/* Notes Section */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Video Notes
                  </h3>
                  <Note courseId={course.id} videoId={selectedVideo.id} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Video List */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-6">
              <div className="bg-primary/5 px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Course Videos</h3>
              </div>
              <div className="divide-y divide-border max-h-96 overflow-y-auto">
                {course.videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`w-full text-left px-6 py-4 transition-colors flex items-start gap-3 hover:bg-primary/5 ${
                      selectedVideo?.id === video.id
                        ? "bg-primary/10 border-l-2 border-primary"
                        : "hover:bg-muted"
                    }`}
                    aria-current={
                      selectedVideo?.id === video.id ? "page" : undefined
                    }
                  >
                    <div className="flex-shrink-0 mt-1">
                      {selectedVideo?.id === video.id ? (
                        <Play className="w-4 h-4 text-primary fill-primary" />
                      ) : (
                        <span className="text-xs font-medium text-foreground/50 w-4 text-center">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          selectedVideo?.id === video.id
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {video.title}
                      </p>
                      {video.duration && (
                        <p className="text-xs text-foreground/50 mt-1">
                          {video.duration}
                        </p>
                      )}
                    </div>
                    {selectedVideo?.id === video.id && (
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
