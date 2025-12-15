import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parse, isAfter } from "date-fns";

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

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  department: z.string().min(2),
  meetingTitle: z.string().min(3),
  notes: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit: (data: any) => Promise<void> | void;
  roomId: string;
  date: Date;
  bookings: Booking[];
}

export const BookingForm = ({
  onSubmit,
  roomId,
  date,
}: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeError, setTimeError] = useState("");

  const form = useForm<BookingFormValues>({
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

  const handleSubmit = async (values: BookingFormValues) => {
    setTimeError("");

    const start = parse(
      `${dateStr} ${values.startTime}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );
    const end = parse(
      `${dateStr} ${values.endTime}`,
      "yyyy-MM-dd HH:mm",
      new Date()
    );

    if (isAfter(start, end) || start.getTime() === end.getTime()) {
      setTimeError("Start time must be before end time");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...values,
        slots: [
          {
            start: values.startTime,
            end: values.endTime,
          },
        ],
      });

      form.reset();
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
            <span className="text-muted-foreground">Room</span>
            <p className="font-semibold">{room?.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Date</span>
            <p className="font-semibold">{format(date, "PPP")}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {timeError && (
              <p className="text-sm text-destructive">{timeError}</p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};
