import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, MessageCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function TodaysSummary({ events, tasks, messages, isElderlyMode }) {
  const todaysEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  const incompleteTasks = tasks.filter(task => !task.is_completed);
  const latestMessage = messages[0];

  if (isElderlyMode) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-4xl font-bold text-gray-800 flex items-center justify-center">
              <Calendar className="w-10 h-10 mr-3 text-blue-600" />
              Today's Plan
            </CardTitle>
            <p className="text-2xl text-gray-600">
              {format(new Date(), "EEEE, MMMM do")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysEvents.length > 0 ? (
                todaysEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
                    <div className="text-2xl font-semibold text-gray-800 mb-2">
                      {format(new Date(event.start_time), "h:mm a")}: {event.title}
                    </div>
                    {event.description && (
                      <p className="text-xl text-gray-600">{event.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-6 text-center">
                  <p className="text-2xl text-gray-600">No events scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {incompleteTasks.length > 0 && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center">
                <CheckSquare className="w-8 h-8 mr-3 text-green-600" />
                Things to Remember
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incompleteTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                    <p className="text-xl text-gray-800">{task.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{todaysEvents.length}</div>
          <p className="text-xs text-blue-600">
            {todaysEvents.length === 1 ? "event scheduled" : "events scheduled"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <CheckSquare className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{incompleteTasks.length}</div>
          <p className="text-xs text-green-600">
            {incompleteTasks.length === 1 ? "task remaining" : "tasks remaining"}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latest Message</CardTitle>
          <MessageCircle className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          {latestMessage ? (
            <div>
              <div className="text-sm font-semibold text-purple-700 truncate">
                {latestMessage.message_text}
              </div>
              <p className="text-xs text-purple-600 mt-1">
                <Clock className="h-3 w-3 inline mr-1" />
                {format(new Date(latestMessage.created_date), "h:mm a")}
              </p>
            </div>
          ) : (
            <div className="text-sm text-purple-600">No messages yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}