import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/booking";

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  bookings: Booking[];
}

export const Calendar = ({ selectedDate, onSelectDate, bookings }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getDayBookings = (day: Date) => {
    const dayStr = format(day, "yyyy-MM-dd");
    return bookings.filter((b) => b.date === dayStr);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
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
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
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
            key={day.toString()}
            className={cn(
              "relative aspect-square p-2 cursor-pointer rounded-lg transition-all hover:shadow-md border",
              !isCurrentMonth && "text-muted-foreground opacity-50",
              isSelected && "bg-calendar-selected text-white border-primary",
              !isSelected && hasBookings && "border-primary/50 bg-primary/5",
              !isSelected && !hasBookings && "border-border hover:border-primary/50",
              isToday && !isSelected && "border-primary border-2"
            )}
            onClick={() => onSelectDate(cloneDay)}
          >
            <div className="flex flex-col h-full">
              <span className="text-sm font-semibold">{format(cloneDay, "d")}</span>
              {hasBookings && (
                <div className="mt-auto">
                  <div className="text-xs">
                    {dayBookings.length} booking{dayBookings.length > 1 ? "s" : ""}
                  </div>
                </div>
              )}
            </div>
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
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
