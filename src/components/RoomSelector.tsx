"use client";

import { useRooms } from "@/context/RoomsContext.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomSelectorProps {
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

export const RoomSelector = ({ selectedRoomId, onSelectRoom }: RoomSelectorProps) => {
  const { rooms } = useRooms();

  return (
    <div className="max-w-md">
      <Select value={selectedRoomId} onValueChange={onSelectRoom}>
        <SelectTrigger>
          <SelectValue placeholder="Select meeting room" />
        </SelectTrigger>
        <SelectContent>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
