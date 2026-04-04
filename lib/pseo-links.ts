// Cross-linking maps for internal SEO links between pSEO page types
// Each map connects a slug from one content type to slugs in another

// Book → Blog Post links (which blog posts are relevant to each book)
export const bookToBlogPosts: Record<string, string[]> = {
  "atomic-habits": [
    "reflection-habit",
    "how-to-remember-what-you-read",
    "what-to-do-after-reading-a-book",
  ],
  "deep-work": [
    "how-to-stop-doomscrolling",
    "the-art-of-slow-thinking",
    "passive-vs-active-content-consumption",
  ],
  "thinking-fast-and-slow": [
    "the-art-of-slow-thinking",
    "passive-vs-active-content-consumption",
  ],
  sapiens: ["what-to-do-after-reading-a-book", "book-reflection-prompts"],
  "the-psychology-of-money": [
    "book-reflection-prompts",
    "what-to-do-after-reading-a-book",
  ],
  "mans-search-for-meaning": [
    "the-art-of-slow-thinking",
    "book-reflection-prompts",
  ],
  meditations: ["the-art-of-slow-thinking", "reflection-habit"],
  "48-laws-of-power": [
    "book-reflection-prompts",
    "what-to-do-after-reading-a-book",
  ],
  "how-to-win-friends-and-influence-people": [
    "book-reflection-prompts",
    "active-reading-techniques",
  ],
  "the-alchemist": [
    "book-reflection-prompts",
    "what-to-do-after-reading-a-book",
  ],
  educated: ["book-reflection-prompts", "how-to-reflect-on-what-you-read"],
  outliers: ["the-art-of-slow-thinking", "book-reflection-prompts"],
  quiet: ["book-reflection-prompts", "how-to-reflect-on-what-you-read"],
  range: ["the-art-of-slow-thinking", "passive-vs-active-content-consumption"],
  essentialism: ["how-to-stop-doomscrolling", "information-diet"],
  "digital-minimalism": [
    "how-to-stop-doomscrolling",
    "information-diet",
    "the-paradox-of-digital-information",
  ],
  flow: ["the-art-of-slow-thinking", "passive-vs-active-content-consumption"],
  mindset: ["book-reflection-prompts", "reflection-habit"],
  grit: ["book-reflection-prompts", "reflection-habit"],
  "the-power-of-habit": ["reflection-habit", "how-to-remember-what-you-read"],
  "never-split-the-difference": [
    "book-reflection-prompts",
    "active-reading-techniques",
  ],
  "start-with-why": [
    "book-reflection-prompts",
    "what-to-do-after-reading-a-book",
  ],
  "zero-to-one": ["book-reflection-prompts", "the-art-of-slow-thinking"],
  "the-lean-startup": [
    "book-reflection-prompts",
    "what-to-do-after-reading-a-book",
  ],
  "good-to-great": [
    "book-reflection-prompts",
    "what-to-do-after-reading-a-book",
  ],
  principles: ["reflection-habit", "the-art-of-slow-thinking"],
  "the-7-habits-of-highly-effective-people": [
    "reflection-habit",
    "book-reflection-prompts",
  ],
  "rich-dad-poor-dad": [
    "book-reflection-prompts",
    "what-to-do-after-reading-a-book",
  ],
  "think-and-grow-rich": [
    "book-reflection-prompts",
    "the-art-of-slow-thinking",
  ],
  "the-subtle-art-of-not-giving-a-fck": [
    "book-reflection-prompts",
    "how-to-reflect-on-what-you-read",
  ],
  "cant-hurt-me": ["book-reflection-prompts", "reflection-habit"],
  "extreme-ownership": ["book-reflection-prompts", "active-reading-techniques"],
  "the-4-hour-workweek": ["book-reflection-prompts", "information-diet"],
  influence: [
    "book-reflection-prompts",
    "passive-vs-active-content-consumption",
  ],
  "predictably-irrational": [
    "the-art-of-slow-thinking",
    "passive-vs-active-content-consumption",
  ],
  nudge: ["the-art-of-slow-thinking", "book-reflection-prompts"],
  "thinking-in-bets": ["the-art-of-slow-thinking", "book-reflection-prompts"],
  "the-black-swan": ["the-art-of-slow-thinking", "book-reflection-prompts"],
  antifragile: ["the-art-of-slow-thinking", "book-reflection-prompts"],
  "fooled-by-randomness": [
    "the-art-of-slow-thinking",
    "passive-vs-active-content-consumption",
  ],
  "homo-deus": [
    "the-paradox-of-digital-information",
    "book-reflection-prompts",
  ],
  "21-lessons-for-the-21st-century": [
    "the-paradox-of-digital-information",
    "information-diet",
  ],
  "why-we-sleep": [
    "book-reflection-prompts",
    "how-to-reflect-on-what-you-read",
  ],
  breath: ["book-reflection-prompts", "how-to-reflect-on-what-you-read"],
  "the-body-keeps-the-score": [
    "book-reflection-prompts",
    "how-to-reflect-on-what-you-read",
  ],
  attached: ["book-reflection-prompts", "how-to-reflect-on-what-you-read"],
  "the-power-of-now": ["the-art-of-slow-thinking", "reflection-habit"],
  "shoe-dog": ["book-reflection-prompts", "what-to-do-after-reading-a-book"],
};

