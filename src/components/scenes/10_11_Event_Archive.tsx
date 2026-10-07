import React from "react";
import eventArchiveImage from "../../assets/images/sceneImages/10_Event_Archive.webp";

export interface EventItem {
  id: string;
  name: string;
  location: string;
  date: string;
  category: "Wedding" | "Sangeet" | "Club" | "Festival";
  attendees: string;
  energyScore: number;
  highlight: string;
}

export const EVENTS_DATA: EventItem[] = [
  {
    id: "elegance_party_plot",
    name: "Elegance Party Plot",
    location: "Rajkot, Gujarat",
    date: "20 JAN 2024",
    category: "Wedding",
    attendees: "1,800+",
    energyScore: 98,
    highlight:
      "Electrifying 4-hour nonstop marathon ending in synchronized crowd singalongs.",
  },
  {
    id: "phoenix_resort",
    name: "Phoenix Resort Arena",
    location: "Rajkot",
    date: "31 DEC 2023",
    category: "Festival",
    attendees: "2,500+",
    energyScore: 99,
    highlight:
      "Midnight countdown pyro explosion with thunderous progressive house drop.",
  },
  {
    id: "regency_lagoon",
    name: "Regency Lagoon Luxury Resort",
    location: "Rajkot Highway",
    date: "14 FEB 2024",
    category: "Sangeet",
    attendees: "1,200+",
    energyScore: 96,
    highlight:
      "Fusion Bollywood deep house set with live dhol synchronization.",
  },
  {
    id: "nirali_resort",
    name: "Nirali Resort Neon Night",
    location: "Kalawad Road, Rajkot",
    date: "18 NOV 2023",
    category: "Club",
    attendees: "1,500+",
    energyScore: 97,
    highlight:
      "Intense 360-degree laser cage setup with unreleased melodic techno edits.",
  },
  {
    id: "mtv_resort",
    name: "MTV Resort Sunsets",
    location: "Gondal Highway",
    date: "05 OCT 2023",
    category: "Festival",
    attendees: "900+",
    energyScore: 95,
    highlight:
      "Golden hour acoustic-to-electronic transition across the lakefront stage.",
  },
];

const EventArchiveScene: React.FC = () => {
  return (
    <div className="z-0 relative flex justify-center items-center w-screen h-screen bg-black overflow-hidden">
      {/* Main Image */}
      <img
        src={eventArchiveImage}
        alt="Event Entrance"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default EventArchiveScene;
