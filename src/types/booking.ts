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
    name: "TSPI East Meeting Room",
    description: "",
    capacity: 12,
  },
  {
    id: "powerchina-east",
    name: "East PowerChina Meeting Room",
    description: "",
    capacity: 8,
  },
  {
    id: "tspi-bess",
    name: "TSPI BESS Meeting Room",
    description: "",
    capacity: 10,
  },
];
