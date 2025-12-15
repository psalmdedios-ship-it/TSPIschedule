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
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking, ROOMS } from "@/types/booking";

/* -------------------- SCHEMA -------------------- */
const bookingSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    department: z.string().min(2, "Department is required"),
    meetingTitle: z.string().min(3, "Meeting title must be at least 3 characters"),
    notes: z.string().optional(),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>;
  roomId: string;
  date: Date;
  bookings: Booking[];
}

/* -------------------- COMPONENT -------------------- */
export const BookingForm = ({
  onSubmit,
  roomId,
  date,
  bookings,
}: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  /* -------------------- OCCUPIED CHECK -------------------- */
  const isTimeOccupied = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return false;

    return bookings.some((booking) => {
      if (booking.date !== dateStr) return false;

      return (
        (startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime) ||
        (startTime <= booking.startTime && endTime >= booking.endTime)
      );
    });
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (data: BookingFormData) => {
    if (isTimeOccupied(data.startTime, data.endTime)) {
      form.setError("startTime", {
        message: "Selected time is already occupied",
      });
      return;
    }

    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
    form.reset();
  };

  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const occupied = isTimeOccupied(startTime, endTime);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* HEADER */}
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

        {/* TIME SELECTION */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Select Time</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* START TIME */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className={cn(
                        occupied &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* END TIME */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className={cn(
                        occupied &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* OCCUPIED WARNING */}
          {occupied && (
            <div className="mt-3 rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              ⚠ This time range is already occupied.
            </div>
          )}
        </div>

        {/* FORM */}
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
                      <Input type="email" placeholder="john@company.com" {...field} />
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
                      <Input placeholder="Team Meeting" {...field} />
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
                    <Textarea placeholder="Additional details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ACTIONS */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || occupied}
                className="flex-1"
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};
