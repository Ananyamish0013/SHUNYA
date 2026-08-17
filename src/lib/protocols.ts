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
      "Establish perimeter. Secure essential atmospheric stabilizers. Hostile entities reported in sectors 4 through 9. Proceed with extreme caution.",
    classifiedTag: "CLASSIFIED // EYES ONLY",
    date: "2026.08.16",
    clearanceLevel: "LEVEL 1",
    difficulty: "ALPHA",
    status: "available",
    sector: "SECTOR 04-A",
    objectives: [
      "Locate atmospheric stabilizer terminal B-12",
      "Bypass corrupted bio-metric security gate",
      "Deploy secondary power generator before sundown",
      "Confirm sector 4 perimeter isolation grid status",
    ],
    briefing: [
      "Sensors indicate catastrophic pressure drops in atmospheric containment dome Alpha. Auxiliary stabilizers are operating at 14% capacity.",
      "Scout teams have reported non-human thermal signatures patrolling sectors 4 through 9. Maintain radio silence during terminal alignment.",
    ],
  },
  {
    id: "2",
    number: "02",
    title: "PROTOCOL 02",
    codename: "RESOURCE ACQUISITION",
    description:
      "Resource acquisition. Scavenge phase initiates post-sundown. Target high-density urban ruins. Avoid structural anomalies and deep ash pockets.",
    classifiedTag: "CLASSIFIED // EYES ONLY",
    date: "2026.08.17",
    clearanceLevel: "LEVEL 2",
    difficulty: "BETA",
    status: "available",
    sector: "URBAN RUINS SECTOR 09",
    objectives: [
      "Locate central supply repository in sector 9 vault",
      "Extract 4x intact atmospheric filtration cartridges",
      "Avoid structural ash collapse zones along North Ridge",
      "Return telemetry report to base before 04:00 hours",
    ],
    briefing: [
      "The post-sundown window presents reduced thermal detection risk, but structural integrity of the high-rise ruins is decaying rapidly.",
      "Avoid deep ash pockets—recent seismic tremors have created sinkholes into subterranean gas channels.",
    ],
  },
  {
    id: "3",
    number: "03",
    title: "PROTOCOL 03",
    codename: "BLACKOUT TRANSMISSION",
    description:
      "Interception of low-frequency emergency radio beacons. Decrypt lost terminal signals from subterranean bunker network B-7.",
    classifiedTag: "RESTRICTED // EYES ONLY",
    date: "2026.08.18",
    clearanceLevel: "LEVEL 3",
    difficulty: "GAMMA",
    status: "available",
    sector: "BUNKER NETWORK B-7",
    objectives: [
      "Align dish array with frequency 142.805 MHz",
      "Isolate analog static noise from primary payload",
      "Decode encrypted emergency broadcast archive",
    ],
    briefing: [
      "An automated distress beacon from subterranean bunker B-7 began broadcasting 12 hours ago. Content remains heavily distorted by magnetic fallout.",
    ],
  },
  {
    id: "4",
    number: "04",
    title: "PROTOCOL 04",
    codename: "ATMOSPHERIC PURIFICATION",
    description:
      "Bypass core automated containment grid. Calibrate chemical scrubbers before airborne particulate density reaches lethal limits.",
    classifiedTag: "TOP SECRET // DIRECTIVE 04",
    date: "2026.08.19",
    clearanceLevel: "LEVEL 4",
    difficulty: "DELTA",
    status: "available",
    sector: "CHEMICAL PLANT ZETA",
    objectives: [
      "Manually override scrubber pump manifold valve",
      "Purge toxic ash residue from coolant lines",
      "Synchronize master control console with central grid",
    ],
    briefing: [
      "Toxic ash saturation in the lower atmosphere has reached critical thresholds. Scrubber failure will trigger automated bunker evacuation lockouts.",
    ],
  },
  {
    id: "5",
    number: "05",
    title: "PROTOCOL 05",
    codename: "SUB-SURFACE EXTRACTION",
    description:
      "Infiltrate flooded sewer networks. Recover dormant archival telemetry drives from pre-collapse data vaults.",
    classifiedTag: "CLASSIFIED // EYES ONLY",
    date: "2026.08.20",
    clearanceLevel: "LEVEL 4",
    difficulty: "DELTA",
    status: "available",
    sector: "SUB-SURFACE VAULT 12",
    objectives: [
      "Navigate lower aqueduct drainage tunnels",
      "Extract optical memory core from server rack #03",
      "Evacuate before water surge pump cycles",
    ],
    briefing: [
      "Pre-collapse telemetry logs contain key override codes for the central command array. Archives are submerged under 3 meters of particulate runoff.",
    ],
  },
  {
    id: "6",
    number: "06",
    title: "PROTOCOL 06",
    codename: "ZERO DAY INITIATION",
    description:
      "Final mission protocol. Override central core execution matrix and avert final world collapse protocol.",
    classifiedTag: "TOP SECRET // MAXIMUM CLEARANCE",
    date: "2026.08.21",
    clearanceLevel: "TOP SECRET",
    difficulty: "OMEGA",
    status: "available",
    sector: "COMMAND CORE CENTRAL",
    objectives: [
      "Access central zero day terminal mainframe",
      "Execute protocol override sequence key sequence",
      "Avert permanent system termination code",
    ],
    briefing: [
      "The final barrier between survival and permanent termination. Execute the terminal sequence under extreme pressure.",
    ],
  },
];

export function getProtocolById(id: string): Protocol | undefined {
  return PROTOCOLS_DATA.find((p) => p.id === id);
}
