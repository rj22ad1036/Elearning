"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  User,
  Info,
  LogOut,
  Menu,
  X,
  Home,
  Trophy,
  FileText,
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Check on mount
    checkAuthStatus();

    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener("storage", checkAuthStatus);

    // Listen for custom auth events
    window.addEventListener("authStateChanged", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("authStateChanged", checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);

    // Trigger auth state change event
    window.dispatchEvent(new Event("authStateChanged"));

    window.location.href = "/login";
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
  ];

  const userItems = isLoggedIn
    ? [
        { name: "Profile", href: "/profile", icon: User },
        { name: "Notes", href: "/notes", icon: FileText },
      ]
    : [];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ELearning</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {userItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
            {/* Main Navigation */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* User Menu */}
            {isLoggedIn ? (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                {userItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-white w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 hover:bg-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mx-3 mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