// Book → Prompt Topic links
export const bookToPrompts: Record<string, string[]> = {
  "atomic-habits": ["self-improvement", "psychology"],
  "deep-work": ["focus", "productivity"],
  "thinking-fast-and-slow": ["cognitive-biases", "decision-making"],
  sapiens: ["history", "science"],
  "the-psychology-of-money": ["financial-literacy", "psychology"],
  "mans-search-for-meaning": ["philosophy", "psychology"],
  meditations: ["philosophy", "stoicism"],
  "48-laws-of-power": ["leadership", "psychology"],
  "how-to-win-friends-and-influence-people": ["communication", "relationships"],
  "the-alchemist": ["fiction", "spirituality"],
  educated: ["memoir", "education"],
  outliers: ["psychology", "sociology"],
  quiet: ["psychology", "relationships"],
  range: ["education", "creativity"],
  essentialism: ["self-improvement", "leadership"],
  "digital-minimalism": ["technology", "self-improvement"],
  flow: ["focus", "creativity"],
  mindset: ["mindset", "education"],
  grit: ["mindset", "self-improvement"],
  "the-power-of-habit": ["habit-formation", "psychology"],
  "never-split-the-difference": ["communication", "business"],
  "start-with-why": ["business", "leadership"],
  "zero-to-one": ["entrepreneurship", "technology"],
  "the-lean-startup": ["entrepreneurship", "business"],
  "good-to-great": ["business", "leadership"],
  principles: ["business", "self-improvement"],
  "the-7-habits-of-highly-effective-people": ["self-improvement", "leadership"],
  "rich-dad-poor-dad": ["financial-literacy", "self-improvement"],
  "think-and-grow-rich": ["self-improvement", "psychology"],
  "the-subtle-art-of-not-giving-a-fck": ["mindset", "philosophy"],
  "cant-hurt-me": ["self-improvement", "psychology"],
  "extreme-ownership": ["leadership", "business"],
  "the-4-hour-workweek": ["business", "self-improvement"],
  influence: ["psychology", "business"],
  "predictably-irrational": ["cognitive-biases", "economics"],
  nudge: ["cognitive-biases", "economics"],
  "thinking-in-bets": ["decision-making", "business"],
  "the-black-swan": ["economics", "philosophy"],
  antifragile: ["stoicism", "decision-making"],
  "fooled-by-randomness": ["psychology", "economics"],
  "homo-deus": ["technology", "history"],
  "21-lessons-for-the-21st-century": ["technology", "politics"],
  "why-we-sleep": ["health", "science"],
  breath: ["health", "science"],
  "the-body-keeps-the-score": ["mental-health", "psychology"],
  attached: ["relationships", "psychology"],
  "the-power-of-now": ["spirituality", "philosophy"],
  "shoe-dog": ["entrepreneurship", "memoir"],
};

// Prompt Topic → Book links (reverse of bookToPrompts, computed)
export const promptToBooks: Record<string, string[]> = {};
for (const [bookSlug, topics] of Object.entries(bookToPrompts)) {
  for (const topic of topics) {
    if (!promptToBooks[topic]) promptToBooks[topic] = [];
    promptToBooks[topic].push(bookSlug);
  }
}
// Limit to 6 books per topic for clean display
for (const topic of Object.keys(promptToBooks)) {
  promptToBooks[topic] = promptToBooks[topic].slice(0, 6);
}

