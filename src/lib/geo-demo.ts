export type IssueDemo = { id: number; title: string };
export type ProposalDemo = { id: number; title: string };

export type CountryDemo = {
  slug: string;
  name: string;
  flag: string;
  citizens: string; // demo humanized string
  policies: string[]; // e.g., "USA/Transport"
  issues: IssueDemo[];
  proposals: ProposalDemo[];
  cities: { slug: string; name: string }[];
};

export type CityDemo = {
  slug: string;
  name: string;
  flag: string;
  countrySlug: string;
  countryName: string;
  citizens: string;
  policies: string[];
  issues: IssueDemo[];
  proposals: ProposalDemo[];
};

export const countries: CountryDemo[] = [
  {
    slug: "united-states",
    name: "United States",
    flag: "🇺🇸",
    citizens: "333M",
    policies: ["USA/Transport", "USA/Housing", "USA/Climate"],
    issues: [
      { id: 128, title: "Protected intersections" },
      { id: 134, title: "Transit reliability" },
    ],
    proposals: [
      { id: 9001, title: "Night bus expansion" },
      { id: 9005, title: "Building efficiency codes" },
    ],
    cities: [
      { slug: "san-francisco", name: "San Francisco" },
      { slug: "new-york", name: "New York" },
      { slug: "austin", name: "Austin" },
    ],
  },
  {
    slug: "germany",
    name: "Germany",
    flag: "🇩🇪",
    citizens: "84M",
    policies: ["Germany/Energy", "Germany/Transport"],
    issues: [
      { id: 55, title: "Rail punctuality" },
      { id: 62, title: "EV charging" },
    ],
    proposals: [{ id: 9002, title: "S-Bahn priority lanes" }],
    cities: [
      { slug: "berlin", name: "Berlin" },
      { slug: "munich", name: "Munich" },
    ],
  },
  {
    slug: "japan",
    name: "Japan",
    flag: "🇯🇵",
    citizens: "124M",
    policies: ["Japan/Transport", "Japan/Disaster-Readiness"],
    issues: [
      { id: 22, title: "Flood mitigation" },
      { id: 31, title: "Platform safety" },
    ],
    proposals: [{ id: 9006, title: "Shinkansen off-peak pricing" }],
    cities: [
      { slug: "tokyo", name: "Tokyo" },
      { slug: "osaka", name: "Osaka" },
    ],
  },
  {
    slug: "brazil",
    name: "Brazil",
    flag: "🇧🇷",
    citizens: "203M",
    policies: ["Brazil/Housing", "Brazil/Transport"],
    issues: [
      { id: 77, title: "BRT expansion" },
      { id: 81, title: "Housing subsidy" },
    ],
    proposals: [{ id: 9007, title: "Favela upgrading program" }],
    cities: [
      { slug: "sao-paulo", name: "São Paulo" },
      { slug: "rio-de-janeiro", name: "Rio de Janeiro" },
    ],
  },
  {
    slug: "india",
    name: "India",
    flag: "🇮🇳",
    citizens: "1.43B",
    policies: ["India/Urban", "India/Transport"],
    issues: [
      { id: 204, title: "Metro interchanges" },
      { id: 219, title: "Air quality" },
    ],
    proposals: [{ id: 9003, title: "E-bus procurement" }],
    cities: [
      { slug: "mumbai", name: "Mumbai" },
      { slug: "bengaluru", name: "Bengaluru" },
      { slug: "delhi", name: "Delhi" },
    ],
  },
];

export const cities: CityDemo[] = [
  {
    slug: "san-francisco",
    name: "San Francisco",
    flag: "🇺🇸",
    countrySlug: "united-states",
    countryName: "United States",
    citizens: "0.81M",
    policies: ["SF/Transport", "SF/Housing"],
    issues: [
      { id: 18, title: "Bike lane safety" },
      { id: 24, title: "Transit signal priority" },
    ],
    proposals: [{ id: 9001, title: "Congestion pricing pilot" }],
  },
  {
    slug: "berlin",
    name: "Berlin",
    flag: "🇩🇪",
    countrySlug: "germany",
    countryName: "Germany",
    citizens: "3.6M",
    policies: ["Berlin/Mobility", "Berlin/Sustainability"],
    issues: [{ id: 12, title: "Fahrradstraße expansion" }],
    proposals: [{ id: 9008, title: "U-Bahn accessibility upgrades" }],
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    flag: "🇯🇵",
    countrySlug: "japan",
    countryName: "Japan",
    citizens: "13.9M",
    policies: ["Tokyo/Transport", "Tokyo/Resilience"],
    issues: [{ id: 33, title: "Platform doors coverage" }],
    proposals: [{ id: 9009, title: "Night service adjustments" }],
  },
  {
    slug: "sao-paulo",
    name: "São Paulo",
    flag: "🇧🇷",
    countrySlug: "brazil",
    countryName: "Brazil",
    citizens: "12.3M",
    policies: ["SaoPaulo/Housing", "SaoPaulo/Transport"],
    issues: [{ id: 71, title: "BRT capacity" }],
    proposals: [{ id: 9010, title: "Bicycle superhighway" }],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    flag: "🇮🇳",
    countrySlug: "india",
    countryName: "India",
    citizens: "12.5M",
    policies: ["Mumbai/Urban", "Mumbai/Transport"],
    issues: [{ id: 201, title: "Last-mile connectivity" }],
    proposals: [{ id: 9011, title: "Harbour line upgrade" }],
  },
];

