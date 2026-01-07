"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Room, ROOMS as DEFAULT_ROOMS } from "@/types/booking";

interface RoomsContextType {
  rooms: Room[];
  addRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
}

const RoomsContext = createContext<RoomsContextType | undefined>(undefined);

export const RoomsProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);

  const addRoom = (room: Room) => setRooms((prev) => [...prev, room]);
  const deleteRoom = (roomId: string) =>
    setRooms((prev) => prev.filter((r) => r.id !== roomId));

  return (
    <RoomsContext.Provider value={{ rooms, addRoom, deleteRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) throw new Error("useRooms must be used within RoomsProvider");
  return context;
};
