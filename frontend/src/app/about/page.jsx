"use client";
import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Award,
  Target,
  Lightbulb,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  FileText,
  Trophy,
  TrendingUp,
  Star,
  CheckCircle,
  Globe,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: FileText,
      title: "Convenient Note-Taking",
      description:
        "Take notes while watching video lessons and organize your learning materials efficiently for better retention.",
    },
    {
      icon: Trophy,
      title: "Interactive Quizzes",
      description:
        "Test your knowledge with comprehensive quizzes designed to reinforce learning and track your progress.",
    },
    {
      icon: TrendingUp,
      title: "Enhance Competitiveness",
      description:
        "Challenge yourself with quiz competitions and track your performance against other learners.",
    },
    {
      icon: Award,
      title: "Leaderboard System",
      description:
        "Compete with fellow learners on our leaderboard system to stay motivated and achieve better results.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Learners" },
    { number: "50+", label: "Courses Available" },
    { number: "95%", label: "Completion Rate" },
    { number: "24/7", label: "Support Available" },
  ];

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
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              About ELearning Platform
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering learners with convenient note-taking tools, interactive
              quizzes, and competitive learning experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              We believe learning should be engaging, competitive, and
              efficient. Our platform is designed to help students take notes
              conveniently while watching lessons, enhance their competitiveness
              through interactive quizzes, and track their progress on our
              leaderboard system.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides essential tools to make your learning
              journey more effective and competitive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Platform Statistics
            </h2>
            <p className="text-gray-600">
              Join thousands of learners who are already improving their skills
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to enhance your learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Watch & Learn
              </h3>
              <p className="text-gray-600">
                Access our comprehensive video courses and start learning at
                your own pace.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Take Notes
              </h3>
              <p className="text-gray-600">
                Use our convenient note-taking feature to capture important
                points while watching lessons.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Test & Compete
              </h3>
              <p className="text-gray-600">
                Take quizzes to test your knowledge and compete on our
                leaderboard system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions or need support? We're here to help you succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-gray-300 mb-4">
                Get help with your learning journey
              </p>
              <a
                href="mailto:support@elearning-platform.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                support@elearning-platform.com
              </a>
            </div>

            <div className="bg-gray-800 rounded-lg p-8">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-300 mb-4">
                Speak directly with our support team
              </p>
              <a
                href="tel:+1-555-0123"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                +1 (555) 0123
              </a>
            </div>

            <div className="bg-gray-800 rounded-lg p-8">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Office Location</h3>
              <p className="text-gray-300 mb-4">Visit us at our main office</p>
              <p className="text-blue-400">
                123 Learning Street
                <br />
                Education City, EC 12345
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-4 text-gray-300">
              <Globe className="w-5 h-5" />
              <span>Available 24/7 for your learning needs</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners and enhance your skills with our
            interactive platform.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Get Started Today
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
