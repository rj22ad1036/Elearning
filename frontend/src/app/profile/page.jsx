"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  Trophy,
  FileText,
  Award,
  Calendar,
  Mail,
  LogOut,
  Edit3,
  ArrowLeft,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token) => {
    try {
      // Fetch notes
      try {
        console.log("Fetching notes...");
        const notesResponse = await fetch("http://localhost:4000/notes/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Notes response status:", notesResponse.status);

        if (notesResponse.ok) {
          const notesData = await notesResponse.json();
          console.log("Notes data:", notesData);
          setNotes(notesData);
        } else {
          const errorText = await notesResponse.text();
          console.log("Notes error response:", errorText);
          setNotes([]);
        }
      } catch (notesError) {
        console.error("Error fetching notes:", notesError);
        setNotes([]);
      }

      // Fetch scores
      try {
        console.log("Fetching scores...");
        const scoresResponse = await fetch("http://localhost:4000/scores/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Scores response status:", scoresResponse.status);

        if (scoresResponse.ok) {
          const scoresData = await scoresResponse.json();
          console.log("Scores data:", scoresData);
          setScores(scoresData);
        } else {
          const errorText = await scoresResponse.text();
          console.log("Scores error response:", errorText);
          setScores([]);
        }
      } catch (scoresError) {
        console.error("Error fetching scores:", scoresError);
        setScores([]);
      }
    } catch (error) {
      console.error("General error fetching user data:", error);
      setNotes([]);
      setScores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authStateChanged"));
    router.push("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAverageScore = () => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score.score, 0);
    return Math.round(total / scores.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {user?.name || user?.email || "User"}
                </h2>
                <p className="text-gray-600 flex items-center justify-center mt-2">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email}
                </p>
                <p className="text-gray-500 text-sm flex items-center justify-center mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Member since{" "}
                  {user?.createdAt ? formatDate(user.createdAt) : "Recently"}
                </p>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {notes.length}
                  </div>
                  <div className="text-sm text-gray-600">Notes</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {scores.length}
                  </div>
                  <div className="text-sm text-gray-600">Quizzes</div>
                </div>
              </div>

              {scores.length > 0 && (
                <div className="mt-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {calculateAverageScore()}%
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes Section */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  My Notes
                  <span className="ml-2 text-sm text-gray-500">
                    ({notes.length})
                  </span>
                </h3>
              </div>
              <div className="p-6">
                {notes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No notes yet</p>
                    <p className="text-sm text-gray-400">
                      Start taking notes while watching course videos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <p className="text-gray-800">{note.content}</p>
                        {note.createdAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(note.createdAt)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quiz Scores Section */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                  Quiz Results
                  <span className="ml-2 text-sm text-gray-500">
                    ({scores.length})
                  </span>
                </h3>
              </div>
              <div className="p-6">
                {scores.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No quiz attempts yet</p>
                    <p className="text-sm text-gray-400">
                      Complete course quizzes to track your progress
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {scores.map((score) => (
                      <div
                        key={score.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {score.course?.title ||
                                `Course #${score.courseId}`}
                            </h4>
                            {score.createdAt && (
                              <p className="text-sm text-gray-500">
                                Completed on {formatDate(score.createdAt)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${
                                score.score >= 80
                                  ? "text-green-600"
                                  : score.score >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {score.score}%
                            </div>
                            <div className="flex items-center">
                              {score.score >= 80 ? (
                                <Award className="w-4 h-4 text-green-600" />
                              ) : score.score >= 60 ? (
                                <Trophy className="w-4 h-4 text-yellow-600" />
                              ) : (
                                <div className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
