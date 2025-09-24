import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/api/entities";
import { CareCircle } from "@/api/entities";
import { CalendarEvent } from "@/api/entities";
import { SharedTask } from "@/api/entities";
import { ChatMessage } from "@/api/entities";
import LoginForm from "../components/auth/LoginForm";
import TodaysSummary from "../components/dashboard/TodaysSummary";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [careCircle, setCareCircle] = useState(null);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);

  const loadDashboardData = useCallback(async (currentUser) => {
    try {
      // Load care circle
      const circles = await CareCircle.filter(
        { members: currentUser.email },
        "-created_date",
        1
      );
      
      if (circles.length > 0) {
        const circle = circles[0];
        setCareCircle(circle);
        
        // Load events, tasks, and messages for this circle
        const [circleEvents, circleTasks, circleMessages] = await Promise.all([
          CalendarEvent.filter({ circle_id: circle.id }, "-start_time"),
          SharedTask.filter({ circle_id: circle.id }, "-created_date"),
          ChatMessage.filter({ circle_id: circle.id }, "-created_date", 10)
        ]);
        
        setEvents(circleEvents);
        setTasks(circleTasks);
        setMessages(circleMessages);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        await loadDashboardData(currentUser);
      } catch (error) {
        // User not authenticated
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [loadDashboardData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {user.is_elderly_mode ? (
          <TodaysSummary 
            events={events} 
            tasks={tasks} 
            messages={messages} 
            isElderlyMode={true}
          />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.first_name}!
              </h1>
              <p className="text-gray-600">
                {careCircle ? `Managing care for ${careCircle.circle_name}` : "Let's get started with your care circle"}
              </p>
            </div>

            <TodaysSummary 
              events={events} 
              tasks={tasks} 
              messages={messages} 
              isElderlyMode={false}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UpcomingEvents events={events} />
              
              <div className="space-y-6">
                {/* Quick Actions Card */}
                <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                      <p className="font-medium">Add Event</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                      <p className="font-medium">Add Task</p>
                    </div>
                  </div>
                </div>

                {!careCircle && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-yellow-800 mb-2">Get Started</h3>
                    <p className="text-yellow-700 text-sm mb-4">
                      Create or join a care circle to begin coordinating care with your family.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}