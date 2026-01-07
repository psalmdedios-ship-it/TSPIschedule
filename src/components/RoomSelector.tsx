"use client";

import { Room, ROOMS } from "@/types/booking";
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

export const RoomSelector = ({
  selectedRoomId,
  onSelectRoom,
}: RoomSelectorProps) => {
  return (
    <div className="max-w-md">
      <Select value={selectedRoomId} onValueChange={onSelectRoom}>
        <SelectTrigger>
          <SelectValue placeholder="Select meeting room" />
        </SelectTrigger>
        <SelectContent>
          {ROOMS.map((room: Room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
