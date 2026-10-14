// Leadership page content: Benson Mambosho. Client names are deliberately replaced by industries.
// Dates are decimal years (2025.5 = mid 2025) so the career map can be drawn to scale.
export interface Skill { id: string; n: string; d: string; lv: number; top?: boolean }
export interface Role { id: string; l: number; r: number; s: number; e: number; now?: number; org: string; t: string; dt: string; sk: string[]; tags?: string[]; c: string; w: string; h: string }
export const MAP_START = 2015.67;
export const MAP_END = 2026.85;
export const skills: Skill[] = [
 {
  "id": "strategy",
  "n": "Strategy",
  "d": "Turning an organisation’s goals into a clear message, audience plan and measure of success.",
  "lv": 5,
  "top": 1
 },
 {
  "id": "c4d",
  "n": "Communication for development",
  "d": "Explaining programmes so communities, partners and government understand them.",
  "lv": 5
 },
 {
  "id": "sust",
  "n": "Sustainability storytelling",
  "d": "Reporting and campaigns tied to the Sustainable Development Goals.",
  "lv": 4
 },
 {
  "id": "media",
  "n": "Media and reputation",
  "d": "Press relations, crisis moments and brand launches.",
  "lv": 4
 },
 {
  "id": "digital",
  "n": "Digital and social",
  "d": "Platform growth, content, creative direction and measurement.",
  "lv": 5
 },
 {
  "id": "community",
  "n": "Community management",
  "d": "Building and looking after audiences and member networks.",
  "lv": 4
 },
 {
  "id": "lead",
  "n": "Team and programme leadership",
  "d": "Directing creative teams, chapters and multi-partner work.",
  "lv": 4
 },
 {
  "id": "coach",
  "n": "Coaching and mentoring",
  "d": "Developing students and early-career communicators.",
  "lv": 4
 }
];
export const lanes: { n: string; rows: number }[] = [{"n":"Leadership","rows":2},{"n":"Consulting","rows":1},{"n":"Agency and sustainability","rows":2},{"n":"Brand and digital","rows":3},{"n":"Writing","rows":2},{"n":"Mentoring and volunteering","rows":3}];
export const roles: Role[] = [
 {
  "id": "nm",
  "l": 0,
  "r": 0,
  "s": 2025,
  "e": 2026.85,
  "now": 1,
  "org": "Native Media",
  "t": "Founder and Head of Strategy",
  "dt": "Jan 2025 – present",
  "sk": [
   "strategy",
   "c4d",
   "sust",
   "lead",
   "media"
  ],
  "c": "Public institutions and development organisations have strong work but struggle to make it understood and trusted.",
  "w": "Founded a communications and strategy practice in Dar es Salaam built on insight, strategy and impact. Leads the thinking, the research and the client work.",
  "h": "A growing body of public-interest case studies, research and data stories that clients can use."
 },
 {
  "id": "ca",
  "l": 0,
  "r": 1,
  "s": 2026.25,
  "e": 2026.85,
  "now": 1,
  "org": "The Comms Avenue",
  "t": "Chapter Lead",
  "dt": "Apr 2026 – present",
  "sk": [
   "community",
   "lead",
   "coach"
  ],
  "c": "Communicators across Africa work in isolation, with few places to learn from one another.",
  "w": "Leads a local chapter of a pan-African network of 1,500+ professionals in 25 countries.",
  "h": "A stronger peer community for communicators in Tanzania."
 },
 {
  "id": "ic",
  "l": 1,
  "r": 0,
  "s": 2022.17,
  "e": 2025.42,
  "org": "Independent consultant",
  "t": "Development Communications Coordinator",
  "dt": "Mar 2022 – May 2025",
  "sk": [
   "strategy",
   "c4d",
   "media",
   "digital"
  ],
  "c": "Public bodies and regional brands needed communication that people would actually follow.",
  "w": "Trained customer-service teams at a national revenue authority in 2022. Designed media strategy for UAE-owned consumer brands across Tanzania, Rwanda and Kenya, 2022 to 2024.",
  "h": "Clearer public-facing service communication, and consistent regional media plans across three East African markets."
 },
 {
  "id": "hs",
  "l": 2,
  "r": 0,
  "s": 2020.83,
  "e": 2025.17,
  "org": "Hesa Africa",
  "t": "Senior PR and Communications Strategist, Sustainability Lead",
  "dt": "Nov 2020 – Mar 2025",
  "sk": [
   "strategy",
   "c4d",
   "sust",
   "media",
   "lead"
  ],
  "tags": [
   "SDG 6 Clean water",
   "SDG 4 Quality education",
   "SDG 8 Decent work",
   "SDG 5 Gender equality",
   "SDG 10 Reduced inequalities",
   "SDG 7 Clean energy"
  ],
  "c": "A leading brewer needed to show communities, government and investors that its sustainability promises were real. A national bank, a mobile-money and telecom foundation and an energy company each needed the public to understand a change in how people save, pay or fuel their lives.",
  "w": "Shaped a five-year sustainability roadmap and its annual Sustainability Reports. Built a media framework for a telecom foundation’s health and mobile-money work. Ran a heritage campaign for a major bank and the launch of a compressed natural gas station, plus a forum on financing clean three-wheelers.",
  "h": "Clean water for more than 1 million people. Scholarships and agribusiness training for 300+ young people. 200+ women and people with disabilities brought into a grain-to-glass supply chain. The bank campaign reached 1.5 million people with no extra paid media, and the new fuel was presented as about half the price of petrol. The brewer programme went on to win three Business SDG awards in 2024."
 },
 {
  "id": "fp",
  "l": 2,
  "r": 1,
  "s": 2020.33,
  "e": 2020.83,
  "org": "Frontline Porter Novelli",
  "t": "PR Manager",
  "dt": "May – Nov 2020",
  "sk": [
   "strategy",
   "media"
  ],
  "c": "Two major banks were merging, and customers, staff and the regulator all needed to trust the change.",
  "w": "Managed reputation and messaging for the regulator, the client and the public, including the day-one launch and rebrand.",
  "h": "A merger announced and launched under one clear, consistent story."
 },
 {
  "id": "vv",
  "l": 3,
  "r": 0,
  "s": 2019.83,
  "e": 2020.33,
  "org": "vivo",
  "t": "Digital Marketing Manager",
  "dt": "Nov 2019 – May 2020",
  "sk": [
   "digital",
   "strategy"
  ],
  "c": "A global phone brand was new to many Tanzanian audiences.",
  "w": "Ran digital marketing for the Tanzanian market.",
  "h": "More than 6 million impressions on launch content."
 },
 {
  "id": "tc",
  "l": 3,
  "r": 1,
  "s": 2018.58,
  "e": 2019.83,
  "org": "TECNO Mobile",
  "t": "Digital Manager",
  "dt": "Aug 2018 – Oct 2019",
  "sk": [
   "digital",
   "lead",
   "community",
   "strategy"
  ],
  "c": "A phone brand wanted to be part of young people’s lives, and to give something back.",
  "w": "Led the creative team, created a brand mascot, and ran a community campaign called “Kuwa Shujaa Wangu” (Be My Hero).",
  "h": "The campaign raised over 5 million TZS for a cause and reached more than 14 million impressions."
 },
 {
  "id": "sc",
  "l": 3,
  "r": 2,
  "s": 2016.75,
  "e": 2018.67,
  "org": "Smart Codes",
  "t": "Social Media Manager",
  "dt": "Oct 2016 – Aug 2018",
  "sk": [
   "digital",
   "community"
  ],
  "c": "Small and mid-size brands had little audience on social platforms.",
  "w": "Ran social media for agency clients, including an airline story that spread widely.",
  "h": "A single story passed 1 million impressions, and a client channel grew past 1,000 subscribers."
 },
 {
  "id": "jm",
  "l": 3,
  "r": 0,
  "s": 2015.67,
  "e": 2016.83,
  "org": "Jumia Tanzania",
  "t": "Social Media and Public Relations",
  "dt": "Sep 2015 – Oct 2016",
  "sk": [
   "digital",
   "media",
   "community"
  ],
  "c": "A new online marketplace needed to earn trust in Tanzania.",
  "w": "Built daily content and press relations for the jobs channel.",
  "h": "A jobs channel grew to 16,000 followers."
 },
 {
  "id": "ct",
  "l": 4,
  "r": 0,
  "s": 2018.67,
  "e": 2019.83,
  "org": "The Citizen",
  "t": "Columnist",
  "dt": "Sep 2018 – Oct 2019",
  "sk": [
   "media",
   "c4d"
  ],
  "c": "Digital and youth issues needed public debate.",
  "w": "Wrote a regular column for a national daily.",
  "h": "A public voice on communication and technology."
 },
 {
  "id": "ex",
  "l": 4,
  "r": 1,
  "s": 2019.17,
  "e": 2019.5,
  "org": "The Exchange",
  "t": "Columnist",
  "dt": "Mar – Jul 2019",
  "sk": [
   "media"
  ],
  "c": "Business readers wanted plain-language commentary.",
  "w": "Wrote a column for a business publication.",
  "h": "A second platform for commentary."
 },
 {
  "id": "bc",
  "l": 5,
  "r": 0,
  "s": 2021,
  "e": 2025.83,
  "org": "Bridge for Change",
  "t": "Communication Professional (volunteer)",
  "dt": "Jan 2021 – Nov 2025",
  "sk": [
   "c4d",
   "coach"
  ],
  "c": "Young people in Tanzania needed safe spaces to discuss issues that affect their welfare.",
  "w": "Mentored 10 young adults at Kijana Café, which uses art, storytelling, games and dialogue.",
  "h": "Nearly five years of sustained mentoring and community communication."
 },
 {
  "id": "un",
  "l": 5,
  "r": 1,
  "s": 2025.83,
  "e": 2026.08,
  "org": "United Nations Volunteers",
  "t": "Online Volunteer, UNDP",
  "dt": "Nov 2025 – Jan 2026",
  "sk": [
   "coach",
   "c4d"
  ],
  "c": "Young people in Bangladesh needed practical digital skills to find freelance and remote work.",
  "w": "Mentored 20 youth through the Global Mentorship Programme and Workwave Initiative, 10 hours a week for 8 weeks.",
  "h": "A UN Volunteers Certificate of Appreciation, linked to SDG 8."
 },
 {
  "id": "gm",
  "l": 5,
  "r": 2,
  "s": 2026,
  "e": 2026.85,
  "now": 1,
  "org": "Global Mentorship Initiative",
  "t": "Student Mentor",
  "dt": "Jan 2026 – present",
  "sk": [
   "coach",
   "lead"
  ],
  "c": "College students in France need guidance before their first career job.",
  "w": "Mentors them on networking, career planning, global business communication and interviews.",
  "h": "An Open Badge for the Mentor English Program, plus a global mentor network."
 }
];
