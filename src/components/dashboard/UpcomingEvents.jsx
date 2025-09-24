import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isToday, isTomorrow } from "date-fns";
import { Calendar, Clock } from "lucide-react";

export default function UpcomingEvents({ events }) {
  const upcomingEvents = events
    .filter(event => new Date(event.start_time) >= new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 5);

  const getDateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const eventDate = new Date(event.start_time);
              return (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {getDateLabel(eventDate)} at {format(eventDate, "h:mm a")}
                    </p>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1 truncate">{event.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming events</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}