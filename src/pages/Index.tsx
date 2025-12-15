import { useState, useEffect } from "react";
import { format } from "date-fns";
import { RoomSelector } from "@/components/RoomSelector";
import { Calendar } from "@/components/Calendar";
import { BookingForm } from "@/components/BookingForm";
import { BookingsList } from "@/components/BookingsList";
import { Booking } from "@/types/booking";
import { bookingAPI } from "@/lib/bookingStorage";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [selectedRoomId, setSelectedRoomId] = useState("tspi-east");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, [selectedRoomId]);

  const loadBookings = async () => {
    const data = await bookingAPI.getBookings(selectedRoomId);
    setBookings(data);
  };

  const handleBookingSubmit = async (formData: any) => {
    if (!formData.slots || formData.slots.length === 0) {
      toast({
        title: "No Slot Selected",
        description: "Please select at least one time slot.",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const slot of formData.slots) {
        const hasConflict = await bookingAPI.checkConflict(
          selectedRoomId,
          format(selectedDate, "yyyy-MM-dd"),
          slot.start,
          slot.end
        );

        if (hasConflict) {
          toast({
            title: "Booking Conflict",
            description: `Time slot ${slot.start} - ${slot.end} is already occupied.`,
            variant: "destructive",
          });
          return;
        }
      }

      // Create booking for each slot
      for (const slot of formData.slots) {
        await bookingAPI.createBooking({
          name: formData.name,
          email: formData.email,
          department: formData.department,
          meetingTitle: formData.meetingTitle,
          notes: formData.notes,
          roomId: selectedRoomId,
          date: format(selectedDate, "yyyy-MM-dd"),
          startTime: slot.start,
          endTime: slot.end,
        });
      }

      toast({
        title: "Booking Confirmed",
        description: "Your conference room has been successfully booked!",
      });

      loadBookings();
    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await bookingAPI.deleteBooking(id);
      toast({
        title: "Booking Cancelled",
        description: "The booking has been successfully cancelled.",
      });
      loadBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const roomBookings = bookings.filter((b) => b.roomId === selectedRoomId);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarDays className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">TSPI Conference Room Scheduler</h1>
              <p className="text-muted-foreground">Book your meeting space with ease</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Select a Conference Room</h2>
            <RoomSelector selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} />
          </section>

          <section>
            <Tabs defaultValue="booking" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="booking">New Booking</TabsTrigger>
                <TabsTrigger value="bookings">View Bookings</TabsTrigger>
              </TabsList>

              <TabsContent value="booking" className="space-y-6 mt-6">
                <Calendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  bookings={roomBookings}
                />

                <BookingForm
                  onSubmit={handleBookingSubmit}
                  roomId={selectedRoomId}
                  date={selectedDate}
                  bookings={roomBookings}
                />
              </TabsContent>

              <TabsContent value="bookings" className="mt-6">
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                  <h3 className="text-xl font-semibold mb-4">
                    Bookings for {format(selectedDate, "MMMM d, yyyy")}
                  </h3>
                  <BookingsList
                    bookings={roomBookings}
                    date={selectedDate}
                    onDeleteBooking={handleDeleteBooking}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
