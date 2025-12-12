import { useState } from "react";
import { useParams } from "react-router-dom";
interface ServiceStatus {
  id: string;
  name: string;
  logo: string; // URL or path to logo
  hasHD: boolean;
  enqueuedOn: string;
  deliveredOn: string;
  note: string;
  status: "Distributed" | "Pending" | "Failed" | "Queued";
}

const DUMMY_SERVICES: ServiceStatus[] = [
  {
    id: "1",
    name: "Amazon",
    logo: "/logos/amazon.png",
    hasHD: true,
    enqueuedOn: "May 22, 2025",
    deliveredOn: "May 22, 2025",
    note: "-",
    status: "Distributed",
  },
  {
    id: "2",
    name: "Anghami",
    logo: "/logos/anghami.png",
    hasHD: false,
    enqueuedOn: "May 22, 2025",
    deliveredOn: "May 22, 2025",
    note: "-",
    status: "Distributed",
  },
  {
    id: "3",
    name: "Audiomack",
    logo: "/logos/audiomack.png",
    hasHD: false,
    enqueuedOn: "May 22, 2025",
    deliveredOn: "May 22, 2025",
    note: "-",
    status: "Distributed",
  },
  {
    id: "4",
    name: "AWA",
    logo: "/logos/awa.png",
    hasHD: false,
    enqueuedOn: "May 22, 2025",
    deliveredOn: "May 22, 2025",
    note: "-",
    status: "Distributed",
  },
  {
    id: "5",
    name: "Boomplay",
    logo: "/logos/boomplay.png",
    hasHD: false,
    enqueuedOn: "May 22, 2025",
    deliveredOn: "May 22, 2025",
    note: "-",
    status: "Distributed",
  },
  {
    id: "6",
    name: "Deezer",
    logo: "/logos/deezer.png",
    hasHD: false,
    enqueuedOn: "May 22, 2025",
    deliveredOn: "May 22, 2025",
    note: "-",
    status: "Distributed",
  },
  // Add more as needed
];

export default function ReleaseDistrubutesPage() {
  const [activeTab, setActiveTab] = useState<
    | "All"
    | "Never Distributed"
    | "Processing"
    | "Issues"
    | "Distributed"
    | "Taken Down"
  >("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );
  const { id: releaseId } = useParams();
  const filteredServices = DUMMY_SERVICES.filter((service) => {
    // Implement filtering by activeTab if needed
    // For simplicity, just search for now
    return service.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div className="flex justify-between ">
        <h1 className="text-2xl">Distribution</h1>
        <h1 className="text-2xl">Distribution All</h1>
      </div>
      <div className="flex gap-6 border">
        <div>All</div>
        <div>Never Distributed</div>
        <div>Processing</div>
        <div>Issues</div>
        <div>Distributed</div>
        <div>Taken Down</div>
      </div>
    </div>
  );
}
