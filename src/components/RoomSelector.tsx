"use client";

import { useState } from "react";
import { ROOMS as DEFAULT_ROOMS, Room } from "@/types/booking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface RoomSelectorProps {
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

export const RoomSelector = ({
  selectedRoomId,
  onSelectRoom,
}: RoomSelectorProps) => {
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [newRoomName, setNewRoomName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addRoom = () => {
    if (!newRoomName.trim()) return;

    const newRoom: Room = {
      id: crypto.randomUUID(),
      name: newRoomName,
    };

    setRooms((prev) => [...prev, newRoom]);
    onSelectRoom(newRoom.id);
    setNewRoomName("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-3 max-w-md">
      {/* Dropdown */}
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

      {/* Add new room */}
      {isAdding ? (
        <div className="flex gap-2">
          <Input
            placeholder="New room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <Button onClick={addRoom}>Add</Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Meeting Room
        </Button>
      )}
    </div>
  );
};
