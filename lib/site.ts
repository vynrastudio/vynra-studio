export const site = {
  name: "Vynra Studio",
  shortName: "Vynra",
  domain: "vynrastudio.com",
  url: "https://vynrastudio.com",
  headline: "Stories people stop scrolling for.",
  subheadline:
    "Premium editing, cinematic storytelling, and content systems for creators and businesses that want to stand out.",
  founder: {
    name: "Pawan Kumar",
    title: "Founder & Creative Director",
    bio: "Hi, I'm Pawan, founder of Vynra Studio. I started editing videos during my first year of college and quickly became obsessed with turning ordinary footage into stories people actually want to watch. Over the last 3+ years, I've worked with creators, brands, and businesses across multiple niches — including content associated with audiences exceeding 11 million followers — helping them transform raw footage into work that feels cinematic, keeps attention, and tells a story. What started as freelance editing slowly evolved into Vynra Studio — a creative studio built around one simple idea: great content shouldn't just look good, it should make people stop scrolling.",
    stats: [
      { value: "1M+", label: "Views Generated" },
      { value: "11M+", label: "Largest Creator Audience" },
      { value: "3+", label: "Years Experience" },
    ],
  },
  contact: {
    email: "vynrastudios@gmail.com",
    calendly: "https://calendly.com/vynrastudios/30min",
  },
  social: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "X / Twitter", href: "#" },
  ],
  services: [
    {
      title: "YouTube Video Editing",
      tag: "Retention Editing",
      desc: "Long-form edits engineered for retention — pacing, story beats, and clean sound design that keep viewers watching to the end.",
    },
    {
      title: "Short Form Content",
      tag: "Shorts Systems",
      desc: "Scroll-stopping Reels, Shorts, and TikToks cut for the first three seconds and built to be shared.",
    },
    {
      title: "Motion Graphics",
      tag: "Motion Graphics",
      desc: "Tasteful animated titles, lower-thirds, and callouts that elevate the frame without ever stealing the scene.",
    },
    {
      title: "Podcast Editing",
      tag: "Podcast Production",
      desc: "Multi-cam podcast edits with clean audio, dynamic framing, and clip-ready highlight moments.",
    },
    {
      title: "Content Repurposing",
      tag: "Repurposing",
      desc: "One shoot, a full content system — long-form turned into a library of shorts, carousels, and clips.",
    },
  ],
  comparison: {
    traditional: [
      "One video delivered",
      "Editing only",
      "Generic style",
      "No repurposing",
      "Platform-specific",
      "Reactive workflow",
    ],
    vynra: [
      "Content systems",
      "Retention-focused storytelling",
      "Creator-specific editing language",
      "Multi-platform distribution",
      "Repurposing pipeline",
      "Strategic content growth",
    ],
  },
  process: [
    {
      step: "01",
      title: "Share your footage",
      desc: "Drop your raw files in a shared folder. A quick brief on the goal, the vibe, and the references you love.",
    },
    {
      step: "02",
      title: "Editing & production",
      desc: "We craft the story — pacing, sound, color, and motion — into a first cut built around your audience.",
    },
    {
      step: "03",
      title: "Feedback & revisions",
      desc: "You review with frame-accurate notes. We refine until every beat feels exactly right.",
    },
    {
      step: "04",
      title: "Final delivery",
      desc: "Export-ready files in every format you need, delivered on time and ready to publish.",
    },
  ],
};

export type Category =
  | "Business Branding"
  | "Creator Branding"
  | "Tech & Educational Content"
  | "Thought Leadership";

export const CATEGORIES: Category[] = [
  "Business Branding",
  "Creator Branding",
  "Tech & Educational Content",
  "Thought Leadership",
];
