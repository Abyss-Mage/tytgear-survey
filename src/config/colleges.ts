import { CollegeInfo } from "@/types/survey";

export const COLLEGES: CollegeInfo[] = [
  {
    id: "ABC123",
    name: "Delhi Technological University (DTU)",
    city: "New Delhi",
    state: "Delhi",
    active: true,
  },
  {
    id: "DEF456",
    name: "BITS Pilani",
    city: "Pilani",
    state: "Rajasthan",
    active: true,
  },
  {
    id: "GHI789",
    name: "IIT Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    active: true,
  },
  {
    id: "IITD01",
    name: "IIT Delhi",
    city: "New Delhi",
    state: "Delhi",
    active: true,
  },
  {
    id: "IITM01",
    name: "IIT Madras",
    city: "Chennai",
    state: "Tamil Nadu",
    active: true,
  },
  {
    id: "IITK01",
    name: "IIT Kharagpur",
    city: "Kharagpur",
    state: "West Bengal",
    active: true,
  },
  {
    id: "IITR01",
    name: "IIT Roorkee",
    city: "Roorkee",
    state: "Uttarakhand",
    active: true,
  },
  {
    id: "VIT01",
    name: "VIT Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    active: true,
  },
  {
    id: "SRM01",
    name: "SRM Institute of Science and Technology",
    city: "Chennai",
    state: "Tamil Nadu",
    active: true,
  },
  {
    id: "MANIPAL01",
    name: "Manipal Academy of Higher Education (MAHE)",
    city: "Manipal",
    state: "Karnataka",
    active: true,
  },
  {
    id: "DU01",
    name: "University of Delhi (DU)",
    city: "New Delhi",
    state: "Delhi",
    active: true,
  },
  {
    id: "PES01",
    name: "PES University",
    city: "Bengaluru",
    state: "Karnataka",
    active: true,
  },
  {
    id: "THAPAR01",
    name: "Thapar Institute of Engineering and Technology",
    city: "Patiala",
    state: "Punjab",
    active: true,
  },
  {
    id: "OTHER",
    name: "Other / Not specified",
    city: "Not specified",
    state: "Not specified",
    active: true,
  },
];

export const FALLBACK_COLLEGE: CollegeInfo = {
  id: "OTHER",
  name: "Other / Not specified",
  city: "Not specified",
  state: "Not specified",
  active: true,
};

/**
 * Validate and resolve college by code/id.
 * Case-insensitive lookup. Falls back to FALLBACK_COLLEGE if invalid or missing.
 */
export function resolveCollege(code?: string | null): CollegeInfo {
  if (!code) return FALLBACK_COLLEGE;
  const normalized = code.trim().toUpperCase();
  const match = COLLEGES.find(
    (c) => c.id.toUpperCase() === normalized && c.active
  );
  return match || FALLBACK_COLLEGE;
}
