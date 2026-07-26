export const steveMitchell = {
  name: "Steve Mitchell",
  role: "Airport Noise",
  path: "/steve-mitchell",
  image: "/assets/team/steve-mitchell.webp",
  bio: [
    "Steve, based in the UK, has 35 years of experience in environmental noise management, including noise studies for 53 airports in 25 countries around the world. Steve has worked for the UK’s National Air Traffic Services and led the noise team at Environmental Resources Management, a global provider of environmental services, for six years before setting up Mitchell Environmental in 2020 to specialise in aviation noise. He has worked with London Gatwick Airport as noise advisor since 2014 for numerous noise impact and mitigation studies and noise assessments for two expansion plans.",
    "From his work for airport operators, owners and international lenders, including the International Finance Corporation, Steve has an in-depth understanding of the ICAO Balanced Approach to noise management. He helps develop appropriate noise management systems for airports in any regulatory environment.",
  ],
} as const;

export const team = [
  {
    group: "Directors",
    members: [
      { name: "Jim Robinson", role: "Airport Strategic Planning & Development", path: "/jim-robinson" },
      { name: "Jan Jansen", role: "Airport & Airline Operations", path: "/jan-jansen" },
    ],
  },
  {
    group: "Senior Advisors",
    members: [
      { name: "Mark Ahasic", role: "Airport & Airline Planning & Operations", path: "/mark-ahasic" },
      { name: "Graham Bland", role: "Airport Project Delivery", path: "/graham-bland" },
      { name: "John Carr", role: "ATM Policy & Regulations", path: "/john-carr" },
      {
        name: "Luca Ciarlini",
        role: "Airline & Airport Operations and Network Planning",
        path: "/luca-ciarlini",
      },
      {
        name: "Paul Hooper",
        role: "Aviation Economics, Competition & Policy",
        path: "/paul-hooper",
      },
      {
        name: "Michael Kellaway",
        role: "Strategic Planner, Policy & Regulation",
        path: "/micheal-kellaway",
      },
      {
        name: "Graham Lake",
        role: "Air Traffic Management & Technology",
        path: "/graham-lake",
      },
      {
        name: "Bob McKinley",
        role: "Airport Operations & Technology",
        path: "/bob-mckinley",
      },
      {
        name: "Wayne Pearce",
        role: "Airline Strategy and Interface Management",
        path: "/wayne-pearce",
      },
      {
        name: "Justin Powell",
        role: "Airport Business & Market Analysis",
        path: "/justin-powell",
      },
      {
        name: "Johan Schölvinck",
        role: "Airport Commercial Development",
        path: "/johan-scholvinck",
      },
      {
        name: "Simon Walker",
        role: "Airport Regulation & Personnel Training",
        path: "/simon-walker",
      },
      steveMitchell,
      {
        name: "Geoffrey White",
        role: "Institutional Organisation & Management",
        path: "/geoffrey-white",
      },
      {
        name: "Roderick Wilcock",
        role: "Airport Ground Handling & Support Services",
        path: "/roderickwilcock",
      },
    ],
  },
] as const;

export const projectGroups = [
  {
    region: "Europe",
    projects: [
      { title: "Safety Management Systems", path: "/safety-management-systems" },
      { title: "Dusseldorf Airport GMBH – Airport Restructuring", path: "/dusseldorf-airport-gmbh" },
      { title: "Terminal Planning Study for Dublin International Airport", path: "/master-plan-dublin-int-airport" },
      { title: "Master Plan for New Istanbul International Airport", path: "/master-plan-new-istanbul-airport" },
      { title: "Paris CDG T4 Evaluation", path: "/pariscdgt4evaluation" },
      { title: "Shannon Group Strategic Review", path: "/shannon-group-strategic-review" },
      {
        title: "Warsaw Solidarity Transport Hub Advisory Services",
        path: "/solidarity-transport-hub-advisory-services",
      },
    ],
  },
  {
    region: "Middle East",
    projects: [
      {
        title: "King Salman International Airport, Riyadh",
        path: "/king-salman-international-airport",
      },
      { title: "Certification Private Terminals in Jeddah & Riyadh", path: "/terminalsjeddahriyadh" },
      { title: "Master Plan for Abu Dhabi International Airport", path: "/master-plan-abudhabiintairport" },
      { title: "Master Plan for Dubai World Central", path: "/master-plan-dubai-world-central" },
      { title: "Rabigh Wings Aviation Academy Certification", path: "/rwaa-certification" },
      { title: "SACC Operations Review, Terminal ORAT and Strategic Review", path: "/sacc-terminal-orat" },
      { title: "SANS Organisation Structure Review", path: "/sans-organisation-structure-review" },
      { title: "Taif Airport Privatization Advisory Services", path: "/taif-airport-privatization" },
      {
        title: "Al Qassim & Hail Airports Privatization Advisory Services",
        path: "/al-qassim-and-hail-airports-privatization",
      },
      { title: "Dammam Commercial and Aeronautical Business Development Review" },
    ],
  },
  {
    region: "Asia Pacific",
    projects: [
      { title: "Master Plan for Western Sydney Airport", path: "/masterplan-western-sydney-airport" },
      { title: "Brunei Aeronautical Revenue Review" },
    ],
  },
  {
    region: "North America",
    projects: [
      {
        title: "Vancouver Airport – Airport Operations & Customer Care Diagnostic",
        path: "/vancouver-airport-operations",
      },
      {
        title: "Vancouver Airport Operations Diagnostic",
        path: "/yvr-operations-diagnostic",
      },
    ],
  },
  {
    region: "Africa",
    projects: [
      {
        title: "Terminal Planning for Kotoka International Airport – Accra, Ghana",
        path: "/master-plan-kotoka-int-airport",
      },
    ],
  },
] as const;

export const personPaths = new Set(
  team.flatMap((group) => group.members.map((member) => member.path)),
);

export const projectPaths = new Set(
  projectGroups.flatMap((group) =>
    group.projects.flatMap((project) => ("path" in project ? [project.path] : [])),
  ),
);
