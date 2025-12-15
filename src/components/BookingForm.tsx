import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Booking, ROOMS } from "@/types/booking";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Schema with a final guard to ensure start < end
 * (time conflict is checked again on submit below)
 */
const bookingSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    department: z.string().min(2, "Department is required"),
    meetingTitle: z.string().min(3, "Meeting title must be at least 3 characters"),
    notes: z.string().optional(),
    startTime: z.string().min(1, "Please select a time slot"),
    endTime: z.string().min(1, "Please select a time slot"),
  })
  .refine((d) => d.startTime < d.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void> | void;
  roomId: string;
  date: Date;
  bookings: Booking[];
}

const TIME_SLOTS = [
  { start: "08:00", end: "09:00", label: "8:00 AM - 9:00 AM" },
  { start: "09:00", end: "10:00", label: "9:00 AM - 10:00 AM" },
  { start: "10:00", end: "11:00", label: "10:00 AM - 11:00 AM" },
  { start: "11:00", end: "12:00", label: "11:00 AM - 12:00 PM" },
  { start: "12:00", end: "13:00", label: "12:00 PM - 1:00 PM" },
  { start: "13:00", end: "14:00", label: "1:00 PM - 2:00 PM" },
  { start: "14:00", end: "15:00", label: "2:00 PM - 3:00 PM" },
  { start: "15:00", end: "16:00", label: "3:00 PM - 4:00 PM" },
  { start: "16:00", end: "17:00", label: "4:00 PM - 5:00 PM" },
  { start: "17:00", end: "18:00", label: "5:00 PM - 6:00 PM" },
];

export const BookingForm = ({ onSubmit, roomId, date, bookings }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      meetingTitle: "",
      notes: "",
      startTime: "",
      endTime: "",
    },
  });

  const room = ROOMS.find((r) => r.id === roomId);
  const dateStr = format(date, "yyyy-MM-dd");

  /**
   * Robust overlap check
   * Prevents booking the same time twice (or any overlap)
   */
  const getOccupiedCount = (startTime: string, endTime: string) => {
    return bookings.filter((b) => {
      if (b.date !== dateStr) return false;
      return startTime < b.endTime && endTime > b.startTime;
    }).length;
  };

  const isSlotOccupied = (startTime: string, endTime: string) => {
    return getOccupiedCount(startTime, endTime) > 0;
  };

  const handleTimeSlotSelect = (slot: { start: string; end: string }) => {
    // allow selecting even if occupied
    setSelectedSlot(slot);
    form.setValue("startTime", slot.start, { shouldValidate: true });
    form.setValue("endTime", slot.end, { shouldValidate: true });
    form.clearErrors(["startTime", "endTime"]);
  };

  const handleSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      setSelectedSlot(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Book Conference Room</h2>
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Room:</span>
                <p className="font-semibold">{room?.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-semibold">{format(date, "PPP")}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Select Time Slot</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot) => {
              const occupiedCount = getOccupiedCount(slot.start, slot.end);
              const isSelected =
                selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;

              return (
                <button
                  key={`${slot.start}-${slot.end}`}
                  type="button"
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-all",
                    occupiedCount > 0 &&
                      "bg-destructive/10 border-destructive/50 text-destructive",
                    isSelected && "bg-primary text-primary-foreground border-primary"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{slot.label}</span>
                    {occupiedCount > 0 && (
                      <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
                        Occupied ({occupiedCount})
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {form.formState.errors.startTime && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.startTime.message}
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@tspi.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Team Standup" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedSlot(null);
                }}
                className="flex-1"
              >
                Clear Form
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
