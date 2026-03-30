// Programmatic SEO data — glossary terms and reflection guides

export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  explanation: string;
  whyItMatters: string;
  howToApply: string;
  relatedTerms: string[];
  relatedBlogPosts: string[];
}

export interface ReflectionGuide {
  slug: string;
  contentType: string;
  title: string;
  description: string;
  intro: string;
  steps: { heading: string; body: string }[];
  prompts: string[];
  commonMistakes: string[];
  relatedGuides: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "active-reading",
    term: "Active Reading",
    definition:
      "Active reading is a method of engaging with text through questioning, annotating, and reflecting — rather than passively scanning words on a page.",
    explanation:
      "Most reading is passive: your eyes move across text, your brain constructs meaning in real time, and then nothing happens. Active reading breaks this pattern by introducing deliberate cognitive engagement at each stage — before, during, and after reading.\n\nBefore reading, you set an intention: what are you looking for? During reading, you pause to question, connect, and annotate. After reading, you write a brief reflection capturing your own response to the material.\n\nThe distinction matters because passive reading produces almost no long-term retention. Research on encoding depth (Craik & Lockhart, 1972) consistently shows that the deeper you process information, the stronger the memory trace. Active reading forces deeper processing at every step.",
    whyItMatters:
      "In an era of infinite content, the bottleneck is not access to information — it is the ability to retain and apply it. Active reading is the difference between consuming 50 articles and remembering none, versus reading 5 articles and integrating their ideas into your thinking.\n\nFor knowledge workers, students, and lifelong learners, active reading transforms reading time from entertainment into compound intellectual growth.",
    howToApply:
      "Start with the simplest version: after every reading session, spend 2-5 minutes writing one paragraph of your own thinking about what you just read. Not a summary — your response. What struck you, what you disagree with, what connects to something you already know.\n\nThis single practice exploits the post-reading window when information is still in working memory and available for deep encoding. Over time, these reflections accumulate into a searchable archive of your intellectual development.",
    relatedTerms: [
      "spaced-repetition",
      "reflective-thinking",
      "deep-reading",
      "metacognition",
    ],
    relatedBlogPosts: [
      "how-to-remember-what-you-read",
      "the-art-of-slow-thinking",
    ],
  },
  {
    slug: "spaced-repetition",
    term: "Spaced Repetition",
    definition:
      "Spaced repetition is a learning technique where information is reviewed at progressively longer intervals to maximize long-term retention.",
    explanation:
      "The concept builds on Hermann Ebbinghaus's forgetting curve research from 1885: without review, we forget roughly 70% of new information within 24 hours. Spaced repetition counteracts this by scheduling reviews at the precise intervals where memory is about to decay.\n\nTraditionally implemented with flashcards (Anki, SuperMemo), spaced repetition has been adapted for broader learning contexts. For readers and thinkers, a variation called 'spaced resurfacing' applies the same principle to past reflections and notes — not to memorize facts, but to re-engage with your former thinking at timed intervals.\n\nEach re-encounter strengthens the memory trace and creates opportunities to connect ideas across different sources and time periods.",
    whyItMatters:
      "Without spaced repetition, learning is a leaky bucket. You invest time reading and thinking, but the insights fade within days. Spaced repetition is the patch that makes your intellectual investment compound over time rather than evaporate.\n\nFor readers specifically, spaced resurfacing of past reflections creates a unique benefit: you get to evaluate your former thinking with fresh eyes, noticing evolution in your perspective that would otherwise be invisible.",
    howToApply:
      "The low-effort version: keep a collection of your reading reflections and review one random past reflection each day. The structured version: use a system that surfaces past reflections at 1-day, 7-day, 30-day, and 90-day intervals after you write them.\n\nThe key insight is that you are not re-reading the original content. You are re-encountering your own perspective on it — which is faster, more personal, and more effective for retention.",
    relatedTerms: [
      "active-reading",
      "forgetting-curve",
      "reflective-thinking",
      "metacognition",
    ],
    relatedBlogPosts: [
      "why-you-forget-everything-you-read",
      "how-to-remember-what-you-read",
    ],
  },
  {
    slug: "reflective-thinking",
    term: "Reflective Thinking",
    definition:
      "Reflective thinking is the deliberate process of examining your own thoughts, beliefs, and responses to experiences or information — turning raw input into personal insight.",
    explanation:
      "John Dewey defined reflective thinking in 1933 as 'active, persistent, and careful consideration of any belief or supposed form of knowledge in light of the grounds that support it.' Unlike automatic thinking, reflective thinking is intentional and effortful.\n\nIn the context of content consumption, reflective thinking means pausing after encountering information to ask: What do I actually think about this? Does this align with or challenge my existing beliefs? How does this connect to what I already know?\n\nThis process is distinct from summarization (restating what someone else said) and from journaling (recording personal emotions). Reflective thinking is specifically about developing your intellectual response to external input.",
    whyItMatters:
      "Without reflective thinking, content consumption is purely absorptive — you take in other people's ideas without developing your own. Over time, this creates a paradox: the more you consume, the less you are able to articulate what you actually think about any given topic.\n\nReflective thinking is the bridge between consuming information and building knowledge. It is what transforms a reader into a thinker.",
    howToApply:
      "After finishing any meaningful piece of content — a book chapter, an article, a podcast episode — answer one question in writing: What is my response to this?\n\nAvoid summarizing what the author said. Instead, capture what struck you, what you question, what you want to explore further. The goal is not completeness but authenticity — your perspective, in your words, at this moment in time.",
    relatedTerms: [
      "active-reading",
      "metacognition",
      "critical-thinking",
      "deep-reading",
    ],
    relatedBlogPosts: [
      "the-art-of-slow-thinking",
      "how-to-remember-what-you-read",
    ],
  },
  {
    slug: "forgetting-curve",
    term: "The Forgetting Curve",
    definition:
      "The forgetting curve is a model showing how information is lost over time when there is no attempt to retain it — typically losing 70% within 24 hours.",
    explanation:
      "Discovered by Hermann Ebbinghaus through self-experimentation in 1885, the forgetting curve demonstrates that memory retention decays exponentially after learning. The steepest decline occurs in the first hour, with approximately 50% lost within 20 minutes and 70% within 24 hours.\n\nThe curve is not fixed. Several factors flatten it — meaning you forget more slowly — including emotional significance, personal relevance, depth of processing, and spaced review. This is why you remember your wedding day but not what you had for lunch last Tuesday.\n\nFor readers and content consumers, the forgetting curve explains the universal experience of finishing a book and being unable to recall its key ideas a week later. The information was never encoded deeply enough to resist the natural decay.",
    whyItMatters:
      "Understanding the forgetting curve reframes the retention problem. It is not that you have a bad memory. It is that passive consumption does not create the encoding conditions for long-term storage. The fix is not to consume less — it is to process what you consume more deliberately.",
    howToApply:
      "The most effective intervention is immediate: writing a reflection within 30 minutes of finishing a reading session, while the information is still in working memory. This single action can dramatically flatten the forgetting curve for that material.\n\nCombining immediate reflection with spaced resurfacing (re-encountering your reflection at intervals) creates a retention system that works with your biology rather than against it.",
    relatedTerms: [
      "spaced-repetition",
      "active-reading",
      "reflective-thinking",
    ],
    relatedBlogPosts: [
      "why-you-forget-everything-you-read",
      "how-to-remember-what-you-read",
    ],
  },
  {
    slug: "deep-reading",
    term: "Deep Reading",
    definition:
      "Deep reading is sustained, focused engagement with a text that involves critical analysis, emotional connection, and reflection — as opposed to skimming or scanning.",
    explanation:
      "Cognitive scientist Maryanne Wolf distinguishes deep reading from other forms of reading by its cognitive demands. Deep reading activates regions of the brain associated with empathy, critical thinking, and background knowledge integration — processes that skimming and scanning bypass entirely.\n\nThe shift from print to digital has measurably reduced deep reading. Studies show that people read 20-30% slower on screens and comprehend less, partly because digital environments encourage scanning patterns (F-shaped reading) rather than linear, sustained attention.\n\nDeep reading requires uninterrupted time, a distraction-free environment, and — crucially — a follow-up processing step where you engage with the material beyond the act of reading itself.",
    whyItMatters:
      "Deep reading is where understanding happens. Skimming gives you awareness of a topic. Deep reading gives you comprehension, the ability to evaluate arguments, and the raw material for original thinking.\n\nIn a culture optimized for shallow consumption — feeds, headlines, 15-second clips — the ability to read deeply is becoming rare and therefore more valuable.",
    howToApply:
      "Set a timer for 30-45 minutes. Read one thing. No tabs, no phone, no notifications. When the timer ends, close the book or article and write one paragraph: what did you encounter, and what do you think about it?\n\nThe timer creates a boundary. The single-source focus enables depth. The reflection afterward converts comprehension into retention.",
    relatedTerms: [
      "active-reading",
      "reflective-thinking",
      "information-diet",
      "slow-thinking",
    ],
    relatedBlogPosts: ["the-art-of-slow-thinking", "how-to-stop-doomscrolling"],
  },
  {
    slug: "metacognition",
    term: "Metacognition",
    definition:
      "Metacognition is thinking about your own thinking — the awareness and regulation of your cognitive processes, including how you learn, remember, and form opinions.",
    explanation:
      "Coined by developmental psychologist John Flavell in 1979, metacognition has two components: metacognitive knowledge (understanding how your own thinking works) and metacognitive regulation (actively managing your learning processes).\n\nFor content consumers, metacognition manifests as awareness of your own comprehension while reading. Am I actually understanding this, or just recognizing the words? Can I explain this idea in my own words? What confused me? What do I disagree with?\n\nThis self-monitoring turns reading into real learning. Without metacognition, you can read an entire chapter and not realize you understood none of it until someone asks you about it later.",
    whyItMatters:
      "Metacognition is the master skill that makes all other learning techniques effective. Without it, you cannot evaluate whether your reading is productive, your reflections are genuine, or your understanding is accurate.\n\nResearch consistently shows that metacognitive awareness is one of the strongest predictors of academic and professional learning outcomes — more predictive than raw intelligence.",
    howToApply:
      "Build metacognitive checkpoints into your reading practice. After every chapter or article, pause and ask: Can I explain the main idea without looking at the text? What questions do I still have? Where did I lose focus?\n\nWriting reflections after reading is inherently metacognitive — it forces you to evaluate your own understanding and articulate what you actually took away from the experience.",
    relatedTerms: [
      "reflective-thinking",
      "active-reading",
      "critical-thinking",
    ],
    relatedBlogPosts: [
      "how-to-remember-what-you-read",
      "the-art-of-slow-thinking",
    ],
  },
  {
    slug: "information-diet",
    term: "Information Diet",
    definition:
      "An information diet is the deliberate curation and limitation of your information intake — choosing quality over quantity to improve thinking, focus, and retention.",
    explanation:
      "The term, popularized by Clay Johnson's 2012 book 'The Information Diet,' draws a parallel between food consumption and information consumption. Just as an uncontrolled food diet leads to obesity, uncontrolled information consumption leads to cognitive overload, shallow thinking, and diminished ability to focus.\n\nAn information diet does not mean consuming less. It means consuming deliberately — selecting sources that merit deep engagement, eliminating sources that provide only novelty without insight, and building in processing time after consumption.\n\nThe average person in 2026 spends nearly 7 hours daily consuming digital content. An information diet asks: of those 7 hours, how many produced a single idea you can articulate today?",
    whyItMatters:
      "Information overconsumption creates the illusion of learning without its substance. You feel informed because you have been exposed to many topics, but you cannot articulate a considered perspective on any of them.\n\nAn information diet replaces breadth with depth, producing less consumption but more actual knowledge and stronger personal perspectives.",
    howToApply:
      "Start with an audit: for one week, track every piece of content you consume and rate each on a scale of 1-5 for how much it contributed to your thinking. Anything consistently below 3, eliminate or unsubscribe.\n\nThen introduce a rule: for every hour of consumption, spend 10 minutes reflecting. This natural friction reduces overconsumption while ensuring that what you do consume gets properly processed.",
    relatedTerms: ["deep-reading", "slow-thinking", "reflective-thinking"],
    relatedBlogPosts: [
      "how-to-stop-doomscrolling",
      "the-paradox-of-digital-information",
    ],
  },
  {
    slug: "critical-thinking",
    term: "Critical Thinking",
    definition:
      "Critical thinking is the disciplined process of evaluating information, arguments, and assumptions to form a reasoned judgment — rather than accepting claims at face value.",
    explanation:
      "Critical thinking involves several distinct cognitive operations: identifying the claim being made, evaluating the evidence supporting it, recognizing assumptions and biases (both the author's and your own), considering alternative explanations, and forming a judgment based on the available evidence.\n\nIn the context of content consumption, critical thinking is what separates absorbing from thinking. When you read an article uncritically, you accept its framing, conclusions, and implied worldview. When you read critically, you engage with it as a conversation partner — agreeing here, questioning there, noticing what was left unsaid.\n\nCritical thinking does not mean being contrarian or skeptical of everything. It means being deliberate about what you accept and why.",
    whyItMatters:
      "Without critical thinking, you accumulate other people's opinions without developing your own. You can quote experts but cannot evaluate whether their arguments hold up. In an age of AI-generated content and information abundance, the ability to think critically about what you consume is more important than the ability to consume more of it.",
    howToApply:
      "When writing a reflection after reading, include at least one point of disagreement, one question the author did not address, or one assumption the argument depends on. This trains you to engage with content analytically rather than passively.\n\nOver time, your reflection archive becomes a record of your critical thinking development — showing how your ability to evaluate ideas has sharpened.",
    relatedTerms: [
      "reflective-thinking",
      "metacognition",
      "active-reading",
      "deep-reading",
    ],
    relatedBlogPosts: [
      "the-art-of-slow-thinking",
      "distillation-competitive-advantage-2026",
    ],
  },
  {
    slug: "slow-thinking",
    term: "Slow Thinking",
    definition:
      "Slow thinking is deliberate, effortful cognitive processing — what psychologist Daniel Kahneman calls 'System 2' thinking — as opposed to the fast, automatic, intuitive judgments of System 1.",
    explanation:
      "In Kahneman's framework from 'Thinking, Fast and Slow' (2011), System 1 operates automatically and quickly with little effort or sense of voluntary control. System 2 allocates attention to effortful mental activities, including complex computations and deliberate choice.\n\nMost content consumption operates in System 1: you skim, you absorb surface meaning, you move on. Slow thinking engages System 2: you pause, you question, you connect, you form considered judgments.\n\nThe modern content environment is optimized for System 1 — feeds, headlines, short-form video all reward fast processing. Slow thinking requires deliberately opting out of this optimization and creating conditions for System 2 engagement.",
    whyItMatters:
      "The most important decisions and insights come from slow thinking. Fast thinking is useful for routine decisions, but it is prone to cognitive biases, shallow analysis, and borrowed opinions.\n\nBuilding a slow thinking practice means you develop your own perspective on the ideas you encounter rather than defaulting to the perspective the content was designed to produce.",
    howToApply:
      "Choose one piece of content per day to engage with slowly. Read it without multitasking. Pause at key passages. After finishing, write a reflection that captures not just what the author said, but what you think about what the author said.\n\nThe reflection is the slow thinking moment. It cannot be rushed, and it cannot be skipped without losing the primary benefit of the reading.",
    relatedTerms: [
      "deep-reading",
      "reflective-thinking",
      "critical-thinking",
      "metacognition",
    ],
    relatedBlogPosts: ["the-art-of-slow-thinking", "how-to-stop-doomscrolling"],
  },
  {
    slug: "compound-thinking",
    term: "Compound Thinking",
    definition:
      "Compound thinking is the process by which small, regular reflections accumulate over time into a rich web of interconnected ideas — each new reflection building on and connecting to previous ones.",
    explanation:
      "The concept borrows from compound interest in finance: small, consistent deposits grow exponentially over time because each deposit earns on the previous total. Similarly, each reflection you write does not just add to your archive — it connects to everything already there.\n\nA reflection written today about a podcast episode might connect to a book reflection from three months ago, which connects to an article reflection from last year. These connections are invisible at first but become powerful over time as your archive grows.\n\nCompound thinking requires two conditions: consistent input (regular reflections) and periodic review (resurfacing past reflections to find connections). Without the review step, you have a collection of isolated notes rather than a compound knowledge system.",
    whyItMatters:
      "Individual reflections are useful. A compounding system of reflections is transformative. After 6-12 months of consistent reflection, you develop the ability to see patterns across sources, trace how your thinking evolved, and draw on a rich personal archive when forming new opinions.\n\nThis is the difference between reading widely and thinking deeply. Both consume the same content, but only compound thinking produces lasting intellectual growth.",
    howToApply:
      "Write one reflection after every meaningful piece of content you consume. Once a week, review 3-5 past reflections and note any connections. Over time, your archive becomes a thinking tool — not just a record of what you read, but a map of how your mind works.",
    relatedTerms: ["reflective-thinking", "spaced-repetition", "slow-thinking"],
    relatedBlogPosts: [
      "how-to-remember-what-you-read",
      "the-art-of-slow-thinking",
    ],
  },
];