export function findCountry(slug: string): CountryDemo | undefined {
  return countries.find((c) => c.slug === slug);
}

export function findCity(slug: string): CityDemo | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getPolicyContext(org: string, repo: string):
  | {
      countrySlug: string;
      countryName: string;
      countryFlag: string;
      citySlug?: string;
      cityName?: string;
      cityFlag?: string;
    }
  | undefined {
  const policyId = `${org}/${repo}`;

  // Try find by city first
  for (const city of cities) {
    if (city.policies.includes(policyId)) {
      return {
        countrySlug: city.countrySlug,
        countryName: city.countryName,
        countryFlag: countries.find((c) => c.slug === city.countrySlug)?.flag || "",
        citySlug: city.slug,
        cityName: city.name,
        cityFlag: city.flag,
      };
    }
  }

  // Try find by country
  for (const country of countries) {
    if (country.policies.includes(policyId)) {
      return {
        countrySlug: country.slug,
        countryName: country.name,
        countryFlag: country.flag,
      };
    }
  }

  return undefined;
}

// Demo indices to resolve Issue/Proposal → Policy/City/Country
type IssueCtx = { id: number; org: string; repo: string; citySlug?: string; countrySlug?: string };
type ProposalCtx = { id: number; org: string; repo: string; citySlug?: string; countrySlug?: string };

const issueIndex: IssueCtx[] = [
  { id: 128, org: "SF", repo: "Transport", citySlug: "san-francisco", countrySlug: "united-states" },
  { id: 55, org: "Germany", repo: "Transport", citySlug: "berlin", countrySlug: "germany" },
  { id: 204, org: "India", repo: "Urban", citySlug: "mumbai", countrySlug: "india" },
  { id: 18, org: "SF", repo: "Transport", citySlug: "san-francisco", countrySlug: "united-states" },
  { id: 24, org: "SF", repo: "Transport", citySlug: "san-francisco", countrySlug: "united-states" },
  { id: 12, org: "Berlin", repo: "Mobility", citySlug: "berlin", countrySlug: "germany" },
  { id: 33, org: "Tokyo", repo: "Resilience", citySlug: "tokyo", countrySlug: "japan" },
  { id: 71, org: "SaoPaulo", repo: "Transport", citySlug: "sao-paulo", countrySlug: "brazil" },
  { id: 201, org: "Mumbai", repo: "Urban", citySlug: "mumbai", countrySlug: "india" },
];

const proposalIndex: ProposalCtx[] = [
  { id: 9001, org: "SF", repo: "Transport", citySlug: "san-francisco", countrySlug: "united-states" },
  { id: 9002, org: "Germany", repo: "Transport", citySlug: "berlin", countrySlug: "germany" },
  { id: 9003, org: "India", repo: "Transport", citySlug: "mumbai", countrySlug: "india" },
  { id: 9004, org: "SF", repo: "Transport", citySlug: "san-francisco", countrySlug: "united-states" },
  { id: 9005, org: "USA", repo: "Climate", countrySlug: "united-states" },
  { id: 9006, org: "Japan", repo: "Transport", countrySlug: "japan" },
  { id: 9007, org: "Brazil", repo: "Housing", countrySlug: "brazil" },
  { id: 9008, org: "Berlin", repo: "Mobility", citySlug: "berlin", countrySlug: "germany" },
  { id: 9009, org: "Tokyo", repo: "Transport", citySlug: "tokyo", countrySlug: "japan" },
  { id: 9010, org: "SaoPaulo", repo: "Transport", citySlug: "sao-paulo", countrySlug: "brazil" },
  { id: 9011, org: "Mumbai", repo: "Transport", citySlug: "mumbai", countrySlug: "india" },
];

export function findIssueContext(id: number):
  | {
      policyPath: string;
      countrySlug?: string;
      countryName?: string;
      countryFlag?: string;
      citySlug?: string;
      cityName?: string;
      cityFlag?: string;
    }
  | undefined {
  const entry = issueIndex.find((e) => e.id === id);
  if (!entry) return undefined;
  const ctx = getPolicyContext(entry.org, entry.repo);
  return {
    policyPath: `${entry.org}/${entry.repo}`,
    countrySlug: ctx?.countrySlug,
    countryName: ctx?.countryName,
    countryFlag: ctx?.countryFlag,
    citySlug: ctx?.citySlug,
    cityName: ctx?.cityName,
    cityFlag: ctx?.cityFlag,
  };
}

export function findProposalContext(id: number):
  | {
      policyPath: string;
      countrySlug?: string;
      countryName?: string;
      countryFlag?: string;
      citySlug?: string;
      cityName?: string;
      cityFlag?: string;
    }
  | undefined {
  const entry = proposalIndex.find((e) => e.id === id);
  if (!entry) return undefined;
  const ctx = getPolicyContext(entry.org, entry.repo);
  return {
    policyPath: `${entry.org}/${entry.repo}`,
    countrySlug: ctx?.countrySlug,
    countryName: ctx?.countryName,
    countryFlag: ctx?.countryFlag,
    citySlug: ctx?.citySlug,
    cityName: ctx?.cityName,
    cityFlag: ctx?.cityFlag,
  };
}


