// // "use client";
// import { useState, useEffect, use } from "react";

// export default function LeaderboardPage({ params }) {
//   const { id } = use(params);
//   const [leaders, setLeaders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("Fetching leaderboard for course ID:", id);

//     fetch(`${process.env.BACKEND_URL}/scores/leaderboard/${id}`)
//       .then((res) => {
//         console.log("Leaderboard response status:", res.status);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("Leaderboard data:", data);
//         setLeaders(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching leaderboard:", err);
//         setLoading(false);
//       });
//   }, [id]);

//   if (loading) {
//     return (
//       <main className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
//         <p>Loading...</p>
//       </main>
//     );
//   }

//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
//       {leaders.length === 0 ? (
//         <p>No scores yet.</p>
//       ) : (
//         <ol className="list-decimal ml-6">
//           {leaders.map((l, i) => (
//             <li key={i} className="mb-2">
//               {l.user.username || l.user.email} — {l.score} pts
//             </li>
//           ))}
//         </ol>
//       )}
//     </main>
//   );
// }

"use client";

import { useState, useEffect, use } from "react";
import { Trophy, Medal, Zap, AlertCircle, Loader } from "lucide-react";

export default function ImprovedLeaderboard({ params }) {
  const { id: courseId } = use(params);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("[v0] Fetching leaderboard for courseId:", courseId);

        const response = await fetch(
          `${process.env.BACKEND_URL}/scores/leaderboard/${courseId}`
        );
        console.log("[v0] Response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: Failed to fetch leaderboard`
          );
        }

        const data = await response.json();
        console.log("[v0] Leaderboard data received:", data);
        setLeaders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("[v0] Leaderboard fetch error:", err);
        setError(err.message || "An error occurred while fetching leaderboard");
        setLeaders([]); // Set empty array on error to show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [courseId]);

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <Zap className="w-5 h-5 text-blue-500" />;
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800";
    if (rank === 2) return "bg-gray-100 text-gray-800";
    if (rank === 3) return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-300">Loading leaderboard...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
          </div>
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-200 font-semibold mb-1">
                Error Loading Leaderboard
              </h3>
              <p className="text-red-300 text-sm">{error}</p>
              <p className="text-red-400 text-xs mt-2">CourseId: {courseId}</p>
              <p className="text-red-400 text-xs"></p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
        </div>

        {/* Empty State */}
        {leaders.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              No Scores Yet
            </h2>
            <p className="text-gray-400">
              Be the first to complete this course and claim the top spot!
            </p>
          </div>
        ) : (
          /* Leaderboard List */
          <div className="space-y-3">
            {leaders.map((leader, index) => {
              const rank = index + 1;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    rank === 1
                      ? "bg-gradient-to-r from-yellow-900 to-yellow-800 border-yellow-600 shadow-lg shadow-yellow-500/20"
                      : rank === 2
                      ? "bg-gradient-to-r from-gray-700 to-gray-600 border-gray-500 shadow-lg shadow-gray-500/20"
                      : rank === 3
                      ? "bg-gradient-to-r from-orange-900 to-orange-800 border-orange-600 shadow-lg shadow-orange-500/20"
                      : "bg-slate-700 border-slate-600 hover:bg-slate-650"
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadgeColor(
                        rank
                      )}`}
                    >
                      {rank}
                    </div>
                  </div>

                  {/* Medal Icon */}
                  <div className="flex-shrink-0">{getMedalIcon(rank)}</div>

                  {/* User Info */}
                  <div className="flex-grow">
                    <p className="font-semibold text-white text-lg">
                      {leader.user.username || leader.user.email}
                    </p>
                    <p className="text-sm text-gray-300">{leader.user.email}</p>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-2xl font-bold text-white">
                      {leader.score}
                    </p>
                    <p className="text-xs text-gray-300">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Stats */}
        {leaders.length > 0 && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Total Participants</p>
              <p className="text-2xl font-bold text-white">{leaders.length}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Top Score</p>
              <p className="text-2xl font-bold text-yellow-400">
                {leaders[0]?.score || 0}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
              <p className="text-gray-400 text-sm mb-1">Avg Score</p>
              <p className="text-2xl font-bold text-blue-400">
                {Math.round(
                  leaders.reduce((sum, l) => sum + l.score, 0) / leaders.length
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
