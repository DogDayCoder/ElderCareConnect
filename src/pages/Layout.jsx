
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { Home, Calendar, CheckSquare, MessageCircle, Settings, Heart } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isElderlyMode, setIsElderlyMode] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setIsElderlyMode(currentUser.is_elderly_mode || false);
    } catch (error) {
      // User not logged in
    }
  };

  const navigationItems = [
    { name: "Dashboard", path: "Dashboard", icon: Home },
    { name: "Calendar", path: "Calendar", icon: Calendar },
    { name: "Tasks", path: "Tasks", icon: CheckSquare },
    { name: "Chat", path: "Chat", icon: MessageCircle },
    { name: "Settings", path: "Settings", icon: Settings }
  ];

  if (isElderlyMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-center">
            <Heart className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Care Connect</h1>
          </div>
        </div>
        <main className="p-4">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">ElderCare Connect</h1>
            </div>
            {user && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Mobile Navigation - Bottom */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex justify-around">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  location.pathname === createPageUrl(item.path)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Desktop Sidebar */}
        <nav className="hidden md:flex md:flex-col md:w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === createPageUrl(item.path)
                      ? "text-blue-600 bg-blue-50 border-blue-200"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
