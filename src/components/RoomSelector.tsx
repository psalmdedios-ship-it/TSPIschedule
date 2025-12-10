import { ROOMS } from "@/types/booking";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomSelectorProps {
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

export const RoomSelector = ({ selectedRoomId, onSelectRoom }: RoomSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {ROOMS.map((room) => (
        <Card
          key={room.id}
          className={cn(
            "p-6 cursor-pointer transition-all hover:shadow-lg",
            selectedRoomId === room.id
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/50"
          )}
          onClick={() => onSelectRoom(room.id)}
        >
          <div className="flex items-start space-x-4">
            <div
              className={cn(
                "p-3 rounded-lg",
                selectedRoomId === room.id ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{room.name}</h3>
              <p className="text-sm text-muted-foreground">{room.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
