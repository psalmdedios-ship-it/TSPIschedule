import { useState } from "react";
import { format } from "date-fns";
import { Booking } from "@/types/booking";
import { ROOMS } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, User, Building2, Trash2 } from "lucide-react";

interface BookingsListProps {
  bookings: Booking[];
  date: Date;
  onDeleteBooking: (id: string) => void;
}

export const BookingsList = ({ bookings, date, onDeleteBooking }: BookingsListProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "Admin" && password === "TSPI!!!!") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const dateStr = format(date, "yyyy-MM-dd");
  const dayBookings = bookings
    .filter((b) => b.date === dateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (dayBookings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No bookings for this day</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dayBookings.map((booking) => {
        const room = ROOMS.find((r) => r.id === booking.roomId);
        return (
          <Card key={booking.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold">
                    {booking.startTime} - {booking.endTime}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{booking.meetingTitle}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>
                      {booking.name} ({booking.department})
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{room?.name}</span>
                  </div>
                </div>
                {booking.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{booking.notes}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteBooking(booking.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
