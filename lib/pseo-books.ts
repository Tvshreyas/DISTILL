export interface BookReflection {
  slug: string;
  title: string;
  author: string;
  description: string;
  intro: string;
  prompts: string[];
  commonMistakes: string[];
  relatedBooks: string[];
  relatedGuides: string[];
}

export const bookReflections: BookReflection[] = [
  {
    slug: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    description:
      "Reflect on Atomic Habits by James Clear. Tailored prompts to help you think critically about identity-based habits, systems over goals, and the four laws of behavior change.",
    intro:
      "Atomic Habits is one of the most highlighted books of the past decade, yet most readers walk away with a shallow takeaway: make habits small. The actual architecture Clear builds — identity change as the root of behavior, the four laws as a feedback loop, environment design over willpower — tends to collapse into a generic \"just do 1% better\" mantra without deliberate reflection.\n\nThe book makes a crucial distinction between outcome-based habits and identity-based habits that most readers skip past. Clear argues you don't rise to the level of your goals; you fall to the level of your systems. But what does that actually mean for the specific habits you're trying to build or break right now?\n\nReflecting on Atomic Habits forces you to move from passive agreement to active application. Which of the four laws — cue, craving, response, reward — is the actual bottleneck in your life? Most readers never answer that question honestly.",
    prompts: [
      "Clear distinguishes between outcome-based habits and identity-based habits. What identity are you currently reinforcing with your daily behaviors — and is it the identity you actually want?",
      "Which of the four laws of behavior change (make it obvious, attractive, easy, satisfying) is your biggest weakness? Think of a specific habit you failed to build and trace it to the law you neglected.",
      "Clear argues environment design beats willpower. Describe your current physical environment — what behaviors does it make easy, and what does it make hard?",
      "The book warns about the plateau of latent potential — results lag behind effort. Where in your life are you currently in that lag period, and how does knowing about it change your response?",
      "Clear says habit stacking works by linking a new behavior to an existing one. Write out a specific habit stack you could implement tomorrow, including the exact time and location.",
    ],
    commonMistakes: [
      'Reducing the book to "1% improvement daily" without engaging with the identity-based framework that makes those improvements stick.',
      "Treating the four laws as a checklist rather than a diagnostic tool — the point is to identify which specific law is failing for each habit you struggle with.",
      "Ignoring the chapter on the downside of habits: automaticity can make you stop paying attention to errors, which is why Clear emphasizes reflection and review.",
      "Focusing only on building good habits while skipping the inversion of the four laws for breaking bad ones.",
    ],
    relatedBooks: ["deep-work", "the-power-of-habit", "grit"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    description:
      "Reflect on Deep Work by Cal Newport. Prompts designed to help you evaluate your own capacity for focused work, your relationship with distraction, and which deep work philosophy fits your life.",
    intro:
      "Deep Work presents a compelling economic argument: the ability to concentrate without distraction is becoming simultaneously more rare and more valuable. But most readers finish the book feeling guilty about their phone habits rather than building a concrete deep work practice. Newport offers four distinct philosophies of deep work scheduling — monastic, bimodal, rhythmic, journalistic — and the choice between them matters more than most readers realize.\n\nThe book's second half, which covers the four rules for cultivating deep work, gets far less attention than the first half's argument for why deep work matters. Yet the practical architecture — embracing boredom, quitting social media thoughtfully, draining the shallows — is where the real transformation happens.\n\nReflection on Deep Work should confront an uncomfortable question: how much of your current work is actually deep? Most knowledge workers, when they honestly audit their week, find the answer is shockingly low.",
    prompts: [
      "Newport describes four deep work philosophies: monastic, bimodal, rhythmic, and journalistic. Which one actually fits the constraints of your current life — not the one you wish you could adopt?",
      "Audit your last workday hour by hour. How many minutes were genuinely deep work versus shallow tasks? What does that ratio tell you?",
      'Newport argues you should "drain the shallows" by setting a shallow work budget. What percentage of your work week could realistically be shallow before your output suffers?',
      "The book claims social media is a tool, and you should apply a craftsman's approach to deciding which tools to use. Pick one platform you currently use — does it provide substantial benefits to your core professional or personal goals?",
      'Newport suggests a "shutdown complete" ritual to end the workday. What would your version of this look like, and what currently prevents you from fully disconnecting?',
    ],
    commonMistakes: [
      "Treating deep work as an all-or-nothing practice instead of choosing the scheduling philosophy (monastic, bimodal, rhythmic, journalistic) that matches your actual constraints.",
      "Focusing on eliminating distractions without building the tolerance for boredom that Newport argues is equally important.",
      "Conflating being busy with doing shallow work — some shallow tasks are necessary, and the book's point is about ratio, not total elimination.",
    ],
    relatedBooks: ["digital-minimalism", "essentialism", "flow"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description:
      "Reflect on Thinking, Fast and Slow by Daniel Kahneman. Prompts to examine your own cognitive biases, the System 1/System 2 framework, and where your intuitions reliably fail.",
    intro:
      'Thinking, Fast and Slow is arguably the most important book on decision-making written for a general audience, yet its core lesson is deeply counterintuitive: knowing about biases does not protect you from them. Kahneman himself admitted he had not improved his own susceptibility to cognitive biases after decades of studying them. That admission alone is worth reflecting on.\n\nThe System 1/System 2 framework is elegant but easy to misapply. System 1 is not "bad" and System 2 is not "good." Kahneman\'s point is more nuanced: System 1 is fast, automatic, and usually effective, but it makes predictable errors in specific, identifiable situations. The skill is learning to recognize those situations.\n\nMost readers remember a handful of biases — anchoring, loss aversion, availability heuristic — without developing the meta-skill the book actually teaches: knowing when to distrust your own confidence.',
    prompts: [
      "Kahneman shows that System 1 creates a coherent story from limited evidence (WYSIATI — What You See Is All There Is). Think of a recent decision where you felt confident. What information were you missing that you didn't even think to look for?",
      'The planning fallacy predicts that people underestimate time, cost, and risk of future actions. Pick a current project — what would a "reference class forecast" (looking at similar past projects) actually predict?',
      "Kahneman distinguishes between the experiencing self and the remembering self. They evaluate happiness differently. Which self are you optimizing your life for, and is that deliberate?",
      "Loss aversion means losses feel roughly twice as painful as equivalent gains feel pleasurable. Where in your life is loss aversion causing you to hold onto something you should let go of?",
      "The book argues that expert intuition is only reliable in high-validity environments with rapid feedback. In which domains of your life do your intuitions meet those criteria, and where are they likely unreliable?",
    ],
    commonMistakes: [
      "Believing that learning about cognitive biases makes you immune to them — Kahneman explicitly says this is not the case.",
      'Using System 1 vs. System 2 as simple shorthand for "emotional vs. rational" thinking, which flattens the nuance of how these systems interact.',
      'Cherry-picking individual biases as debate weapons ("that is just anchoring bias") instead of developing genuine epistemological humility.',
      "Ignoring the book's later chapters on prospect theory and the experiencing vs. remembering self, which contain some of the most practically important insights.",
    ],
    relatedBooks: [
      "predictably-irrational",
      "the-black-swan",
      "thinking-in-bets",
    ],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description:
      "Reflect on Sapiens by Yuval Noah Harari. Prompts to critically examine the Cognitive Revolution thesis, the role of shared myths, and Harari's narrative about human progress.",
    intro:
      "Sapiens covers 70,000 years of human history in 400 pages, which means it necessarily simplifies. The book's central thesis — that Homo sapiens dominate the planet because of our unique ability to believe in shared fictions like money, nations, and human rights — is provocative but deserves scrutiny, not just agreement.\n\nHarari's chapter on the Agricultural Revolution as \"history's biggest fraud\" is one of the most debated claims in the book. He argues that wheat domesticated humans rather than the other way around, and that the shift to farming made individual lives worse even as it grew populations. Whether you agree or not, sitting with that inversion is valuable.\n\nMany readers finish Sapiens feeling like they understand human history, when what they actually have is one compelling narrative framework among several. Reflecting on where Harari's arguments are strongest and where they stretch beyond the evidence is more useful than simply adopting his worldview wholesale.",
    prompts: [
      'Harari argues that shared myths — money, religion, nations, human rights — are what allow large-scale human cooperation. Pick one "myth" you participate in daily. How does recognizing it as a shared fiction change how you relate to it?',
      "The Agricultural Revolution chapter argues farming made individual humans worse off. What is Harari's strongest piece of evidence for this claim, and what does he leave out?",
      'Harari claims the Scientific Revolution succeeded because it embraced ignorance — admitting "we don\'t know" was the breakthrough. Where in your own thinking do you resist admitting ignorance, and what does that cost you?',
      "The book suggests that capitalism, empire, and science form an interlocking feedback loop. Do you find this framework explanatory or reductive? What does it illuminate and what does it obscure?",
      "Harari ends with speculation about the future of Homo sapiens — genetic engineering, cyborgs, artificial life. Which of his predictions feels most plausible to you today, and why?",
    ],
    commonMistakes: [
      "Accepting Harari's narrative as settled history rather than recognizing it as one interpretation — many historians challenge his claims about the Agricultural Revolution and other topics.",
      'Taking the "shared fictions" argument to mean that things like human rights or money are trivial or disposable, when Harari\'s point is about their constructed nature, not their value.',
      "Skipping the final section about humanity's future because it feels speculative, when it contains the book's most important ethical questions.",
    ],
    relatedBooks: [
      "homo-deus",
      "guns-germs-and-steel",
      "21-lessons-for-the-21st-century",
    ],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "the-psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description:
      "Reflect on The Psychology of Money by Morgan Housel. Prompts to examine your personal money story, the role of luck and risk, and the difference between being rich and being wealthy.",
    intro:
      "The Psychology of Money argues that financial success is not primarily about intelligence or technical knowledge — it is about behavior. Housel structures the book as 20 short chapters, each examining a different psychological pattern around money. The format is accessible but can create a false sense of completion: readers nod along to each chapter without confronting which patterns actually describe their own financial behavior.\n\nHousel's distinction between getting rich and staying rich is one of the book's most important ideas. Getting rich requires optimism and risk-taking; staying rich requires humility, frugality, and paranoia about losing what you have. Most readers identify with the first profile while living the second, or vice versa.\n\nThe chapter on \"luck and risk\" — that outcomes are never as good or as bad as they seem because unseen forces play a larger role than we admit — challenges the just-world narrative that pervades financial media. Reflecting on your own financial history through this lens can be genuinely uncomfortable.",
    prompts: [
      "Housel says no one is crazy with money — everyone's financial decisions make sense given their personal history. What early experience with money shaped your current financial behavior, and is that influence still serving you?",
      "The book distinguishes between being rich (high current income) and being wealthy (assets you haven't spent). Which are you optimizing for, and is that a conscious choice?",
      'Housel argues that "enough" is the hardest financial concept. What is your number for "enough," and how did you arrive at it?',
      "The chapter on tails argues that a tiny number of events drive the majority of outcomes in investing and business. Where in your financial life are you expecting average results instead of preparing for extreme ones?",
      'Housel describes "room for error" as the most underrated financial skill. Where in your current finances have you left no margin for things going wrong?',
    ],
    commonMistakes: [
      "Reading each chapter as a standalone lesson without connecting them — the book's power comes from how the 20 chapters interact to form a behavioral portrait of how people relate to money.",
      "Agreeing with Housel's point about luck and risk in the abstract while still judging your own financial outcomes as purely merit-based.",
      'Using the "no one is crazy" framing to justify financial decisions that are actually self-destructive rather than context-appropriate.',
    ],
    relatedBooks: [
      "rich-dad-poor-dad",
      "think-and-grow-rich",
      "thinking-in-bets",
    ],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "mans-search-for-meaning",
    title: "Man's Search for Meaning",
    author: "Viktor Frankl",
    description:
      "Reflect on Man's Search for Meaning by Viktor Frankl. Prompts to explore logotherapy, the role of suffering, and what Frankl's concentration camp experience reveals about human purpose.",
    intro:
      "Man's Search for Meaning is split into two parts that readers engage with unevenly. The first part — Frankl's account of surviving Auschwitz — is harrowing and memorable. The second part — his outline of logotherapy as a psychological framework — is where the actionable ideas live, but many readers skim it or skip it entirely.\n\nFrankl's central claim is that humans can endure almost any suffering if they can find meaning in it. This is often reduced to toxic positivity: \"just find the silver lining.\" But Frankl is saying something harder. He is saying that the absence of meaning, not the presence of suffering, is what breaks people. And that meaning must be discovered, not manufactured.\n\nThe book's most quoted line — \"Between stimulus and response there is a space. In that space is our freedom\" — is actually not confirmed to be Frankl's words. But the idea it captures is central to the book: even in the most constrained circumstances, you retain the freedom to choose your attitude. Reflecting on where that applies in your own comparatively comfortable life is the real work.",
    prompts: [
      "Frankl identifies three sources of meaning: purposeful work, love, and courage in suffering. Which of these three is most active in your life right now, and which is most absent?",
      "Logotherapy claims that the primary human drive is not pleasure (Freud) or power (Adler) but meaning. When you examine your own motivations honestly, which of these three drives most often moves you?",
      "Frankl observed that prisoners who lost their sense of future purpose deteriorated fastest. What future purpose is currently pulling you forward, and how would you respond if it disappeared?",
      'The book describes "Sunday neurosis" — the emptiness people feel when they stop being busy and confront the lack of meaning in their lives. Do you experience anything like this? What does it tell you?',
      "Frankl argues you cannot pursue happiness directly — it must ensue as a side effect of dedicating yourself to something greater. Where are you currently pursuing happiness directly instead of letting it emerge from meaningful engagement?",
    ],
    commonMistakes: [
      "Reducing Frankl to a motivational speaker — the book is grounded in extreme suffering, and glossing over that context distorts the message.",
      'Skipping Part 2 (logotherapy) because Part 1 (the memoir) feels like the "real" book. The therapeutic framework is what makes the memoir actionable.',
      'Using Frankl\'s ideas to minimize your own suffering by comparison ("my problems are nothing compared to Auschwitz"), which is the opposite of what Frankl intended.',
      'Treating "finding meaning in suffering" as a universal prescription rather than recognizing Frankl\'s point that meaning is individually discovered, not imposed from outside.',
    ],
    relatedBooks: [
      "meditations",
      "the-power-of-now",
      "the-subtle-art-of-not-giving-a-fck",
    ],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    description:
      "Reflect on Meditations by Marcus Aurelius. Prompts to engage with Stoic philosophy, the practice of self-examination, and what a Roman emperor's private journal reveals about managing adversity.",
    intro:
      "Meditations was never meant to be published. It is the private journal of a Roman emperor writing reminders to himself about how to think and act. This context matters because Marcus Aurelius is not teaching — he is practicing. Many of the same ideas repeat across the twelve books because he needed to remind himself of them repeatedly. That repetition is itself a lesson about how difficult it is to live by your principles.\n\nModern readers tend to cherry-pick Stoic quotes from Meditations without engaging with the worldview beneath them. Marcus's philosophy is grounded in a specific cosmology — logos, the rational order of the universe, the interconnection of all things — that shapes how he thinks about adversity, death, and duty. Stripping the quotes from this framework turns Stoicism into bumper stickers.\n\nThe book's most challenging idea is not about enduring hardship. It is about recognizing that your judgments about events, not the events themselves, cause your suffering. This sounds simple until you try to apply it to something you genuinely care about.",
    prompts: [
      "Marcus repeatedly reminds himself that his reactions to events, not the events themselves, are within his control. Pick a situation currently frustrating you — what is the event, and what judgment are you adding to it?",
      "Meditations returns to the theme of mortality dozens of times. Marcus writes as if he might die today. If you genuinely believed that, what would you stop doing and what would you start?",
      "Marcus criticizes himself for getting angry at others by reminding himself that they act from ignorance, not malice. Think of someone whose behavior recently angered you. What might they believe that makes their behavior make sense to them?",
      "The book emphasizes duty and service to the common good. What is your equivalent of Marcus's obligation as emperor — the role or responsibility you cannot walk away from? How does framing it as duty rather than burden change your experience of it?",
      'Marcus writes: "The impediment to action advances action. What stands in the way becomes the way." Name a current obstacle in your life. What skill or character trait could you develop specifically because of this obstacle?',
    ],
    commonMistakes: [
      "Treating Meditations as a self-help book rather than a philosophical journal — Marcus is not giving advice but wrestling with his own failures to live up to Stoic ideals.",
      "Equating Stoicism with emotional suppression. Marcus does not argue against feeling emotions; he argues against being controlled by false judgments about events.",
      "Reading the book linearly like a narrative when it works better as a book you open to random pages and sit with individual passages.",
    ],
    relatedBooks: [
      "mans-search-for-meaning",
      "the-power-of-now",
      "the-subtle-art-of-not-giving-a-fck",
    ],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "48-laws-of-power",
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    description:
      "Reflect on The 48 Laws of Power by Robert Greene. Prompts to critically examine power dynamics, your own relationship with influence, and the ethics of strategic social behavior.",
    intro:
      'The 48 Laws of Power generates strong reactions — readers either treat it as a playbook or dismiss it as manipulative. Both responses miss the point. Greene is describing patterns of power that operate whether you endorse them or not. The value of reflecting on this book is not in deciding whether to "use" the laws but in recognizing when they are being used on you.\n\nMany of the laws contradict each other ("Never Outshine the Master" vs. "Always Say Less Than Necessary" in contexts where silence makes you invisible). Greene acknowledges this. Power is situational, and the real skill is judgment about which dynamics are in play, not mechanical application of rules.\n\nThe book draws heavily from historical examples, and readers often get absorbed in the stories without examining the selection bias. Greene chooses examples that support each law. A useful reflection exercise is asking: when has this law failed? What would a counter-example look like?',
    prompts: [
      "Which of the 48 laws have you unconsciously followed in your own life, and which have you unconsciously violated? What were the consequences?",
      "Greene argues that displaying too much honesty and openness can be a tactical mistake. Do you agree or disagree based on your own experience? When has radical honesty helped you, and when has it cost you?",
      'Law 25 states: "Re-Create Yourself." Greene means this as a power strategy, but it also raises identity questions. How much of your current public persona is deliberate construction versus authentic expression?',
      "Many laws contradict each other depending on context. Pick two contradictory laws and describe a real situation where each would be the correct approach. What determines which applies?",
      "Greene presents power as amoral — neither good nor bad. After reading the book, do you agree with this framing? Where do you draw the line between strategic awareness and manipulation?",
    ],
    commonMistakes: [
      "Treating the 48 laws as a literal rulebook to follow sequentially rather than a descriptive map of how power dynamics operate in different contexts.",
      'Dismissing the entire book as "manipulative" without engaging with the genuine insight that power dynamics exist whether you study them or not.',
      "Attempting to apply the laws mechanically without developing the situational judgment that Greene argues is the actual skill.",
      "Ignoring the historical selection bias — every law is supported by cherry-picked examples, and examining counter-examples is part of serious reading.",
    ],
    relatedBooks: [
      "influence",
      "never-split-the-difference",
      "how-to-win-friends-and-influence-people",
    ],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "how-to-win-friends-and-influence-people",
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    description:
      "Reflect on How to Win Friends and Influence People by Dale Carnegie. Prompts to examine genuine interest vs. tactical niceness, the role of listening, and Carnegie's principles in a digital age.",
    intro:
      'Published in 1936, Carnegie\'s book has sold over 30 million copies and continues to shape how people think about social skills. But modern readers often reduce it to "be nice to people" or "remember their name," missing the deeper psychological architecture. Carnegie\'s core insight is not about technique — it is about genuine curiosity toward other people.\n\nThe book\'s principles only work when they come from authentic interest. Carnegie explicitly warns against flattery and manipulation. "Be hearty in your approbation and lavish in your praise" is not about being fake — it is about training yourself to actually notice what others do well. The difference between Carnegie\'s approach and manipulation is the starting point: genuine respect for the other person.\n\nIn a digital world of parasocial relationships and algorithmic connection, Carnegie\'s emphasis on in-person, one-to-one engagement feels both dated and urgent. Reflecting on this book means asking honestly whether your social behavior online and offline reflects genuine interest or performed likability.',
    prompts: [
      "Carnegie's first principle is \"Don't criticize, condemn, or complain.\" Think about your last week of conversations — including texts and social media. How often did you violate this principle, and what was the actual effect?",
      "The book argues that the deepest human need is to feel important. Who in your life might not feel important to you right now — not because you don't care, but because you haven't shown it?",
      "Carnegie distinguishes between flattery (insincere) and appreciation (sincere). Think of someone you genuinely appreciate but haven't told. What specifically do you appreciate about them, and why haven't you said it?",
      "\"Talk in terms of the other person's interests\" is one of Carnegie's core principles. In your most recent significant conversation, how much time did you spend on your interests vs. theirs? What would change if you reversed the ratio?",
      "Carnegie wrote this in 1936 for face-to-face interaction. Which of his principles translates well to digital communication, and which ones break down? Why?",
    ],
    commonMistakes: [
      "Reducing the book to social hacking techniques while ignoring Carnegie's repeated emphasis on sincerity as the foundation of all his principles.",
      "Applying the principles as a performance without developing genuine curiosity about other people, which Carnegie explicitly warns against.",
      "Dismissing the book as obvious without honestly auditing how often you actually practice its principles in daily interactions.",
    ],
    relatedBooks: ["influence", "never-split-the-difference", "quiet"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      'Reflect on The Alchemist by Paulo Coelho. Prompts to examine your own "Personal Legend," the role of omens and intuition in decision-making, and the tension between seeking and arriving.',
    intro:
      "The Alchemist is a deceptively simple story that divides readers sharply. Some find it life-changing; others find it platitudinous. Both reactions can coexist — the book works through allegory rather than argument, and its value depends almost entirely on what you bring to it. Santiago's journey to find treasure at the Egyptian pyramids is a framework for examining your own relationship with purpose, risk, and the fear of pursuing what you want.\n\nCoelho's concept of a \"Personal Legend\" — the thing you have always wanted to accomplish — is both the book's most powerful idea and its most dangerous one. Powerful because it names the tension between safety and calling. Dangerous because it can become a justification for recklessness disguised as destiny.\n\nThe ending, where Santiago discovers the treasure was back where he started, is the part most worth reflecting on. It is not a twist — Coelho signals it throughout. The point is that the journey transformed Santiago into someone who could recognize what was always there. The question for the reader is: what are you already standing on that you cannot see?",
    prompts: [
      "The crystal merchant tells Santiago he does not want to go to Mecca because having the dream is better than fulfilling it. Where in your life are you preserving a dream rather than pursuing it, and is that protection or avoidance?",
      'Santiago must give up increasing levels of security to continue his journey — his sheep, his money, his relationship with Fatima. What would you have to give up to pursue your own "Personal Legend," and at which point would you turn back?',
      "The book suggests the universe conspires to help those who pursue their Personal Legend. Do you take this literally or metaphorically? How does your interpretation change the book's usefulness?",
      "The treasure was buried where Santiago's journey began. Think of a time when you went searching for something externally that was already available to you. What did the search teach you that staying still would not have?",
      "The Englishman seeks the secrets of alchemy through books; Santiago seeks them through experience. Which is your default learning style, and what has it cost you?",
    ],
    commonMistakes: [
      'Reading the book too literally — treating "the universe conspires to help you" as a factual promise rather than an allegory about commitment and awareness.',
      "Using the Personal Legend concept to justify impulsive decisions without the disciplined preparation and sacrifice that Santiago's journey actually required.",
      "Dismissing the book as too simple without engaging with the allegory on its own terms — Coelho is writing a fable, not a self-help manual.",
    ],
    relatedBooks: [
      "mans-search-for-meaning",
      "the-power-of-now",
      "start-with-why",
    ],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "educated",
    title: "Educated",
    author: "Tara Westover",
    description:
      "Reflect on Educated by Tara Westover. Prompts to examine the cost of education, the tension between family loyalty and self-determination, and how your own upbringing shapes what you accept as normal.",
    intro:
      "Educated is a memoir about a woman who grew up in a survivalist family in Idaho and did not enter a classroom until she was seventeen, eventually earning a PhD from Cambridge. But reducing it to an inspirational education story misses its hardest questions. The book is really about the cost of choosing yourself over your family, and whether that cost is worth paying.\n\nWestover does not present education as unambiguously good. She shows how it separated her from her family, changed her relationship to her own memories, and forced her to choose between two incompatible versions of reality — her family's narrative and the one she constructed through learning. That tension is never fully resolved.\n\nThe most valuable reflection this book prompts is not about formal schooling. It is about examining the beliefs you inherited from your own upbringing that you have never questioned — not because they are obviously wrong, but because it never occurred to you to question them.",
    prompts: [
      "Westover describes how her family's version of events contradicted her own memories. Think of a family narrative you grew up with. Have you ever questioned it, and what happened when you did?",
      "Education gave Westover new frameworks but also alienated her from people she loved. Has learning something new ever created distance between you and someone close to you? Was the knowledge worth the distance?",
      "The book shows how normalization works — Westover did not recognize certain experiences as abnormal until she had a contrasting frame of reference. What in your own upbringing did you assume was universal that turned out to be specific to your family or community?",
      "Westover's father and brother each impose a narrative on reality that the family is expected to accept. Where in your own life do you accept someone else's version of events to maintain a relationship?",
      "By the end, Westover has a PhD but has lost most of her family relationships. She does not present this as a clear victory. What would you have done differently, if anything, and at what point?",
    ],
    commonMistakes: [
      "Treating the book as a simple triumph-of-education story when Westover explicitly shows the enormous personal cost of her choices.",
      "Judging Westover's family purely from the outside without engaging with her complex love for them, which is central to the book's tension.",
      "Reading the memoir without reflecting on your own unexamined inherited beliefs — the book's power is in prompting self-examination, not just empathy.",
    ],
    relatedBooks: ["mindset", "quiet", "range"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "outliers",
    title: "Outliers",
    author: "Malcolm Gladwell",
    description:
      "Reflect on Outliers by Malcolm Gladwell. Prompts to critically examine the 10,000-hour rule, the role of circumstance in success, and what Gladwell's thesis means for your own ambitions.",
    intro:
      "Outliers is probably the most misunderstood book in popular nonfiction. The \"10,000-hour rule\" — which Gladwell presents as one factor among many — has been extracted, simplified, and turned into a motivational mantra that contradicts the book's actual argument. Gladwell's thesis is that individual talent and effort are necessary but not sufficient. Timing, culture, geography, family, and sheer luck play roles that successful people consistently underreport.\n\nThe book's most provocative chapters are about cultural legacies — how Korean cockpit communication norms contributed to plane crashes, how rice-paddy agriculture shaped Asian attitudes toward hard work. These chapters make readers uncomfortable because they suggest that culture shapes behavior in ways we do not fully control.\n\nReflecting on Outliers means honestly examining the circumstances that shaped your own trajectory — the advantages you did not earn and the obstacles you did not choose. Most readers agree with Gladwell's thesis in the abstract but exempt themselves from it.",
    prompts: [
      "Gladwell shows that birth month gave Canadian hockey players a systematic advantage. What arbitrary timing or circumstantial advantage has benefited your career or education that you rarely acknowledge?",
      "The 10,000-hour rule is the book's most famous idea, but Gladwell presents it alongside cultural legacy, timing, and opportunity. Which of these factors has mattered most in your own life — and which do you tend to overweight or underweight?",
      "The chapter on cultural legacies argues that communication patterns from centuries ago still affect professional performance today. What cultural patterns from your own background influence how you work or communicate?",
      'Gladwell argues that "self-made" is a myth — every successful person benefited from invisible structures. Think of a success you are proud of. What structures or people made it possible that you did not create yourself?',
      "The book implies that meaningful work requires autonomy, complexity, and a connection between effort and reward. Does your current work meet these criteria? If not, which is missing?",
    ],
    commonMistakes: [
      "Extracting the 10,000-hour rule as a standalone self-help principle when Gladwell's point is that practice alone is insufficient without opportunity and context.",
      "Using the book's emphasis on circumstance to adopt a fatalistic attitude — Gladwell does not argue effort is irrelevant, only that it is insufficient alone.",
      "Agreeing with the thesis while still narrating your own success as primarily the result of hard work and talent.",
    ],
    relatedBooks: ["grit", "range", "mindset"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "quiet",
    title: "Quiet",
    author: "Susan Cain",
    description:
      "Reflect on Quiet by Susan Cain. Prompts to examine introversion in your own life, the Extrovert Ideal in culture and workplaces, and how temperament shapes your choices.",
    intro:
      'Quiet argues that Western culture, particularly American culture, has an "Extrovert Ideal" that systematically undervalues introverted temperaments. Cain builds her case across education, business, and relationships, showing how open offices, group brainstorming, and charismatic leadership have been elevated despite evidence that they often produce worse outcomes than quiet, solitary work.\n\nThe book is not simply a defense of introversion. Cain introduces the concept of "Free Trait Theory" — the idea that introverts can act extroverted (and vice versa) in service of "core personal projects" that matter deeply to them. This nuance prevents the book from becoming a temperament-based excuse to never stretch.\n\nWhat makes Quiet worth reflecting on is not just personality typing. It is the invitation to examine how much of your social behavior is authentic versus performative — how often you adopt an extroverted persona because the environment demands it, and what that ongoing performance costs you.',
    prompts: [
      'Cain describes the "Extrovert Ideal" — the cultural bias toward sociability, gregariousness, and quick action. Where in your own life — work, school, social settings — have you felt pressured to perform extroversion?',
      'Free Trait Theory says you can act against your temperament for projects you care deeply about. What "core personal project" causes you to stretch beyond your natural temperament, and is the cost sustainable?',
      "Cain argues that brainstorming in groups often produces worse ideas than individuals working alone and then sharing. Think about how decisions are made in your workplace or community. Do the loudest voices dominate?",
      "The book discusses how introversion and extroversion affect romantic and family relationships. How does your temperament create friction or harmony with the people closest to you?",
      "Cain presents Rosa Parks as an introvert whose quiet resolve changed history. Think of a situation where quiet persistence or observation gave you an advantage that loud assertiveness would not have.",
    ],
    commonMistakes: [
      "Using the book to justify avoiding all uncomfortable social situations rather than engaging with Cain's Free Trait Theory, which acknowledges the value of strategic stretching.",
      "Treating introversion and extroversion as binary categories when Cain emphasizes they exist on a spectrum and are context-dependent.",
      "Reading the book as only relevant to introverts — Cain's arguments about the Extrovert Ideal and group dynamics apply to anyone navigating modern work culture.",
    ],
    relatedBooks: [
      "deep-work",
      "flow",
      "how-to-win-friends-and-influence-people",
    ],
    relatedGuides: ["how-to-reflect-on-books"],
  },
];

export function getBookReflection(slug: string): BookReflection | undefined {
  return bookReflections.find((b) => b.slug === slug);
}
