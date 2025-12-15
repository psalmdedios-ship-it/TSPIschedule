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

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(2, "Department is required"),
  meetingTitle: z.string().min(3, "Meeting title must be at least 3 characters"),
  notes: z.string().optional(),
  slots: z
    .array(
      z.object({
        start: z.string(),
        end: z.string(),
      })
    )
    .min(1, "Please select at least one time slot"),
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

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      meetingTitle: "",
      notes: "",
      slots: [],
    },
  });

  const room = ROOMS.find(r => r.id === roomId);
  const dateStr = format(date, "yyyy-MM-dd");

  // Returns how many bookings overlap with this slot
  const getOccupiedCount = (slot: { start: string; end: string }) => {
    return bookings.filter(b => b.date === dateStr && slot.start < b.endTime && slot.end > b.startTime).length;
  };

  const handleSlotToggle = (slot: { start: string; end: string }) => {
    const current = form.getValues("slots");
    const exists = current.some(s => s.start === slot.start && s.end === slot.end);
    const updated = exists ? current.filter(s => !(s.start === slot.start && s.end === slot.end)) : [...current, slot];
    form.setValue("slots", updated, { shouldValidate: true });
  };

  const handleSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    console.log("Submitting booking:", data);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
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

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Select Time Slot(s)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {TIME_SLOTS.map(slot => {
              const occupiedCount = getOccupiedCount(slot);
              const selected = form.watch("slots").some(s => s.start === slot.start && s.end === slot.end);

              return (
                <button
                  key={`${slot.start}-${slot.end}`}
                  type="button"
                  onClick={() => handleSlotToggle(slot)}
                  className={cn(
                    "p-3 rounded-lg border text-sm font-medium transition-all",
                    occupiedCount > 0 && !selected && "bg-destructive/10 border-destructive/50 text-destructive",
                    selected && "bg-primary text-primary-foreground border-primary"
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

          {form.formState.errors.slots && (
            <p className="text-sm text-destructive mt-2">{form.formState.errors.slots.message}</p>
          )}
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
