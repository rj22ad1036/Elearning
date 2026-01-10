"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Award,
  Play,
  ArrowRight,
  Star,
  CheckCircle,
  TrendingUp,
  Clock,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Fetch courses
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log("Attempting to fetch courses from backend...");
      const response = await fetch(`${process.env.BACKEND_URL}/courses`);
      console.log("Response status:", response.status);

      if (response.ok) {
        const coursesData = await response.json();
        console.log("Courses received from backend:", coursesData);
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData.slice(0, 6)); // Show only first 6 courses
          setBackendConnected(true);
        } else {
          console.log("No courses found in backend, using fallback");
          setFallbackCourses();
          setBackendConnected(false);
        }
      } else {
        console.log("Backend response not ok, using fallback");
        setFallbackCourses();
        setBackendConnected(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      console.log("Using fallback courses due to error");
      setFallbackCourses();
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const setFallbackCourses = () => {
    const fallbackCourses = [
      {
        id: 1,
        title: "JavaScript Basics",
        description: "Learn JS fundamentals",
        image:
          "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=JavaScript",
        videos: [
          {
            id: 1,
            title: "Intro to JS",
            url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
          },
          {
            id: 2,
            title: "Variables",
            url: "https://www.youtube.com/watch?v=Bv_5Zv5c-Ts",
          },
        ],
      },
      {
        id: 2,
        title: "React Basics",
        description: "Learn React fundamentals",
        image: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=React",
        videos: [
          {
            id: 3,
            title: "Intro to React",
            url: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
          },
          {
            id: 4,
            title: "JSX",
            url: "https://www.youtube.com/watch?v=DiIoWrOlIRw",
          },
        ],
      },
      {
        id: 3,
        title: "Python Programming",
        description: "Learn Python from scratch",
        image: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Python",
        videos: [
          {
            id: 5,
            title: "Python Basics",
            url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
          },
          {
            id: 6,
            title: "Data Types",
            url: "https://www.youtube.com/watch?v=khKv-8q7YmY",
          },
        ],
      },
      {
        id: 4,
        title: "HTML & CSS",
        description: "Web development fundamentals",
        image:
          "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=HTML+CSS",
        videos: [
          {
            id: 7,
            title: "HTML Basics",
            url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
          },
          {
            id: 8,
            title: "CSS Styling",
            url: "https://www.youtube.com/watch?v=yfoY53QXEnI",
          },
        ],
      },
      {
        id: 5,
        title: "Node.js Backend",
        description: "Server-side JavaScript development",
        image: "https://via.placeholder.com/300x200/16A34A/FFFFFF?text=Node.js",
        videos: [
          {
            id: 9,
            title: "Node.js Intro",
            url: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
          },
          {
            id: 10,
            title: "Express.js",
            url: "https://www.youtube.com/watch?v=L72fhGm1tfE",
          },
        ],
      },
      {
        id: 6,
        title: "Database Design",
        description: "SQL and database fundamentals",
        image:
          "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Database",
        videos: [
          {
            id: 11,
            title: "SQL Basics",
            url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
          },
          {
            id: 12,
            title: "Database Design",
            url: "https://www.youtube.com/watch?v=ztHopE5Wnpc",
          },
        ],
      },
    ];
    setCourses(fallbackCourses);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description: "Engage with dynamic content and hands-on exercises",
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry professionals and thought leaders",
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognized certificates upon course completion",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your learning journey and achievements",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Students" },
    { number: "50+", label: "Courses" },
    { number: "100+", label: "Hours of Content" },
    { number: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                ELearning Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover a world of knowledge with our comprehensive online
              learning platform. Explore courses, track your progress, and
              connect with a community of learners.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the features that make learning effective and enjoyable
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover some of our most engaging and comprehensive courses
            </p>

            {/* Backend Status Indicator */}
            {!backendConnected && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Using demo courses - Backend not connected
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 animate-pulse rounded-lg h-80"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/course/${course.id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden transform hover:scale-105 cursor-pointer"
                >
                  {course.image && (
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.videos?.length || 0} lessons
                      </div>
                      <div className="flex items-center text-sm text-yellow-500">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        4.8
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome to Your Learning Journey
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our platform is designed to provide you with the best learning
            experience. Whether you're a beginner or looking to advance your
            skills, we have something for everyone.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <Globe className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Global Access</h3>
              <p className="text-blue-100">Learn from anywhere, anytime</p>
            </div>
            <div className="text-white">
              <Users className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-blue-100">Connect with fellow learners</p>
            </div>
            <div className="text-white">
              <CheckCircle className="w-8 h-8 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quality Content</h3>
              <p className="text-blue-100">Curated by industry experts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
