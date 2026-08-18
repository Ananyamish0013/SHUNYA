export interface Protocol {
  id: string;
  number: string;
  title: string;
  codename: string;
  description: string;
  classifiedTag: string;
  date: string;
  clearanceLevel: "LEVEL 1" | "LEVEL 2" | "LEVEL 3" | "LEVEL 4" | "TOP SECRET";
  difficulty: "ALPHA" | "BETA" | "GAMMA" | "DELTA" | "OMEGA";
  status: "available" | "locked";
  objectives: string[];
  briefing: string[];
  sector: string;
}

export const PROTOCOLS_DATA: Protocol[] = [
  {
    id: "1",
    number: "01",
    title: "PROTOCOL 01",
    codename: "PERIMETER SECURE",
    description:
      "Perimeter breach detected in Sector 04-A. Re-establish atmospheric stabilizers before containment failure.",
    classifiedTag: "CLASSIFIED // EYES ONLY",
    date: "2026.08.16",
    clearanceLevel: "LEVEL 1",
    difficulty: "ALPHA",
    status: "available",
    sector: "SECTOR 04-A",
    objectives: [
      "Secure atmospheric stabilizer terminal B-12",
      "Bypass corrupted bio-metric gate",
      "Deploy backup generator grid",
    ],
    briefing: [
      "Containment dome Alpha reporting 14% power. Re-align local power grid immediately.",
    ],
  },
  {
    id: "2",
    number: "02",
    title: "PROTOCOL 02",
    codename: "RESOURCE ACQUISITION",
    description:
      "Scavenge essential filtration units from high-density ruins post-sundown.",
    classifiedTag: "CLASSIFIED // EYES ONLY",
    date: "2026.08.17",
    clearanceLevel: "LEVEL 2",
    difficulty: "BETA",
    status: "available",
    sector: "URBAN RUINS SECTOR 09",
    objectives: [
      "Extract 4x filtration cartridges",
      "Avoid structural ash collapse zones",
    ],
    briefing: [
      "Low visibility window active. Retrieve canisters and evacuate.",
    ],
  },
  {
    id: "3",
    number: "03",
    title: "PROTOCOL 03",
    codename: "BLACKOUT TRANSMISSION",
    description:
      "Intercept subterranean radio beacons and decrypt emergency distress signals.",
    classifiedTag: "RESTRICTED // EYES ONLY",
    date: "2026.08.18",
    clearanceLevel: "LEVEL 3",
    difficulty: "GAMMA",
    status: "available",
    sector: "BUNKER NETWORK B-7",
    objectives: [
      "Align dish array to 142.805 MHz",
      "Decode encrypted emergency archive",
    ],
    briefing: [
      "Bunker B-7 broadcast detected. Extract signal payload.",
    ],
  },
  {
    id: "4",
    number: "04",
    title: "PROTOCOL 04",
    codename: "ATMOSPHERIC PURIFICATION",
    description:
      "Bypass containment grid and calibrate scrubbers before toxic ash density hits lethal levels.",
    classifiedTag: "TOP SECRET // DIRECTIVE 04",
    date: "2026.08.19",
    clearanceLevel: "LEVEL 4",
    difficulty: "DELTA",
    status: "available",
    sector: "CHEMICAL PLANT ZETA",
    objectives: [
      "Override scrubber manifold valve",
      "Purge toxic ash residue from coolant lines",
    ],
    briefing: [
      "Toxic ash saturation critical. Calibrate scrubber pumps immediately.",
    ],
  },
  {
    id: "5",
    number: "05",
    title: "PROTOCOL 05",
    codename: "SUB-SURFACE EXTRACTION",
    description:
      "Infiltrate flooded sewer channels to recover archival telemetry drives.",
    classifiedTag: "CLASSIFIED // EYES ONLY",
    date: "2026.08.20",
    clearanceLevel: "LEVEL 4",
    difficulty: "DELTA",
    status: "available",
    sector: "SUB-SURFACE VAULT 12",
    objectives: [
      "Extract optical memory core #03",
      "Evacuate before water surge cycle",
    ],
    briefing: [
      "Telemetry core contains key override codes. Retrieve before flood cycle.",
    ],
  },
  {
    id: "6",
    number: "06",
    title: "PROTOCOL 06",
    codename: "ZERO DAY INITIATION",
    description:
      "Final mission protocol. Override central core execution matrix and halt world collapse.",
    classifiedTag: "TOP SECRET // MAXIMUM CLEARANCE",
    date: "2026.08.21",
    clearanceLevel: "TOP SECRET",
    difficulty: "OMEGA",
    status: "available",
    sector: "COMMAND CORE CENTRAL",
    objectives: [
      "Access central zero day mainframe",
      "Execute protocol override sequence",
    ],
    briefing: [
      "Final system termination code active. Execute manual override.",
    ],
  },
];

export function getProtocolById(id: string): Protocol | undefined {
  return PROTOCOLS_DATA.find((p) => p.id === id);
}
