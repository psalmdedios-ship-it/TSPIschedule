import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, isBefore, isAfter, parse } from "date-fns";
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

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  department: z.string().min(2),
  meetingTitle: z.string().min(3),
  notes: z.string().optional(),
  startTime: z.string().min(5, "Start time is required"),
  endTime: z.string().min(5, "End time is required"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void> | void;
  roomId: string;
  date: Date;
  bookings: Booking[];
}

export const BookingForm = ({ onSubmit, roomId, date, bookings }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeError, setTimeError] = useState("");

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

  const checkConflict = (start: string, end: string) => {
    const s = parse(start, "HH:mm", new Date());
    const e = parse(end, "HH:mm", new Date());
    return bookings.some((b) => {
      const bStart = parse(b.startTime, "HH:mm", new Date());
      const bEnd = parse(b.endTime, "HH:mm", new Date());
      return s < bEnd && e > bStart;
    });
  };

  const handleSubmit = async (data: BookingFormData) => {
    const { startTime, endTime } = data;
    setTimeError("");

    if (isAfter(parse(startTime, "HH:mm", new Date()), parse(endTime, "HH:mm", new Date()))) {
      setTimeError("Start time must be before end time");
      return;
    }

    if (checkConflict(startTime, endTime)) {
      setTimeError("This time span is already occupied!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      alert("Booking failed. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Book Conference Room</h2>

        <div className="bg-muted p-4 rounded-lg grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Room:</span>
            <p className="font-semibold">{room?.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Date:</span>
            <p className="font-semibold">{format(date, "PPP")}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="department" render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="meetingTitle" render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="startTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time (HH:mm)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="time"
                      className={cn(timeError && "border-destructive")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="endTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time (HH:mm)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="time"
                      className={cn(timeError && "border-destructive")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {timeError && <p className="text-sm text-destructive">{timeError}</p>}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => form.reset()} className="flex-1">
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
