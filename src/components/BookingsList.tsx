import { format } from "date-fns";
import { Booking } from "@/types/booking";
import { ROOMS } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User, Building2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingsListProps {
  bookings: Booking[];
  date: Date;
  onDeleteBooking: (id: string) => void;
}

export const BookingsList = ({ bookings, date, onDeleteBooking }: BookingsListProps) => {
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
