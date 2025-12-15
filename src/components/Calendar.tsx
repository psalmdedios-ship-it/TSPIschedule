import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/booking";

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  bookings: Booking[];
}

export const Calendar = ({
  selectedDate,
  onSelectDate,
  bookings,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getDayBookings = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    return bookings.filter((b) => b.date === dayStr);
  };

  const selectedDayBookings = getDayBookings(selectedDate);

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayBookings = getDayBookings(cloneDay);
        const hasBookings = dayBookings.length > 0;
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={cloneDay.toString()}
            onClick={() => onSelectDate(cloneDay)}
            className={cn(
              "relative aspect-square p-2 cursor-pointer rounded-lg border transition-all hover:shadow-md",
              !isCurrentMonth && "opacity-40",
              isSelected && "bg-primary text-white border-primary",
              !isSelected && hasBookings && "bg-primary/5 border-primary/50",
              isToday && !isSelected && "border-primary border-2"
            )}
          >
            <span className="text-sm font-semibold">
              {format(cloneDay, "d")}
            </span>

            {hasBookings && (
              <span className="absolute bottom-1 right-1 text-[10px] bg-primary text-white rounded px-1">
                {dayBookings.length}
              </span>
            )}
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-2">
          {days}
        </div>
      );
      days = [];
    }

    return <div className="space-y-2">{rows}</div>;
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border space-y-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {/* 🔽 BOOKINGS FOR SELECTED DATE */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold">
          Bookings for {format(selectedDate, "MMMM d, yyyy")}
        </h3>

        {selectedDayBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-2">
            No bookings for this day.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {selectedDayBookings.map((b) => (
              <li
                key={b.id}
                className="p-3 rounded-md border bg-muted/50"
              >
                <div className="font-semibold">
                  {b.startTime} – {b.endTime}
                </div>
                <div className="text-sm text-muted-foreground">
                  {b.meetingTitle} ({b.department})
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
