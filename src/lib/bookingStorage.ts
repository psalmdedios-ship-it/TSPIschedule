import { Booking } from "@/types/booking";
import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  CollectionReference,
  DocumentData,
  Query
} from "firebase/firestore";

const bookingCollection: CollectionReference<DocumentData> =
  collection(db, "bookings");

export const bookingAPI = {
  getBookings: async (roomId?: string, date?: string): Promise<Booking[]> => {
    let q: Query<DocumentData> = bookingCollection;

    const filters: any[] = [];

    if (roomId) filters.push(where("roomId", "==", roomId));
    if (date) filters.push(where("date", "==", date));

    if (filters.length > 0) {
      q = query(bookingCollection, ...filters);
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (docSnap) =>
        ({
          id: docSnap.id,
          ...docSnap.data(),
        } as Booking)
    );
  },

  checkConflict: async (
    roomId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Promise<boolean> => {
    const q = query(
      bookingCollection,
      where("roomId", "==", roomId),
      where("date", "==", date)
    );

    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const b = docSnap.data() as Booking;

      if (excludeId && docSnap.id === excludeId) continue;

      const bookingStart = b.startTime;
      const bookingEnd = b.endTime;

      const conflict =
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd);

      if (conflict) return true;
    }

    return false;
  },

  createBooking: async (
    booking: Omit<Booking, "id" | "createdAt">
  ): Promise<Booking> => {
    const newBooking = {
      ...booking,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(bookingCollection, newBooking);

    return {
      id: docRef.id,
      ...newBooking,
    };
  },

  deleteBooking: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "bookings", id));
  },
};