// Prompt Topic → Blog Post links
export const promptToBlogPosts: Record<string, string[]> = {
  philosophy: ["the-art-of-slow-thinking", "book-reflection-prompts"],
  psychology: [
    "the-art-of-slow-thinking",
    "passive-vs-active-content-consumption",
  ],
  business: [
    "book-reflection-prompts",
    "distillation-competitive-advantage-2026",
  ],
  history: ["book-reflection-prompts", "what-to-do-after-reading-a-book"],
  science: ["book-reflection-prompts", "how-to-remember-what-you-read"],
  "self-improvement": ["reflection-habit", "how-to-remember-what-you-read"],
  economics: ["the-art-of-slow-thinking", "book-reflection-prompts"],
  technology: [
    "the-paradox-of-digital-information",
    "how-to-stop-doomscrolling",
  ],
  politics: [
    "the-art-of-slow-thinking",
    "passive-vs-active-content-consumption",
  ],
  sociology: [
    "passive-vs-active-content-consumption",
    "book-reflection-prompts",
  ],
  health: ["book-reflection-prompts", "how-to-reflect-on-what-you-read"],
  creativity: ["writing-to-think", "the-art-of-slow-thinking"],
  leadership: ["book-reflection-prompts", "active-reading-techniques"],
  relationships: ["book-reflection-prompts", "how-to-reflect-on-what-you-read"],
  spirituality: ["the-art-of-slow-thinking", "reflection-habit"],
  education: ["how-to-remember-what-you-read", "spaced-repetition-for-readers"],
  environment: ["book-reflection-prompts", "information-diet"],
  ethics: ["the-art-of-slow-thinking", "book-reflection-prompts"],
  fiction: ["book-reflection-prompts", "how-to-reflect-on-what-you-read"],
  parenting: ["book-reflection-prompts", "reflection-habit"],
  stoicism: ["the-art-of-slow-thinking", "reflection-habit"],
  "cognitive-biases": [
    "the-art-of-slow-thinking",
    "passive-vs-active-content-consumption",
  ],
  "decision-making": ["the-art-of-slow-thinking", "book-reflection-prompts"],
  "habit-formation": ["reflection-habit", "how-to-remember-what-you-read"],
  productivity: ["how-to-stop-doomscrolling", "information-diet"],
  mindset: ["reflection-habit", "book-reflection-prompts"],
  communication: ["book-reflection-prompts", "active-reading-techniques"],
  "financial-literacy": [
    "book-reflection-prompts",
    "what-to-do-after-reading-a-book",
  ],
  writing: ["writing-to-think", "the-art-of-slow-thinking"],
  entrepreneurship: [
    "book-reflection-prompts",
    "distillation-competitive-advantage-2026",
  ],
  "mental-health": [
    "book-reflection-prompts",
    "how-to-reflect-on-what-you-read",
  ],
  career: ["book-reflection-prompts", "reflection-habit"],
  focus: ["how-to-stop-doomscrolling", "the-art-of-slow-thinking"],
  memoir: ["book-reflection-prompts", "how-to-reflect-on-what-you-read"],
};

// Glossary → Book links
export const glossaryToBooks: Record<string, string[]> = {
  "active-reading": [
    "deep-work",
    "how-to-win-friends-and-influence-people",
    "range",
  ],
  "spaced-repetition": [
    "atomic-habits",
    "the-power-of-habit",
    "thinking-fast-and-slow",
  ],
  "reflective-thinking": [
    "meditations",
    "mans-search-for-meaning",
    "the-power-of-now",
  ],
  "forgetting-curve": [
    "atomic-habits",
    "why-we-sleep",
    "thinking-fast-and-slow",
  ],
  "deep-reading": ["deep-work", "digital-minimalism", "flow"],
  metacognition: ["thinking-fast-and-slow", "mindset", "range"],
  "information-diet": [
    "digital-minimalism",
    "essentialism",
    "the-4-hour-workweek",
  ],
  "critical-thinking": [
    "thinking-fast-and-slow",
    "the-black-swan",
    "predictably-irrational",
  ],
  "slow-thinking": ["thinking-fast-and-slow", "deep-work", "the-power-of-now"],
  "compound-thinking": [
    "atomic-habits",
    "principles",
    "the-7-habits-of-highly-effective-people",
  ],
};

// Glossary → Prompt links
export const glossaryToPrompts: Record<string, string[]> = {
  "active-reading": ["education", "self-improvement"],
  "spaced-repetition": ["education", "psychology"],
  "reflective-thinking": ["philosophy", "psychology"],
  "forgetting-curve": ["psychology", "education"],
  "deep-reading": ["education", "self-improvement"],
  metacognition: ["psychology", "education"],
  "information-diet": ["technology", "self-improvement"],
  "critical-thinking": ["philosophy", "education"],
  "slow-thinking": ["philosophy", "psychology"],
  "compound-thinking": ["self-improvement", "psychology"],
};

// Reflection Guide → Book links
export const guideToBooks: Record<string, string[]> = {
  books: ["atomic-habits", "deep-work", "sapiens", "thinking-fast-and-slow"],
  podcasts: [
    "never-split-the-difference",
    "how-to-win-friends-and-influence-people",
  ],
  articles: ["deep-work", "digital-minimalism", "essentialism"],
  videos: ["digital-minimalism", "flow", "the-power-of-now"],
  audiobooks: ["atomic-habits", "sapiens", "the-alchemist", "shoe-dog"],
};

// Reflection Guide → Prompt links
export const guideToPrompts: Record<string, string[]> = {
  books: ["philosophy", "psychology", "self-improvement"],
  podcasts: ["business", "technology", "psychology"],
  articles: ["technology", "science", "economics"],
  videos: ["creativity", "education", "technology"],
  audiobooks: ["fiction", "history", "self-improvement"],
};

// Reflection Guide → Blog Post links
export const guideToBlogPosts: Record<string, string[]> = {
  books: [
    "how-to-remember-what-you-read",
    "what-to-do-after-reading-a-book",
    "book-reflection-prompts",
  ],
  podcasts: [
    "how-to-remember-what-you-learn-from-podcasts",
    "passive-vs-active-content-consumption",
  ],
  articles: [
    "active-reading-techniques",
    "information-diet",
    "passive-vs-active-content-consumption",
  ],
  videos: [
    "how-to-stop-doomscrolling",
    "passive-vs-active-content-consumption",
  ],
  audiobooks: [
    "how-to-remember-what-you-read",
    "best-apps-to-remember-what-you-read",
  ],
};
