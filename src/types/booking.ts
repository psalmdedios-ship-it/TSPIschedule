export interface Booking {
  id: string;
  name: string;
  email: string;
  department: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingTitle: string;
  notes?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  capacity?: number;
}

export const ROOMS: Room[] = [
  {
    id: "tspi-east",
    name: "TSPI East Conference Room",
    description: "Main conference room with video conferencing",
    capacity: 12,
  },
  {
    id: "powerchina-east",
    name: "East PowerChina Conference Room",
    description: "Executive meeting space",
    capacity: 8,
  },
  {
    id: "tspi-bess",
    name: "TSPI BESS Conference Room",
    description: "Technical discussion room",
    capacity: 10,
  },
];
