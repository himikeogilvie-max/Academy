// ============================================================================
//  COLAB ACADEMY — default content
//  Everything here is the *seed*. Once loaded, content lives in the store and
//  is fully editable in-app (Edit mode) + persisted to localStorage.
// ============================================================================

export type Step = { id: string; label: string; attachment?: { name: string; url: string } };

export type Lesson = {
  id: string;
  title: string;
  duration: string; // display only
  videoUrl: string;
  description: string;
  steps: Step[];
};

export type Module = {
  id: string;
  index: string; // e.g. "01"
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type ResourceLink = {
  id: string;
  name: string;
  category: string;
  url: string;
  note: string;
  download?: boolean; // true = downloadable resource, false/undefined = link to an app
};

export type Call = {
  id: string;
  type: "group" | "1:1";
  title: string;
  date: string; // ISO
  duration: string;
  host: string;
  added?: boolean;
  joinUrl?: string;
  owner?: string; // member the 1:1 belongs to; group calls have no owner
};

export type Recording = {
  id: string;
  title: string;
  date: string;
  duration: string;
  videoUrl: string;
  tag: string;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  location: string;
  lat: number;
  lng: number;
};

// Sample videos so completion tracking actually works end-to-end.
const V1 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
const V2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
const V3 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4";
const V4 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

export const BRAND = {
  name: "juice.ext",
  tagline: "AI film, engineered",
  program: "AI Filmmakers Collective",
  cohort: "Cohort 01 — 6 Month Program",
};

export const MODULES: Module[] = [
  {
    id: "m1",
    index: "01",
    title: "Foundations — The AI Film Stack",
    summary: "Map the entire generative pipeline before touching a single prompt.",
    lessons: [
      {
        id: "m1l1",
        title: "The New Production Reality",
        duration: "14:22",
        videoUrl: V1,
        description:
          "Where AI sits inside a real studio pipeline — and where it absolutely does not. We build the mental model for the next six months.",
        steps: [
          { id: "m1l1s1", label: "Download the AI Film Stack map", attachment: { name: "ai-film-stack.pdf", url: "#" } },
          { id: "m1l1s2", label: "Audit your current toolchain in the worksheet", attachment: { name: "toolchain-audit.xlsx", url: "#" } },
          { id: "m1l1s3", label: "Post your studio intro in the community" },
        ],
      },
      {
        id: "m1l2",
        title: "Context, Intent & Brand Intelligence",
        duration: "21:08",
        videoUrl: V2,
        description:
          "Nature doesn't guess — and neither should your outputs. Building a context system so every render is on-brand and on-intent.",
        steps: [
          { id: "m1l2s1", label: "Build your master context document" },
          { id: "m1l2s2", label: "Define 3 reference boards" },
        ],
      },
      {
        id: "m1l3",
        title: "Hardware, Pipelines & Throughput",
        duration: "17:45",
        videoUrl: V3,
        description: "Local vs cloud, GPU economics, and how to render at studio throughput without burning capital.",
        steps: [
          { id: "m1l3s1", label: "Run the cost-per-shot calculator" },
          { id: "m1l3s2", label: "Choose your render backbone" },
        ],
      },
    ],
  },
  {
    id: "m2",
    index: "02",
    title: "Pre-Production & Story Systems",
    summary: "Turn a logline into a shot-ready, AI-native production bible.",
    lessons: [
      {
        id: "m2l1",
        title: "Story Architecture for Generative Film",
        duration: "26:11",
        videoUrl: V4,
        description: "Structure that survives the model — writing for a pipeline that improvises.",
        steps: [
          { id: "m2l1s1", label: "Draft your logline + beat sheet" },
          { id: "m2l1s2", label: "Generate 3 narrative variants" },
          { id: "m2l1s3", label: "Lock the spine of your piece" },
        ],
      },
      {
        id: "m2l2",
        title: "Character & World Bibles",
        duration: "19:33",
        videoUrl: V1,
        description: "Consistent characters across thousands of frames using identity systems and seed discipline.",
        steps: [
          { id: "m2l2s1", label: "Build a character identity sheet" },
          { id: "m2l2s2", label: "Lock seeds & style tokens" },
        ],
      },
    ],
  },
  {
    id: "m3",
    index: "03",
    title: "Generative Image & Style",
    summary: "Direct the frame: composition, lighting, lensing and a signature look.",
    lessons: [
      {
        id: "m3l1",
        title: "Cinematic Prompting as Direction",
        duration: "23:50",
        videoUrl: V2,
        description: "Stop describing, start directing. Lens language, blocking and light as prompt primitives.",
        steps: [
          { id: "m3l1s1", label: "Build your lens & lighting vocabulary" },
          { id: "m3l1s2", label: "Produce a 12-frame look test" },
        ],
      },
      {
        id: "m3l2",
        title: "Style Transfer & Signature Looks",
        duration: "18:02",
        videoUrl: V3,
        description: "Engineer a look nobody can copy — LoRAs, references and grade-baked aesthetics.",
        steps: [
          { id: "m3l2s1", label: "Train / assemble a style reference set" },
          { id: "m3l2s2", label: "Define your signature grade" },
        ],
      },
    ],
  },
  {
    id: "m4",
    index: "04",
    title: "Motion & Video Models",
    summary: "From still to sequence — camera moves, continuity and shot assembly.",
    lessons: [
      {
        id: "m4l1",
        title: "Directing Motion Models",
        duration: "29:14",
        videoUrl: V4,
        description: "Camera language for video models: push-ins, parallax, and controlled chaos.",
        steps: [
          { id: "m4l1s1", label: "Storyboard 5 hero shots" },
          { id: "m4l1s2", label: "Generate + select takes" },
          { id: "m4l1s3", label: "Assemble a 20s sequence" },
        ],
      },
      {
        id: "m4l2",
        title: "Continuity & Shot Matching",
        duration: "22:40",
        videoUrl: V1,
        description: "Hold the illusion across cuts — matching light, motion and grain.",
        steps: [{ id: "m4l2s1", label: "Run a continuity pass on your sequence" }],
      },
    ],
  },
  {
    id: "m5",
    index: "05",
    title: "Sound, Post & Delivery",
    summary: "Score, mix, composite and deliver at a standard clients pay premium for.",
    lessons: [
      {
        id: "m5l1",
        title: "Score, Voice & Sound Design",
        duration: "20:18",
        videoUrl: V2,
        description: "The 50% of film nobody sees — building an emotional audio bed.",
        steps: [
          { id: "m5l1s1", label: "Generate a temp score" },
          { id: "m5l1s2", label: "Design 3 key sound moments" },
        ],
      },
      {
        id: "m5l2",
        title: "Compositing & Final Grade",
        duration: "25:55",
        videoUrl: V3,
        description: "Stitch the pipeline together in post — cleanups, comp and the final look.",
        steps: [
          { id: "m5l2s1", label: "Composite your hero sequence" },
          { id: "m5l2s2", label: "Apply final grade + export master" },
        ],
      },
      {
        id: "m5l3",
        title: "Delivery, Clients & Pricing",
        duration: "31:07",
        videoUrl: V4,
        description: "Package and sell the work — decks, deliverables and pricing for studios.",
        steps: [
          { id: "m5l3s1", label: "Build your delivery package template" },
          { id: "m5l3s2", label: "Submit final film for 1:1 review" },
        ],
      },
    ],
  },
];

export const LINKS: ResourceLink[] = [
  { id: "lk1", name: "Runway", category: "Video", url: "https://runwayml.com", note: "Gen-3 motion + video-to-video" },
  { id: "lk2", name: "Kling", category: "Video", url: "https://klingai.com", note: "Long-form motion, strong physics" },
  { id: "lk3", name: "Midjourney", category: "Image", url: "https://midjourney.com", note: "Frames, style refs, look dev" },
  { id: "lk4", name: "Flux", category: "Image", url: "https://blackforestlabs.ai", note: "High-fidelity stills + LoRAs" },
  { id: "lk5", name: "ElevenLabs", category: "Audio", url: "https://elevenlabs.io", note: "Voice + sound design" },
  { id: "lk6", name: "Suno", category: "Audio", url: "https://suno.com", note: "Score & temp music" },
  { id: "lk7", name: "Topaz", category: "Post", url: "https://topazlabs.com", note: "Upscale + frame interpolation" },
  { id: "lk8", name: "DaVinci Resolve", category: "Post", url: "https://blackmagicdesign.com", note: "Edit, comp & grade" },
  { id: "lk9", name: "ComfyUI", category: "Pipeline", url: "https://github.com/comfyanonymous/ComfyUI", note: "Node-based control" },
  { id: "lk10", name: "Look-dev Checklist", category: "Guides", url: "#", note: "Printable PDF", download: true },
  { id: "lk11", name: "AI Film Stack Map", category: "Guides", url: "#", note: "Reference diagram", download: true },
];

export const CALLS: Call[] = [
  { id: "c1", type: "group", title: "Weekly Group Coaching — Look Dev Reviews", date: "2026-06-30T17:00:00Z", duration: "90 min", host: "Mike" },
  { id: "c2", type: "1:1", title: "1:1 Review — Studio Pipeline", date: "2026-07-02T15:00:00Z", duration: "45 min", host: "Mike", owner: "me" },
  { id: "c3", type: "group", title: "Weekly Group Coaching — Motion Models", date: "2026-07-07T17:00:00Z", duration: "90 min", host: "Mike" },
  { id: "c4", type: "group", title: "Weekly Group Coaching — Sound & Score", date: "2026-07-14T17:00:00Z", duration: "90 min", host: "Mike" },
];

export const RECORDINGS: Recording[] = [
  { id: "r1", title: "Group Call — Foundations & The Stack", date: "2026-06-23", duration: "92 min", videoUrl: V1, tag: "GROUP" },
  { id: "r2", title: "Group Call — Cinematic Prompting Deep Dive", date: "2026-06-16", duration: "88 min", videoUrl: V2, tag: "GROUP" },
  { id: "r3", title: "Guest Session — VFX Supervisor Q&A", date: "2026-06-09", duration: "74 min", videoUrl: V3, tag: "GUEST" },
  { id: "r4", title: "Group Call — Kickoff & Onboarding", date: "2026-06-02", duration: "61 min", videoUrl: V4, tag: "GROUP" },
];

// Clients across the world → dots on the globe.
export const MEMBERS: Member[] = [
  { id: "u1", name: "Aria Mensah", role: "VFX Studio Lead", location: "Los Angeles, US", lat: 34.05, lng: -118.24 },
  { id: "u2", name: "Lukas Hoffmann", role: "Director", location: "Berlin, DE", lat: 52.52, lng: 13.4 },
  { id: "u3", name: "Yuki Tanaka", role: "Music Producer", location: "Tokyo, JP", lat: 35.68, lng: 139.69 },
  { id: "u4", name: "Sofia Rossi", role: "Creative Director", location: "Milan, IT", lat: 45.46, lng: 9.19 },
  { id: "u5", name: "James Okoro", role: "Hollywood Studio", location: "Atlanta, US", lat: 33.75, lng: -84.39 },
  { id: "u6", name: "Mei Lin", role: "VFX Artist", location: "Singapore, SG", lat: 1.35, lng: 103.82 },
  { id: "u7", name: "Olivia Brooks", role: "Composer", location: "London, UK", lat: 51.51, lng: -0.13 },
  { id: "u8", name: "Diego Ramos", role: "Filmmaker", location: "Mexico City, MX", lat: 19.43, lng: -99.13 },
  { id: "u9", name: "Anya Petrova", role: "Motion Designer", location: "Dubai, AE", lat: 25.2, lng: 55.27 },
  { id: "u10", name: "Noah Williams", role: "Studio Founder", location: "Sydney, AU", lat: -33.87, lng: 151.21 },
  { id: "u11", name: "Priya Nair", role: "VFX Studio", location: "Mumbai, IN", lat: 19.08, lng: 72.88 },
  { id: "u12", name: "Lucas Silva", role: "Director", location: "São Paulo, BR", lat: -23.55, lng: -46.63 },
];

export const PROFILE = {
  name: "Mike Ogilvie",
  handle: "@mike",
  role: "Founder / Lead Coach",
  location: "Amsterdam, NL",
  joined: "Cohort 01",
  avatar: "", // data URL; set via Profile page upload
};

export const WHATSAPP_URL = "https://chat.whatsapp.com/your-invite-code";