export const reflectionGuides: ReflectionGuide[] = [
  {
    slug: "books",
    contentType: "Books",
    title: "How to Reflect on Books",
    description:
      "A practical guide to writing reflections after reading books — capture your thinking, not just the author's ideas.",
    intro:
      "You finish a book. You know you liked it. You can recall the general topic. But the specific ideas that struck you, the arguments you disagreed with, the connections you noticed — those are already fading. This guide shows you how to capture your thinking while it is still fresh, so your reading actually changes how you think.",
    steps: [
      {
        heading: "Set your intention before reading",
        body: "Before opening the book, spend one minute answering: why am I reading this? What question do I hope it addresses? This primes your brain to filter for relevant passages and creates a reference point for your reflection afterward. Your intention does not need to be specific — 'I want to understand why habits are hard to change' is enough.",
      },
      {
        heading: "Read in focused sessions",
        body: "Read for 30-45 minutes at a time. Longer sessions produce diminishing returns for retention. After each session, close the book and sit with the material for a moment before writing. This brief pause allows your brain to begin consolidation before you actively engage with the material through writing.",
      },
      {
        heading: "Write your reflection immediately after",
        body: "Within 30 minutes of finishing a reading session, write one paragraph capturing your response. Not a summary of what the author said — your reaction to it. What struck you? What do you disagree with? What does this connect to in your own experience or previous reading? The paragraph does not need to be polished. It needs to be honest.",
      },
      {
        heading: "Revisit your reflections over time",
        body: "When a past reflection resurfaces — whether through a spaced resurfacing system or your own review — engage with it. Do you still agree with your past self? Has your thinking evolved? These re-encounters create compound knowledge by layering new perspective onto previous thinking.",
      },
    ],
    prompts: [
      "What is the single idea from this book that I want to remember in a year?",
      "Where does this author's argument break down or oversimplify?",
      "How does this connect to something I read or experienced before?",
      "What would I tell someone who asked me what this book is about?",
      "What question does this book raise that it does not answer?",
    ],
    commonMistakes: [
      "Summarizing the book instead of capturing your own perspective",
      "Waiting too long after reading — the forgetting curve is steepest in the first hour",
      "Trying to capture everything instead of the one or two ideas that resonated most",
      "Writing for an audience instead of for your future self",
    ],
    relatedGuides: ["articles", "audiobooks"],
  },
  {
    slug: "podcasts",
    contentType: "Podcasts",
    title: "How to Reflect on Podcasts",
    description:
      "Turn podcast listening from passive background noise into active thinking material with a simple reflection practice.",
    intro:
      "Podcasts are uniquely difficult to retain. Unlike reading, you cannot pause to re-read a sentence or highlight a passage (well, you can pause, but almost nobody does). The conversational format feels engaging in the moment but fades quickly because your brain processes spoken words faster than it can encode them. A reflection practice after listening changes this entirely.",
    steps: [
      {
        heading: "Listen with a question in mind",
        body: "Before pressing play, decide what you want from this episode. Are you exploring a new topic? Deepening existing knowledge? Looking for a specific answer? This intention transforms passive listening into active search, and your brain will flag relevant moments automatically.",
      },
      {
        heading: "Take a voice note or mental note during key moments",
        body: "When something strikes you, pause the podcast briefly and say (or think) one sentence about why it struck you. You are not transcribing — you are flagging moments for your reflection. Even a mental note ('that point about decision fatigue connects to what I read last week') is enough.",
      },
      {
        heading: "Write your reflection within an hour of finishing",
        body: "Audio content fades faster than written content because there is no visual reference to anchor memory. Write your reflection as soon as possible. Focus on: what was the most interesting idea, what did you disagree with, and what do you want to think about further.",
      },
      {
        heading: "Connect to your existing reflections",
        body: "Check if this podcast connects to anything you have reflected on before. Podcasts are often conversations between ideas, and your reflection archive is your side of that conversation. Finding a connection between today's podcast and a book you reflected on months ago is where compound thinking happens.",
      },
    ],
    prompts: [
      "What is the one idea from this episode I want to hold onto?",
      "Did any moment challenge something I previously believed?",
      "If I could ask the host or guest one follow-up question, what would it be?",
      "What is this episode really about, beyond the surface topic?",
      "How does this connect to something I have been thinking about recently?",
    ],
    commonMistakes: [
      "Treating podcasts as background noise — if you are not paying attention, you are not learning",
      "Trying to reflect on every podcast — choose the ones that deserve your thinking time",
      "Waiting until the next day to reflect — audio memory degrades faster than text memory",
      "Confusing agreeing with the host with actually thinking about the content",
    ],
    relatedGuides: ["books", "videos"],
  },
  {
    slug: "articles",
    contentType: "Articles",
    title: "How to Reflect on Articles",
    description:
      "Stop skimming 20 articles and remembering none. Reflect on 3 and retain their ideas permanently.",
    intro:
      "Articles are the most consumed and least retained form of content. The average knowledge worker reads dozens of articles per week and can recall specific insights from almost none of them. The problem is not the articles — it is the pattern of consumption without processing. A brief reflection after the articles that actually matter transforms article reading from a forgetting machine into a thinking practice.",
    steps: [
      {
        heading: "Be selective about what deserves reflection",
        body: "Not every article merits a reflection. Skim freely, but identify the 2-3 articles per week that contain ideas worth thinking about. These are the ones where you find yourself pausing, re-reading a paragraph, or mentally arguing with the author. Those signals mean the content is engaging your deeper processing — follow that signal.",
      },
      {
        heading: "Read the full article without switching tabs",
        body: "When you identify an article worth deep reading, commit to it. Close other tabs. Read it beginning to end without checking email or social media. Single-focus reading produces dramatically better comprehension and retention than the tab-switching pattern most people default to.",
      },
      {
        heading: "Write a 2-3 sentence reflection immediately",
        body: "Articles are shorter than books, so your reflection can be shorter too. Two to three sentences capturing: what the article argued, what you think about that argument, and one connection to something else you know. This takes 60-90 seconds and converts the article from fleeting content to permanent thinking.",
      },
      {
        heading: "Link it to your growing archive",
        body: "Over time, your article reflections become a personal research library. Before reading a new article on a topic, check your past reflections on related topics. You will often find that your thinking has evolved, and the new article adds a layer to an existing thread of your perspective.",
      },
    ],
    prompts: [
      "What is the author's core claim, and do I buy it?",
      "What evidence did the author use, and is it convincing?",
      "What did this article leave out that I think matters?",
      "If I had to summarize this article's value in one sentence, what would it be?",
      "Does this change how I think about something I was already considering?",
    ],
    commonMistakes: [
      "Reflecting on every article — save it for the ones that actually make you think",
      "Bookmarking instead of reflecting — bookmarks are where articles go to die",
      "Skimming the article and then trying to reflect on it — shallow reading produces shallow reflection",
      "Writing what the author said instead of what you think about what the author said",
    ],
    relatedGuides: ["books", "podcasts"],
  },
  {
    slug: "videos",
    contentType: "Videos",
    title: "How to Reflect on Videos",
    description:
      "Turn YouTube watching into genuine learning with a simple post-video reflection practice.",
    intro:
      "Video content is the dominant form of information consumption in 2026, and it is also the hardest to retain. The combination of visual stimulation, audio narration, and passive viewing creates an illusion of understanding — you feel like you learned something because the experience was engaging, but the actual retention is minimal. A post-video reflection practice breaks this pattern.",
    steps: [
      {
        heading: "Choose videos that deserve your thinking",
        body: "Entertaining videos and educational videos serve different purposes. When you are watching for education or insight, treat it as a learning session with a specific intent. What do you want to understand or explore? This distinction prevents you from applying reflection practice to content that was never meant to be retained.",
      },
      {
        heading: "Watch actively, not passively",
        body: "Pause the video when an idea strikes you. Rewind if you missed something. Resist the autoplay queue. Active video watching means treating the video as a conversation you can pause, not a stream you float on. If a point is important enough to think about, give yourself time to think about it.",
      },
      {
        heading: "Write your reflection before watching the next video",
        body: "The autoplay algorithm is designed to keep you watching. Your reflection practice is designed to keep you thinking. After finishing a video worth reflecting on, write your response before clicking the next suggestion. Even 60 seconds of writing captures the core insight and prevents it from being immediately overwritten by the next video.",
      },
      {
        heading: "Note what the visuals added (or obscured)",
        body: "Video has a unique property: the visual component can either clarify or obscure the actual argument. Sometimes a compelling visual presentation makes a weak argument feel strong. In your reflection, note whether the video's ideas hold up when stripped of their visual packaging.",
      },
    ],
    prompts: [
      "What is the main idea, stripped of the visual presentation?",
      "Would this argument be as convincing in written form? Why or why not?",
      "What did I learn that I did not know before pressing play?",
      "What question does this video raise that I want to explore further?",
      "Is this creator presenting evidence or opinion? Can I tell the difference?",
    ],
    commonMistakes: [
      "Watching at 2x speed and expecting to retain the same amount — speed reduces comprehension",
      "Letting autoplay decide what you watch next instead of pausing to reflect",
      "Confusing visual engagement with intellectual engagement — good production does not equal good thinking",
      "Reflecting on the creator's personality or style instead of the actual ideas presented",
    ],
    relatedGuides: ["podcasts", "articles"],
  },
  {
    slug: "audiobooks",
    contentType: "Audiobooks",
    title: "How to Reflect on Audiobooks",
    description:
      "Audiobooks let you read more, but remember less. A reflection habit fixes the retention gap.",
    intro:
      "Audiobooks have made reading accessible in moments where traditional reading is impossible — commuting, exercising, doing chores. But the convenience comes with a retention cost: studies consistently show lower comprehension and retention from audio compared to text, especially for complex material. The fix is not to stop listening — it is to add a reflection step that audio alone cannot provide.",
    steps: [
      {
        heading: "Choose the right books for audio",
        body: "Narrative nonfiction and story-driven books work well in audio. Dense, argument-heavy, or reference-style books do not. Match the format to the content. If you find yourself constantly rewinding to re-hear a passage, the book might be better suited for text reading.",
      },
      {
        heading: "Bookmark moments, then batch your reflection",
        body: "Most audiobook apps have a bookmark or clip feature. When something strikes you, tap the bookmark. Do not try to reflect in the moment — you are usually doing something else. Instead, at the end of the listening session, review your bookmarks and write a single reflection that captures the thread connecting them.",
      },
      {
        heading: "Reflect at the end of each listening session",
        body: "Whether you listened for 20 minutes or 2 hours, take 2-3 minutes after stopping to write your response. What idea is still echoing? What do you want to think about more? This compensates for audio's natural retention disadvantage by adding the written processing step that audio lacks.",
      },
      {
        heading: "Re-listen to key sections after reflecting",
        body: "Unlike text, audio can be re-consumed while doing other activities. After writing your reflection, re-listen to the section that prompted your strongest response. This second pass, informed by your written reflection, will deepen your understanding significantly.",
      },
    ],
    prompts: [
      "What is the one moment from today's listening that I keep thinking about?",
      "How does this connect to the part I listened to yesterday or last week?",
      "What did the narrator's delivery emphasize that I might have missed in text?",
      "If I stopped listening right now, what would I remember in a week?",
      "What would I want to discuss with someone about this section?",
    ],
    commonMistakes: [
      "Listening during cognitively demanding tasks — your brain cannot process both",
      "Finishing the entire audiobook without writing a single reflection",
      "Listening at high speeds to 'get through' more books — speed reduces retention for complex material",
      "Not using bookmarks, leaving you with nothing to anchor your reflection",
    ],
    relatedGuides: ["books", "podcasts"],
  },
];

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function getReflectionGuide(slug: string): ReflectionGuide | undefined {
  return reflectionGuides.find((g) => g.slug === slug);
}
