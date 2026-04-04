export interface PromptTopic {
  slug: string;
  topic: string;
  description: string;
  intro: string;
  prompts: string[];
  whyTheseWork: string;
  relatedTopics: string[];
  relatedGuides: string[];
  relatedBooks?: string[];
  relatedBlogPosts?: string[];
}

export const promptTopics: PromptTopic[] = [
  {
    slug: "philosophy",
    topic: "Philosophy",
    description:
      "Reflection prompts for philosophy books, lectures, and essays. Questions that push you past surface-level understanding into real philosophical thinking.",
    intro:
      'Philosophy is uniquely easy to consume without actually doing. You can read Nietzsche, nod along, and walk away with nothing but a vague sense that "God is dead" means something important. The gap between understanding a philosophical argument and letting it change how you think is enormous.\n\nThese prompts force you to cross that gap. They ask you to take the abstract ideas you just encountered and test them against your actual life, your actual beliefs, and your actual decisions. That\'s where philosophy stops being academic and starts being useful.',
    prompts: [
      "What assumption about reality does this author make that you've never questioned before?",
      "If you adopted this philosopher's worldview fully, what would you do differently tomorrow?",
      "Where does this argument break down — and is that a flaw in the logic or a limit of your understanding?",
      "What would the strongest objection to this idea look like?",
      "Which of your current beliefs would this philosopher challenge most directly?",
      "Does this idea comfort you or disturb you — and what does that reaction tell you?",
      "What everyday decision would you make differently if you took this idea seriously?",
      "How does this philosophy contradict something else you believe? Can both be true?",
      "What life experience have you had that either supports or undermines this argument?",
      "If you had to explain this idea to someone skeptical, what's the one thing you'd want them to understand?",
      "What question does this philosopher leave unanswered — and why might they have left it open?",
      "Is this idea actually new to you, or is it a sophisticated version of something you already believed?",
    ],
    whyTheseWork:
      'Philosophy prompts work by forcing specificity. Most people engage with philosophy at the level of "interesting idea" and stop there. These prompts break that pattern by demanding you connect abstract arguments to concrete situations — your beliefs, your decisions, your life.\n\nThe prompts that ask "what would you do differently" are especially effective because they expose the gap between intellectual agreement and actual commitment. You can agree with Stoicism in theory while panicking about a delayed flight. That gap is where real philosophical growth happens.',
    relatedTopics: ["ethics", "psychology", "spirituality"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "psychology",
    topic: "Psychology",
    description:
      'Reflection prompts for psychology content. Questions that help you move past "that\'s interesting" to actually understanding your own mind better.',
    intro:
      'Psychology content has a unique trap: it makes you feel like you understand yourself better without actually changing anything. You read about cognitive biases, think "oh, I do that," and then keep doing it. The knowing-doing gap in psychology is wider than in almost any other field.\n\nThese prompts are designed to close that gap. They push you to identify specific instances of psychological patterns in your own life — not in the abstract, but in your actual recent behavior and decisions.',
    prompts: [
      "What behavior of yours does this research actually explain — can you name a specific recent example?",
      "How might this psychological finding be affecting decisions you're making right now without realizing it?",
      "If this study is true, what have you been wrong about?",
      "What's the difference between knowing about this bias and actually overcoming it?",
      "Who in your life demonstrates the opposite of what this research predicts — and why?",
      "What would someone who fully internalized this finding do differently than you currently do?",
      "Does this research make you more sympathetic toward anyone you've been frustrated with?",
      "What self-serving interpretation of this finding are you tempted to adopt?",
      "If you explained this to a friend, which part would you struggle to explain clearly?",
      "What's one situation this week where you could test this idea against your own experience?",
      "How does this finding challenge the story you tell about yourself?",
      "What would it actually take to change the behavior this research describes — not in theory, but for you specifically?",
      "Is this finding genuinely new to you, or does it just give a name to something you already sensed?",
    ],
    whyTheseWork:
      'Psychology prompts work by countering the illusion of self-knowledge. Reading about the planning fallacy doesn\'t fix your planning. These prompts force you to move from "humans do this" to "I specifically do this in these specific situations."\n\nThe most effective psychology reflection happens when you catch yourself being the subject of the research, not just the reader. That\'s why several prompts ask for concrete, recent examples rather than abstract agreement.',
    relatedTopics: ["self-improvement", "relationships", "philosophy"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "business",
    topic: "Business",
    description:
      'Reflection prompts for business books, case studies, and podcasts. Move beyond "great advice" to figuring out what actually applies to your situation.',
    intro:
      "Business content is the most consumed and least applied category of information. People read hundreds of business books and implement almost nothing. The problem isn't the advice — it's that most business content is contextual, and readers skip the step of figuring out whether it applies to their context.\n\nThese prompts force you to do that translation work. Instead of collecting more frameworks, you'll interrogate whether the specific advice you just consumed actually fits your specific situation.",
    prompts: [
      "What specific context made this strategy work for the author — and how is your context different?",
      "If you could only implement one idea from this, which would have the most impact in the next 30 days?",
      "What would you need to give up or stop doing to make room for this advice?",
      "Who is this advice actually for — and are you honestly in that category?",
      "What's the hidden cost of following this advice that the author didn't mention?",
      "If this strategy is so effective, why isn't everyone doing it? What's the real barrier?",
      "What would failure look like if you implemented this poorly?",
      "Does this contradict other business advice you've followed — and which one is right for you?",
      "What's the smallest possible experiment you could run to test this idea?",
      "Is the author selling you on their specific solution or on a genuine problem you have?",
      "What assumption about your market, team, or resources does this advice require?",
      "If you'd read this five years ago, would it have worked then? What changed?",
    ],
    whyTheseWork:
      'Business prompts work by introducing friction between consumption and implementation. Most business content creates urgency to act without creating clarity about what to act on. These prompts slow you down to ask whether the advice fits before you try to force it.\n\nThe best business thinkers are skeptical consumers of business content. They ask "under what conditions" rather than "how do I copy this." That\'s the thinking these prompts develop.',
    relatedTopics: ["leadership", "economics", "technology"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "history",
    topic: "History",
    description:
      "Reflection prompts for history books and documentaries. Questions that help you extract real lessons instead of just collecting stories.",
    intro:
      "History is full of vivid stories, but stories aren't lessons. Most people walk away from history content with narratives — \"Rome fell because of X\" — without realizing those narratives are heavily simplified and often shaped more by the author's worldview than by what actually happened.\n\nThese prompts help you engage with historical content more critically. They push you to separate the storytelling from the evidence, recognize the author's framing, and think about what historical events actually teach about the present.",
    prompts: [
      "What parts of this historical narrative feel too clean — where is the author simplifying?",
      "Whose perspective is missing from this account, and how might it change the story?",
      "What does this historical event reveal about human nature that's still true today?",
      "If you were living through this period, what would you likely have believed — and does that make you uncomfortable?",
      "What modern situation does this remind you of — and where does the analogy break down?",
      "What did the people in this story think was going to happen next? Why were they wrong?",
      "What structural forces were at play here that individuals couldn't have controlled?",
      "What lesson is the author trying to get you to draw — and do you actually agree?",
      "If the key figures had made different choices, what realistically would have changed?",
      "What surprised you most, and why didn't you already know it?",
      "How does this change your understanding of something happening right now?",
      "What does this event suggest about how people will look back on our current era?",
    ],
    whyTheseWork:
      'History prompts work by disrupting hindsight bias. It\'s easy to read about historical events and feel like the outcomes were obvious. These prompts force you to imagine yourself inside the uncertainty that people actually experienced.\n\nThey also counter the tendency to extract simple "lessons" from complex events. History is messy. Good reflection on history means sitting with that complexity rather than reducing it to a bumper sticker.',
    relatedTopics: ["politics", "sociology", "philosophy"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-videos"],
  },
  {
    slug: "science",
    topic: "Science",
    description:
      'Reflection prompts for science books, papers, and documentaries. Move past "wow, that\'s cool" to understanding what scientific findings actually mean.',
    intro:
      "Science content often produces wonder without understanding. You watch a documentary about quantum physics and feel amazed, but if someone asked you to explain what you learned, you'd struggle. The gap between scientific entertainment and scientific literacy is huge.\n\nThese prompts help you engage with science content at the level of understanding rather than just appreciation. They push you to articulate what you actually learned, identify what you still don't understand, and think about what scientific findings mean for how you see the world.",
    prompts: [
      "Can you explain the core finding in one sentence without using any jargon?",
      "What's the difference between what this research actually shows and how it's being presented?",
      "What would need to be true for this finding to be wrong?",
      "How does this change your mental model of how something works?",
      "What's the most important thing you still don't understand about this topic?",
      "If this finding is confirmed, what practical difference does it make to anyone?",
      "What assumptions did the researchers make that you're taking on faith?",
      "How would you explain this to a smart 12-year-old — and where would you get stuck?",
      "What related question does this research not answer?",
      "Does this finding confirm or challenge something you previously believed?",
      "What's the time scale here — is this relevant now or in 50 years?",
      "If you could ask the researcher one question, what would it be?",
    ],
    whyTheseWork:
      "Science prompts work by testing comprehension rather than assuming it. The feeling of understanding is not the same as actual understanding. These prompts reveal the gap by asking you to explain, apply, and evaluate rather than just appreciate.\n\nThe \"explain without jargon\" prompt is particularly powerful because jargon often hides confusion. If you can't say it simply, you don't actually understand it yet.",
    relatedTopics: ["technology", "health", "environment"],
    relatedGuides: ["how-to-reflect-on-articles", "how-to-reflect-on-videos"],
  },
  {
    slug: "self-improvement",
    topic: "Self-Improvement",
    description:
      "Reflection prompts for self-improvement content. Cut through the motivation and figure out what you'll actually do differently.",
    intro:
      "Self-improvement content is designed to make you feel like you're growing while you're consuming it. That feeling is the product — not the growth itself. Most people read self-help books, feel inspired for 48 hours, and then return to their default patterns.\n\nThese prompts interrupt that cycle. They force you to be honest about whether you'll actually change anything, what's stopped you before, and whether this particular advice addresses a real problem you have or just a problem the author convinced you that you have.",
    prompts: [
      "What specific problem in your life does this advice actually address?",
      "You've probably heard similar advice before. What's different this time — or is it?",
      "What would you need to stop doing to make room for this new habit or practice?",
      "Be honest: will you actually do this in two weeks, or will you have moved on to the next book?",
      "What's the real reason you haven't already done what this author suggests?",
      "Is the author solving a problem you actually have, or creating one you didn't know you had?",
      "What's the smallest version of this advice you could start with today?",
      "If you followed this advice and it didn't work, what would you blame — the advice or your execution?",
      "Who do you know who already does what this author recommends? What's their life actually like?",
      "What part of this advice flatters you, and what part makes you uncomfortable? The uncomfortable part matters more.",
      "What's the one line from this that you'd write on a sticky note — and would you actually look at it?",
      "If nothing about your behavior changes after consuming this, was it worth your time?",
    ],
    whyTheseWork:
      'Self-improvement prompts work by introducing accountability to the reflection process. Self-help content rarely asks you to evaluate your own track record with previous self-help content. These prompts do.\n\nThe hardest and most useful prompt is the one about whether you\'ll actually do anything different. Most honest answers are "probably not" — and that honesty itself is more valuable than another dose of motivation.',
    relatedTopics: ["psychology", "health", "creativity"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "economics",
    topic: "Economics",
    description:
      "Reflection prompts for economics content. Move past the talking points and develop your own economic thinking.",
    intro:
      "Economics content is uniquely polarizing — people tend to adopt economic frameworks that confirm their existing political views and then stop thinking. Left-leaning readers gravitate toward inequality research. Right-leaning readers gravitate toward free-market arguments. Both walk away more confident and less curious.\n\nThese prompts push you past that pattern. They ask you to engage with economic ideas on their own terms, consider the tradeoffs the author might be glossing over, and think about what economic arguments actually mean for real people in real situations.",
    prompts: [
      "What tradeoff is this economic argument asking you to accept — and is the author honest about it?",
      "Who benefits and who loses under this economic model?",
      "What would need to be true about human behavior for this economic theory to work as described?",
      "Does this analysis account for what happens to people during the transition, or only the end state?",
      "What data would change your mind about this economic claim?",
      "How does this economic idea play out differently at different income levels?",
      "What's the strongest argument against the position this author is taking?",
      "Is the author describing how the economy works or how they think it should work?",
      "What's an economic reality in your own life that this content helped you understand better?",
      "If this economic policy were implemented, what unintended consequences can you imagine?",
      "What does this author assume about incentives — and do those assumptions match your experience?",
      "What's the difference between this being theoretically correct and practically useful?",
    ],
    whyTheseWork:
      'Economics prompts work by separating description from prescription. Much of economics content blurs the line between "this is how things work" and "this is how things should work." These prompts train you to notice that boundary.\n\nThey also counter confirmation bias by asking you to identify the strongest opposing argument — something most economic thinkers are trained to do but most economic content consumers are not.',
    relatedTopics: ["politics", "business", "sociology"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-articles"],
  },
  {
    slug: "technology",
    topic: "Technology",
    description:
      "Reflection prompts for technology content. Think critically about tech trends, tools, and predictions instead of just following the hype cycle.",
    intro:
      'Technology content operates on a hype cycle that rewards excitement over accuracy. Every new tool is "revolutionary," every trend is "inevitable," and every prediction is presented with false confidence. If you just absorb tech content without reflecting on it, you end up with a head full of other people\'s predictions.\n\nThese prompts help you develop your own perspective on technology. They push you to separate the genuinely important from the merely exciting, and to think about second-order effects that tech commentators often ignore.',
    prompts: [
      "Is this technology solving a real problem people have, or a problem technologists find interesting?",
      "Who is excluded from the benefits of this technology — and is that discussed?",
      "What needs to go right for this technology to work as described? What could go wrong?",
      "How is this different from the last time someone promised this same thing?",
      "If this technology succeeds, what existing thing does it kill — and is anyone mourning that?",
      "What does the author assume about adoption that might not be true?",
      "If you removed the buzzwords from this argument, is there still a compelling point?",
      "What would a skeptic say — and is their skepticism fair?",
      "How does this technology change power dynamics — who gains control, who loses it?",
      "Is this a genuine prediction or a marketing narrative dressed up as analysis?",
      "What would this technology's impact look like in 10 years vs. what's being promised in 2?",
      "What's the most boring interpretation of what this technology actually does?",
    ],
    whyTheseWork:
      "Technology prompts work by puncturing hype. The tech industry's default communication style is breathless optimism, and that style infects even critical analysis. These prompts create a counterweight.\n\nThe \"boring interpretation\" prompt is especially effective. If you strip away the narrative and describe what a technology actually does in plain terms, you quickly see whether there's real substance or just good storytelling.",
    relatedTopics: ["science", "business", "ethics"],
    relatedGuides: ["how-to-reflect-on-articles", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "politics",
    topic: "Politics",
    description:
      "Reflection prompts for political content. Develop your own political thinking instead of borrowing someone else's.",
    intro:
      "Political content is designed to make you agree, not to make you think. Whether it's a book, podcast, or documentary, political content almost always has a persuasive intent — even when it presents itself as neutral analysis. That doesn't make it worthless, but it does mean you need to engage with it differently.\n\nThese prompts help you process political content without simply absorbing the author's framing. They push you to identify what you're being asked to believe, consider what's being left out, and develop your own position rather than adopting someone else's.",
    prompts: [
      "What is this content trying to get you to believe — and are you being persuaded by evidence or emotion?",
      "What facts would you need to verify before accepting this argument?",
      "Whose experience is centered in this political analysis — and whose is invisible?",
      "If someone you disagree with made this exact same argument, would you still find it convincing?",
      "What does the author gain from you agreeing with them?",
      "What is the strongest version of the opposing view — not a strawman, but the real thing?",
      "What would you need to see to change your mind about this issue?",
      "Is this content giving you new information or reinforcing what you already believe?",
      "What practical action does this political position imply — and are you willing to take it?",
      "How would someone with a different lived experience react to this same content?",
      "What complexity is being reduced to a simple narrative here?",
      "If this political prediction turns out to be wrong, will you update your thinking?",
    ],
    whyTheseWork:
      "Political prompts work by making the persuasion visible. Most political content works best when you don't notice you're being persuaded. These prompts force you to notice — to separate the information from the framing.\n\nThe prompt about steelmanning the opposition is particularly valuable. If you can't state the opposing view in terms its supporters would recognize, you don't understand the issue well enough to have a strong opinion.",
    relatedTopics: ["economics", "history", "ethics"],
    relatedGuides: ["how-to-reflect-on-articles", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "sociology",
    topic: "Sociology",
    description:
      "Reflection prompts for sociology content. Connect what you learn about society to how you actually live in it.",
    intro:
      'Sociology gives you a lens for seeing patterns in human behavior at scale. But that lens can become a trap — you start seeing "systems" and "structures" everywhere while losing sight of individual agency and your own role within those systems.\n\nThese prompts help you hold both perspectives. They ask you to take sociological insights seriously while also interrogating how those insights apply to your specific life, community, and choices.',
    prompts: [
      "What social pattern described here have you participated in without realizing it?",
      "How does your own social position shape your reaction to this analysis?",
      "What would change in your daily life if you took this sociological finding seriously?",
      "Is this describing something universal about human societies, or something specific to this context?",
      "What agency do individuals have within the system being described?",
      "How does this challenge or confirm the way you explain your own success or struggles?",
      "Who in your life would disagree with this analysis — and what's their lived experience?",
      "What social norm described here do you follow without thinking? Would you choose it deliberately?",
      "How does this content deal with the tension between individual choice and structural forces?",
      "What would someone from a completely different background take away from this same content?",
      "Is the author describing what is, or advocating for what should be?",
      "What assumption about human nature underlies this sociological argument?",
    ],
    whyTheseWork:
      'Sociology prompts work by making the abstract personal. Sociological concepts like "social capital" or "institutional racism" are powerful analytical tools, but they become inert if you only understand them in the abstract. These prompts force you to locate yourself within the analysis.\n\nThe best sociological thinking combines structural awareness with personal honesty. That\'s what these prompts cultivate.',
    relatedTopics: ["psychology", "politics", "history"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-articles"],
  },
  {
    slug: "health",
    topic: "Health",
    description:
      "Reflection prompts for health and wellness content. Separate evidence from marketing and figure out what actually applies to your body.",
    intro:
      "Health content is a minefield of confident claims, cherry-picked studies, and personal anecdotes dressed up as universal advice. The wellness industry profits from your confusion — every contradictory claim is another product to sell.\n\nThese prompts help you engage with health content more carefully. They push you to evaluate the evidence, consider your own context, and resist the urge to overhaul your entire life based on one book or podcast episode.",
    prompts: [
      "What's the actual evidence behind this claim — a large study, a small study, or just the author's experience?",
      "Is this advice general enough to apply to most people, or is it specific to a certain population?",
      "What would your doctor say about this — and if you wouldn't ask them, why not?",
      "What is the author selling, directly or indirectly?",
      "How does this contradict other health advice you've received — and how do you decide who's right?",
      "What would the minimum effective change look like, rather than the dramatic overhaul being suggested?",
      "Is this backed by a scientific consensus or a contrarian position?",
      "What would you need to give up or change to follow this advice — and is that realistic for your life?",
      "How long would you need to try this before you could honestly evaluate whether it works?",
      "Is this content making you feel empowered or anxious — and what does that tell you?",
      "What's the difference between what the research says and what the author concludes from it?",
      "If this advice turns out to be wrong, what's the downside of having followed it?",
    ],
    whyTheseWork:
      "Health prompts work by slowing down the adoption cycle. Health content creates urgency — you feel like you need to change immediately. These prompts introduce appropriate caution without dismissing the content entirely.\n\nThe prompt about asking your doctor is a useful reality check. If you wouldn't bring this up with a medical professional, it's worth asking why you're taking it seriously from a book.",
    relatedTopics: ["science", "self-improvement", "psychology"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "creativity",
    topic: "Creativity",
    description:
      "Reflection prompts for content about creativity, art, and the creative process. Move past inspiration and into your own practice.",
    intro:
      "Content about creativity has a paradox at its core: consuming it feels productive but often replaces the creative work itself. You can spend an entire afternoon reading about how great artists work and end the day having created nothing.\n\nThese prompts redirect that energy. They help you take what you've learned about creativity and connect it to your own creative practice — or to honestly examine why you don't have one.",
    prompts: [
      "What part of this creator's process could you actually adopt, starting this week?",
      "What's the difference between this person's creative constraints and yours?",
      "Are you consuming this content as research or as procrastination?",
      "What creative fear does this content address — and do you share it?",
      "What did this person sacrifice for their creative work that you're not willing to sacrifice?",
      "When was the last time you actually made something instead of reading about making things?",
      "What creative rule from this content would you break — and why?",
      "What's the most honest thing you can say about your own creative output right now?",
      "If you could only take one practice from this and apply it for 30 days, which would it be?",
      "What does this person's creative process tell you about discipline vs. inspiration?",
      "What creative work are you avoiding right now, and is this content helping you avoid it?",
      "How is your definition of creativity different from this author's?",
    ],
    whyTheseWork:
      "Creativity prompts work by confronting the consumption-creation imbalance. Reading about creativity is easier than being creative. These prompts acknowledge that tension directly and push you toward action.\n\nThe question about procrastination is the most important one. If you're honest with yourself, much of your creative content consumption is a sophisticated form of avoidance. These prompts make that harder to ignore.",
    relatedTopics: ["self-improvement", "education", "fiction"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-videos"],
  },
  {
    slug: "leadership",
    topic: "Leadership",
    description:
      "Reflection prompts for leadership content. Stop collecting leadership theories and start examining how you actually lead.",
    intro:
      'Leadership content has an oversupply problem. There are thousands of books about leadership, and most of them say similar things in different packaging. The real gap isn\'t in leadership knowledge — it\'s in leadership self-awareness.\n\nThese prompts shift the focus from "what great leaders do" to "what kind of leader you actually are." They help you use leadership content as a mirror rather than a manual.',
    prompts: [
      "When did you last actually lead in the way this content describes — be specific?",
      "What does this author assume about the leader's power and authority that may not match your situation?",
      "What leadership failure of yours does this content illuminate?",
      "If your team described your leadership style, would it match what you just read?",
      "What would it cost you emotionally or socially to lead the way this content suggests?",
      "Which piece of this advice would your direct reports most want you to follow?",
      "Is this leadership style the one you want, or the one your organization rewards?",
      "What's the difference between this leader's context and yours that makes their approach work for them?",
      "What's one leadership habit from this content you could practice in your next meeting?",
      "Who do you lead well, and who do you lead poorly — and does this content explain the gap?",
      "Is this content about leadership or about management? Do you know the difference in practice?",
      "What would change if you stopped reading about leadership and spent that time listening to your team?",
    ],
    whyTheseWork:
      "Leadership prompts work by closing the gap between self-image and reality. Most leaders have a story about who they are as leaders. These prompts test that story against evidence.\n\nThe most productive leadership reflection happens when it's uncomfortable — when you realize the gap between the leader you want to be and the leader you currently are. These prompts create that productive discomfort.",
    relatedTopics: ["business", "psychology", "self-improvement"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "relationships",
    topic: "Relationships",
    description:
      "Reflection prompts for content about relationships, communication, and connection. Turn relationship advice into actual relationship improvement.",
    intro:
      "Relationship content is easy to consume and hard to apply. You read about better communication, active listening, and emotional intelligence, and you feel like you've grown — but your relationships haven't actually changed because you haven't changed your behavior.\n\nThese prompts bridge the gap between understanding relationships in theory and improving your actual relationships. They ask you to think about specific people, specific patterns, and specific moments rather than staying comfortable in the abstract.",
    prompts: [
      "Which specific relationship in your life does this advice apply to most directly?",
      "What pattern in your relationships does this content describe that you've never named before?",
      "What would the other person in your most important relationship say about this advice?",
      "What part of this advice do you resist — and is that resistance protecting you or holding you back?",
      "What conversation have you been avoiding that this content is telling you to have?",
      "How would your closest relationships change if you followed this advice for 30 days?",
      "What relationship behavior of yours does this content explain but not excuse?",
      "Is this advice about fixing problems or preventing them — and which do you need right now?",
      "What do you do in relationships that contradicts what you just read?",
      "Whose relationship advice have you been following unconsciously — a parent, a friend, media?",
      "What's the hardest thing this content asks you to accept about yourself?",
      "If the person you're thinking about right now read this same content, what would they want you to take from it?",
    ],
    whyTheseWork:
      'Relationship prompts work by making the advice personal and specific. "Be a better listener" is useless. "What would change if you listened to your partner the way this book describes" is actionable.\n\nThe prompt about asking what the other person would say is particularly powerful. Relationship content is usually consumed alone, which means you only get your perspective. These prompts force you to consider the other side.',
    relatedTopics: ["psychology", "parenting", "self-improvement"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "spirituality",
    topic: "Spirituality",
    description:
      "Reflection prompts for spiritual and contemplative content. Move past intellectual understanding into genuine inner inquiry.",
    intro:
      'Spiritual content presents a unique reflection challenge: the ideas are often simple to state but profoundly difficult to embody. "Be present." "Let go of attachment." "You are not your thoughts." You can understand these intellectually in minutes, but living them takes years.\n\nThese prompts acknowledge that gap. They don\'t ask you to agree or disagree with spiritual ideas. They ask you to honestly examine your relationship with them — where you connect, where you resist, and where you\'re performing understanding rather than experiencing it.',
    prompts: [
      "What's the difference between understanding this idea and actually experiencing it?",
      "Where in your daily life are you furthest from what this teaching describes?",
      "What spiritual concept from this content do you agree with intellectually but can't live?",
      "Is your interest in this content coming from genuine seeking or from wanting to feel a certain way?",
      "What would you have to let go of to take this teaching seriously?",
      "What part of your identity feels threatened by this spiritual perspective?",
      "When have you experienced — even briefly — what this content is pointing at?",
      "What spiritual bypassing might this content enable — using spirituality to avoid real problems?",
      "How does this spiritual framework handle suffering — does it acknowledge it or explain it away?",
      "What question does this tradition leave you with, rather than answer?",
      "If you stripped away the spiritual language, what's the practical claim being made?",
      "What's the difference between this teaching and wishful thinking?",
    ],
    whyTheseWork:
      "Spiritual prompts work by distinguishing consumption from practice. Spiritual content can easily become another form of entertainment — comforting without transformative. These prompts interrupt that pattern by asking whether you're actually doing the inner work or just reading about it.\n\nThe prompt about spiritual bypassing is especially important. It's possible to use spiritual frameworks to avoid dealing with practical problems, and these prompts guard against that.",
    relatedTopics: ["philosophy", "psychology", "ethics"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "education",
    topic: "Education",
    description:
      "Reflection prompts for content about learning, teaching, and education systems. Think critically about how you learn and how learning works.",
    intro:
      "Content about education and learning is paradoxically underreflected-on. People read about metacognition, spaced repetition, and learning science, and then go back to the same ineffective study habits they've always had. Knowing how learning works doesn't automatically make you a better learner.\n\nThese prompts connect what you learn about learning to your actual practice of learning. They push you to examine your habits, question your assumptions about how you acquire knowledge, and honestly evaluate what's working.",
    prompts: [
      "What's one thing you learned about learning that contradicts how you actually learn?",
      "If this approach to education is better, why weren't you taught this way?",
      "What's the most important thing you learned poorly — and what would it look like to relearn it?",
      "How does this content challenge your belief about your own intelligence or capability?",
      "What learning habit of yours is actually counterproductive based on what you just read?",
      "Who taught you something that stuck — and what did they do differently from what's described here?",
      "What would your ideal learning environment look like based on this content?",
      "Is the author describing how learning works in general or how it works for certain people?",
      "What would you teach differently if you internalized this content?",
      "What's the gap between how you think you learn best and what the evidence actually says?",
      "How does this apply to learning outside of formal education — skills, hobbies, relationships?",
      "What's one learning practice from this content you could start using immediately?",
    ],
    whyTheseWork:
      "Education prompts work by turning learning about learning into a feedback loop. You can't just know about spaced repetition — you have to actually space your own repetitions. These prompts push you from knowledge about learning to changes in how you learn.\n\nThe prompt about the gap between perceived and actual learning effectiveness is particularly powerful. Most people's intuitions about how they learn best are wrong. Confronting that is where real improvement starts.",
    relatedTopics: ["psychology", "creativity", "self-improvement"],
    relatedGuides: [
      "how-to-reflect-on-books",
      "how-to-reflect-on-courses",
      "how-to-reflect-on-videos",
    ],
  },
  {
    slug: "environment",
    topic: "Environment",
    description:
      "Reflection prompts for environmental and climate content. Move past doom or denial and develop your own informed perspective.",
    intro:
      "Environmental content tends to push people toward one of two unhelpful extremes: paralyzing doom or comfortable denial. Neither produces useful thinking. The challenges are real and significant, but most environmental content doesn't help you figure out what you — specifically — should think or do about them.\n\nThese prompts help you process environmental content without getting stuck in despair or dismissal. They push you to think about scale, responsibility, tradeoffs, and what actionable conclusions you can honestly draw.",
    prompts: [
      "What does this content ask you to care about — and do you actually care about it, or do you feel you should?",
      "What tradeoff is this environmental argument asking society to make — and is the author honest about the cost?",
      "What's the scale of the problem described here — and does the proposed solution match that scale?",
      "How much of your concern about this issue comes from evidence vs. emotional presentation?",
      "What would you personally be willing to change about your lifestyle based on this content?",
      "Who bears the cost of the environmental problem described — and who bears the cost of the proposed solution?",
      "What would a fair skeptic's strongest objection to this content be?",
      "Does this content offer actionable steps or just awareness — and is awareness alone useful here?",
      "What's the timeline — is this urgent or long-term, and does the content make that clear?",
      "How does your own economic position shape your reaction to this environmental argument?",
      "What information would you need to verify before sharing this with someone else?",
      "If you took this content seriously, what's the first concrete thing you'd do?",
    ],
    whyTheseWork:
      "Environmental prompts work by introducing proportionality to emotional topics. Climate and environmental content often relies on urgency and fear, which can produce either action or paralysis. These prompts help you develop a proportional response based on your actual understanding of the evidence.\n\nThe prompt about personal willingness is a useful honesty check. Many people express environmental concern while being unwilling to make any personal tradeoffs. Reflection should surface that gap, not hide it.",
    relatedTopics: ["science", "politics", "ethics"],
    relatedGuides: ["how-to-reflect-on-articles", "how-to-reflect-on-videos"],
  },
  {
    slug: "ethics",
    topic: "Ethics",
    description:
      "Reflection prompts for content about morality, ethics, and difficult moral questions. Think through ethical arguments instead of just reacting.",
    intro:
      "Ethics content forces you to confront questions that don't have clean answers. That discomfort is the point — but most people's instinct is to resolve it quickly by picking a side and defending it. Real ethical thinking means sitting with the tension longer than is comfortable.\n\nThese prompts slow down your moral reasoning. They push you to examine why you believe what you believe, consider perspectives you'd rather dismiss, and notice where your moral intuitions conflict with your moral reasoning.",
    prompts: [
      "What's your gut reaction to this ethical argument — and can you defend that reaction logically?",
      "Where do your moral intuitions conflict with the logical argument being made here?",
      "If you accepted this ethical framework, what would you have to stop doing?",
      "What's the strongest moral argument against your current position on this issue?",
      "Is your ethical stance on this consistent with your ethical stances on similar issues?",
      "What personal experience shapes your moral reaction to this content — and might that be a bias?",
      "Who would be harmed if everyone adopted this ethical position?",
      "Does this ethical argument apply universally, or only within a specific cultural context?",
      'What\'s the difference between "this feels wrong" and "this is wrong" — and which are you experiencing?',
      "If you could see the full consequences of this ethical position 100 years from now, would you still hold it?",
      "What moral certainty did people in the past hold that we now find abhorrent — and what might we be wrong about?",
      "What would it take to change your mind on this ethical question?",
    ],
    whyTheseWork:
      "Ethics prompts work by separating moral feeling from moral reasoning. Most people's ethical positions are based on intuition first and rationalization second. These prompts reverse that order — they ask you to examine the intuition before defending it.\n\nThe prompt about moral consistency is particularly challenging. Most people hold contradictory moral positions on related issues. Noticing those contradictions is where ethical growth begins.",
    relatedTopics: ["philosophy", "politics", "spirituality"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-articles"],
  },
  {
    slug: "fiction",
    topic: "Fiction",
    description:
      'Reflection prompts for novels, short stories, and narrative content. Go beyond "I liked it" and understand what fiction does to your thinking.',
    intro:
      'Fiction is the most underreflected-on category of content. People finish a novel, say "that was good" or "that was okay," and move on. But fiction does something unique — it lets you live inside another person\'s experience in a way that nonfiction can\'t. That\'s enormously valuable, but only if you stop to process what the experience meant.\n\nThese prompts help you reflect on narrative content at a deeper level. They push you to think about why the story affected you the way it did, what it revealed about your own assumptions, and what you carry with you after the last page.',
    prompts: [
      "Which character's perspective did you most resist — and what does that resistance tell you?",
      "What moment in this story will you still think about in a month?",
      "What assumption about people did this story challenge or reinforce?",
      "Did this story make you more sympathetic toward anyone you wouldn't normally sympathize with?",
      "What would you have done in the protagonist's situation — and are you being honest?",
      "What did the author leave unsaid that felt more powerful than what was on the page?",
      "How did this story change your understanding of a real situation or person in your life?",
      "What emotion did you feel most strongly — and when in the story did it peak?",
      "If you had to describe this story's central idea in one sentence (not the plot), what would it be?",
      "What detail or image from this story feels like it means more than it appears to?",
      "What made this story feel true or false — regardless of whether it's literally true?",
      "If you reread this in 10 years, what would you understand differently?",
    ],
    whyTheseWork:
      'Fiction prompts work by treating stories as experiences rather than information. Nonfiction reflection asks "what did I learn?" Fiction reflection asks "what did I feel, and what does that feeling mean?"\n\nThe prompt about which character you resisted is especially revealing. Your resistance to fictional characters often mirrors your resistance to real people and real perspectives. Fiction makes that safe to examine.',
    relatedTopics: ["philosophy", "creativity", "relationships"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "parenting",
    topic: "Parenting",
    description:
      "Reflection prompts for parenting content. Cut through the guilt and figure out what actually matters for your family.",
    intro:
      "Parenting content has a guilt problem. Almost every book, podcast, and article implies — subtly or not — that you're doing it wrong. This creates anxious consumption: you read parenting content looking for reassurance, find new things to worry about instead, and repeat the cycle.\n\nThese prompts break that cycle. They help you engage with parenting content without absorbing the guilt. They push you to evaluate whether the advice fits your actual family, your actual child, and your actual life — not the idealized version that parenting content assumes.",
    prompts: [
      "Does this advice account for your specific child, or does it assume all children are the same?",
      "What's the difference between what this content recommends and what your instincts tell you?",
      "What would your child say if they heard this advice — would it match their experience of you?",
      "Is this parenting approach realistic given your actual time, energy, and resources?",
      "What guilt is this content trying to create — and is that guilt useful or manipulative?",
      "Who raised you, and how does their approach compare to what you just read?",
      "What's one thing from this content you could try this week — the smallest possible version?",
      "If this advice is right, what would you need to stop doing (not just start doing)?",
      "Is this content based on research, tradition, or the author's personal experience?",
      'What does "good enough" parenting look like for this specific issue?',
      "What parenting problem are you actually trying to solve, and does this content address it?",
      "If your child turns out great, will it be because of this advice or despite it?",
    ],
    whyTheseWork:
      'Parenting prompts work by introducing permission alongside prescription. Most parenting content tells you what to do without acknowledging the real constraints you operate under. These prompts make space for honesty about what\'s actually possible.\n\nThe "good enough" prompt is intentionally included. Parenting culture pushes optimization, but research consistently shows that good-enough parenting produces good outcomes. These prompts help you find that realistic middle ground.',
    relatedTopics: ["psychology", "relationships", "education"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "stoicism",
    topic: "Stoicism",
    description:
      "Reflection prompts for Stoic philosophy — Marcus Aurelius, Seneca, Epictetus, and modern Stoic thinkers. Questions that move you from reading about Stoicism to practicing it.",
    intro:
      'Stoicism is the most popular philosophy on the internet and the least practiced. People read Meditations, highlight "the obstacle is the way," post it on Instagram, and continue reacting emotionally to every inconvenience. The gap between consuming Stoic content and living Stoically is vast.\n\nThese prompts close that gap. They force you to test Stoic principles against your actual life — your specific frustrations, anxieties, and reactions — rather than admiring them from a distance.',
    prompts: [
      "What happened this week that you reacted to emotionally — and how would a Stoic have responded?",
      "What are you currently worried about that is genuinely outside your control?",
      "Where are you confusing something you prefer with something you need?",
      "What discomfort are you avoiding that might actually be good for you?",
      "If Marcus Aurelius saw how you spent today, what would he note?",
      "What opinion of other people's behavior is causing you unnecessary suffering?",
      "What is the worst realistic outcome of your current biggest worry — and could you survive it?",
      "Where are you choosing comfort over character this week?",
      "What virtue — courage, justice, temperance, wisdom — are you weakest in right now?",
      "If you only had one year left, what would you stop caring about immediately?",
      "What are you doing out of social expectation rather than genuine conviction?",
      "What would 'amor fati' — loving your fate — look like applied to your current biggest frustration?",
    ],
    whyTheseWork:
      "Stoic prompts work by making the philosophy personal and present-tense. Most people engage with Stoicism as a historical curiosity or self-help brand. These prompts strip away the branding and ask you to actually do the thing: examine your reactions, identify what you control, and practice virtue in specific situations.\n\nThe prompts that reference this week or today are intentionally time-bound. Stoicism is a daily practice, not a reading list.",
    relatedTopics: ["philosophy", "psychology", "self-improvement"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "cognitive-biases",
    topic: "Cognitive Biases",
    description:
      "Reflection prompts for content about cognitive biases, logical fallacies, and decision-making errors. Questions that help you catch your own biases instead of just learning their names.",
    intro:
      "Knowing the name of a cognitive bias does not protect you from it. You can recite the definition of confirmation bias while actively seeking information that confirms your existing beliefs. The gap between knowing about biases and catching them in real time is one of the hardest challenges in psychology.\n\nThese prompts help you bridge that gap. Instead of quizzing you on definitions, they ask you to find specific biases operating in your own recent thinking and decisions.",
    prompts: [
      "What decision did you make this week that might have been influenced by a bias you just learned about?",
      "What information are you currently ignoring because it contradicts something you want to be true?",
      "Where are you anchored to a number, expectation, or first impression that might be wrong?",
      "What recent judgment did you make based on how easily an example came to mind rather than actual probability?",
      "Who do you agree with primarily because they are likeable or high-status?",
      "What have you continued doing primarily because you already invested time or money in it?",
      "Where are you confusing what happened with what was likely to happen?",
      "What group do you belong to that might be distorting your perception of outsiders?",
      "What outcome are you taking credit for that might have been luck?",
      "If you had to argue the opposite of your current strongest opinion, what evidence would you use?",
      "What are you overconfident about right now — and how would you know if you were wrong?",
      "What recent choice did you make to avoid loss rather than to pursue gain?",
    ],
    whyTheseWork:
      "Bias prompts work by turning the lens inward. Most cognitive bias content is about other people's mistakes. These prompts force you to find the bias in your own thinking — which is uncomfortable and therefore effective.\n\nThe prompts avoid asking you to define biases and instead ask you to catch them in action. That shift from knowledge to detection is where the real value of understanding biases lives.",
    relatedTopics: ["psychology", "economics", "philosophy"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "decision-making",
    topic: "Decision Making",
    description:
      "Reflection prompts for books and content about decision-making, judgment, and strategic thinking. Questions that improve how you actually decide, not just how you think about deciding.",
    intro:
      "Decision-making content is some of the most consumed and least applied knowledge available. People read about mental models, decision frameworks, and Bayesian thinking, then continue making decisions the same way they always have — by gut feeling dressed up as analysis.\n\nThese prompts help you apply decision-making frameworks to real decisions you are currently facing, rather than treating them as intellectual entertainment.",
    prompts: [
      "What decision are you currently postponing — and is the delay actually gathering useful information or just avoiding discomfort?",
      "What would you decide if you could not reverse this choice? Does that change your answer?",
      "What information would actually change your mind about this decision — and are you seeking it?",
      "What are you optimizing for in this decision — and is that the right thing to optimize for?",
      "If you made this decision 100 times, what would the average outcome look like?",
      "Who has made this exact decision before, and what can you learn from their outcome?",
      "What are the second-order consequences of this choice that you have not considered?",
      "Are you deciding based on the situation as it is, or as you wish it were?",
      "What would you advise a friend to do in this exact situation — and why is your advice different from your action?",
      "What is the cost of being wrong in each direction? Is the downside symmetric?",
      "What decision would you make if you had to decide in the next five minutes?",
      "What default option are you accepting without realizing you have a choice?",
    ],
    whyTheseWork:
      "Decision-making prompts work by connecting frameworks to real stakes. Reading about expected value is abstract. Applying it to whether you should take that job offer is concrete. These prompts force that application.\n\nThe most powerful prompt is often the one about advising a friend — it separates your emotional attachment from your analytical capacity and reveals where fear or attachment is distorting your judgment.",
    relatedTopics: ["psychology", "business", "economics"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "habit-formation",
    topic: "Habit Formation",
    description:
      "Reflection prompts for books about habits, behavior change, and routine design. Questions that help you understand why your habits stick or fail.",
    intro:
      "Habit books sell millions of copies because everyone wants to change their behavior. Most readers finish the book, feel motivated for a week, and return to their old patterns. The problem is not the advice — it is that behavior change requires understanding your specific obstacles, not generic strategies.\n\nThese prompts help you diagnose why your habits succeed or fail by examining your actual environment, triggers, and resistance patterns.",
    prompts: [
      "What habit have you tried to build and failed — and what was the actual reason it failed?",
      "What is the cue that triggers your worst habit? Can you change the cue rather than fighting the behavior?",
      "What habit do you maintain effortlessly — and what makes that one different from the ones you struggle with?",
      "What environment change would make your desired habit easier and your unwanted habit harder?",
      "Are you trying to build this habit because you genuinely want to, or because you think you should?",
      "What is the identity you are trying to build — and does this habit actually serve that identity?",
      "What is the smallest possible version of the habit that would still count?",
      "What happened the last time you broke your streak — and what does that tell you about the real obstacle?",
      "If willpower is unreliable, what system could replace it for this specific habit?",
      "What reward are you getting from your current bad habit that the new habit needs to replace?",
      "Who in your environment supports this habit, and who makes it harder?",
      "What would your daily routine look like six months from now if this habit stuck?",
    ],
    whyTheseWork:
      "Habit prompts work by replacing generic motivation with specific diagnosis. Most habit advice is prescriptive — do this, not that. These prompts are diagnostic — why does this work for you and that does not? The diagnosis is more valuable because it is specific to your life.\n\nThe identity prompt is particularly powerful because it shifts the question from 'what should I do' to 'who am I becoming' — which research shows is a stronger predictor of lasting behavior change.",
    relatedTopics: ["psychology", "self-improvement", "health"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "productivity",
    topic: "Productivity",
    description:
      "Reflection prompts for productivity books, systems, and time management content. Questions that help you distinguish real productivity from productive-feeling busywork.",
    intro:
      "Productivity content is uniquely self-defeating. The more of it you consume, the less productive you become — because reading about productivity is not the same as being productive. Most people use productivity content as a sophisticated form of procrastination.\n\nThese prompts cut through the noise. They help you figure out what actually matters for your specific situation, rather than adopting another system that will be abandoned in three weeks.",
    prompts: [
      "What is the one thing you are avoiding that would make the biggest difference if you did it?",
      "How much of your 'productivity system' is actually about doing work versus organizing work?",
      "If you could only accomplish three things this month, what would they be?",
      "What task are you doing because it feels productive rather than because it matters?",
      "What would happen if you stopped doing half of what's on your to-do list? Would anyone notice?",
      "What is the biggest bottleneck in your work right now — and is it a time problem or a decision problem?",
      "When were you last in a state of deep focus, and what conditions made that possible?",
      "What recurring meeting, commitment, or obligation is no longer worth your time?",
      "Are you optimizing for output volume or output quality — and which one actually matters for your goals?",
      "What would your ideal workday look like if you designed it around energy, not time?",
      "What did you accomplish last week that still matters today? What was just noise?",
      "If your current productivity system disappeared tomorrow, what one habit would you rebuild first?",
    ],
    whyTheseWork:
      "Productivity prompts work by forcing prioritization over optimization. Most productivity content teaches you to do more things faster. These prompts ask whether you should be doing those things at all.\n\nThe prompt about what feels productive versus what matters is the most important one. Productivity culture has confused activity with progress. These prompts help you tell the difference.",
    relatedTopics: ["business", "self-improvement", "leadership"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "mindset",
    topic: "Mindset & Growth",
    description:
      "Reflection prompts for content about growth mindset, resilience, mental models, and personal development frameworks. Questions that test whether you are growing or just reading about growing.",
    intro:
      "Mindset content is the comfort food of personal development. It feels good to read about growth, potential, and transformation. But feeling inspired is not the same as actually changing how you think. Most mindset content creates a temporary emotional high that fades within hours.\n\nThese prompts ground mindset concepts in your actual experience. They ask you to identify where you are genuinely growing and where you are stuck — and what the difference is.",
    prompts: [
      "What specific skill or capability have you genuinely improved in the last six months?",
      "Where are you telling yourself a 'growth mindset' story to avoid admitting something is not working?",
      "What failure from the past year taught you something you could not have learned any other way?",
      "What limiting belief do you hold that might actually be a realistic assessment?",
      "If personal growth is real, what specifically is different about how you think compared to a year ago?",
      "What uncomfortable feedback have you received recently that you dismissed too quickly?",
      "What challenge are you avoiding by consuming more content about challenges?",
      "Where is your comfort zone expanding, and where has it stayed exactly the same?",
      "What would genuine growth look like in the area of your life you are most trying to improve?",
      "What mentor, model, or example makes you feel inadequate — and what specifically can you learn from them?",
      "What is the difference between being patient with your growth and being complacent?",
      "If you could only work on one area of personal development for the next year, which would create the most change?",
    ],
    whyTheseWork:
      "Mindset prompts work by introducing honesty into a category dominated by aspiration. Most growth content asks 'who do you want to become?' These prompts ask 'who are you actually becoming based on your current behavior?' The gap between those two answers is where the real work lives.\n\nThe prompts that challenge growth narratives are intentional. Sometimes what looks like a 'fixed mindset' is actually a realistic assessment, and what looks like 'growth' is actually avoidance.",
    relatedTopics: ["psychology", "self-improvement", "philosophy"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "communication",
    topic: "Communication",
    description:
      "Reflection prompts for books about communication, persuasion, negotiation, and difficult conversations. Questions that improve how you actually talk to people.",
    intro:
      "Communication advice is everywhere, and most of it stays theoretical. You read about active listening, nonviolent communication, or negotiation tactics — then enter your next conversation and do exactly what you always do. The gap between knowing good communication principles and using them under pressure is enormous.\n\nThese prompts help you examine your actual communication patterns, not your idealized version of them.",
    prompts: [
      "What recent conversation went poorly — and what would you say differently if you could redo it?",
      "When did you last truly listen to someone without planning your response while they talked?",
      "What do you avoid saying in important relationships because you fear the reaction?",
      "What communication habit do people close to you wish you would change?",
      "When did you last change your mind because of something someone said — and what made that conversation different?",
      "What assumption about the other person's intentions turned out to be wrong?",
      "Where are you using 'being honest' as cover for being hurtful?",
      "What conversation are you postponing that will only get harder the longer you wait?",
      "How do you typically respond when someone disagrees with you — and is that response effective?",
      "What would your communication look like if you assumed good intent by default?",
      "What is the most important thing you want your closest people to understand about you — and have you actually said it?",
      "Where are you persuading when you should be listening?",
    ],
    whyTheseWork:
      "Communication prompts work by making the abstract personal. Everyone agrees that 'active listening' is important. Few people can identify the last time they actually did it. These prompts force that specificity.\n\nThe most valuable communication reflection happens in the gap between how you think you communicate and how others experience your communication. Several prompts target that gap directly.",
    relatedTopics: ["relationships", "leadership", "psychology"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "financial-literacy",
    topic: "Financial Literacy",
    description:
      "Reflection prompts for books about money, investing, personal finance, and wealth building. Questions that connect financial principles to your actual financial behavior.",
    intro:
      "Financial literacy content has a unique problem: the advice is almost always correct and almost never followed. Spend less than you earn. Invest early. Avoid debt. Everyone knows this. Almost nobody does it consistently.\n\nThe gap is not knowledge — it is behavior. These prompts help you examine your actual relationship with money, not the relationship you think you have.",
    prompts: [
      "What financial decision are you making based on emotion rather than math?",
      "What is your biggest financial fear — and is it based on realistic probability or anxiety?",
      "Where are you spending money to signal something to other people rather than to improve your life?",
      "What financial advice have you been ignoring because following it would require uncomfortable change?",
      "If you looked at your spending from last month, what does it reveal about your actual priorities?",
      "What money mistake have you made more than once — and what would it take to stop?",
      "What is the most important financial concept you learned from this content — and will you actually apply it?",
      "Who shaped your relationship with money, and which of their beliefs do you still carry?",
      "What would 'enough' look like for you — and is your financial behavior aimed at reaching it or exceeding it?",
      "What financial decision would you make differently if you removed the fear of judgment?",
      "Are you investing in your financial education or using financial content as entertainment?",
      "What is the gap between what you earn and what you could earn — and what is actually holding you back?",
    ],
    whyTheseWork:
      "Financial prompts work by exposing the emotional drivers behind financial decisions. Most personal finance content treats money as a math problem. These prompts treat it as a behavior problem — which is what it actually is for most people.\n\nThe prompt about spending revealing priorities is particularly powerful because it bypasses what you say you value and shows what you actually value.",
    relatedTopics: ["self-improvement", "psychology", "economics"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "writing",
    topic: "Writing",
    description:
      "Reflection prompts for books about writing, storytelling, and creative expression. Questions that improve your writing by examining how you actually think about it.",
    intro:
      "Writing advice is paradoxical: the more you read about writing, the harder it becomes to actually write. Every craft book adds another rule, another technique, another thing to worry about. The overthinking replaces the doing.\n\nThese prompts redirect attention from craft theory to craft practice. They ask you to examine your own writing process, habits, and blocks — because understanding why you write the way you do is more useful than another list of rules.",
    prompts: [
      "What is the biggest gap between the writing you admire and the writing you produce?",
      "What are you afraid will happen if you share your writing — and how realistic is that fear?",
      "What writing rule have you internalized that might actually be holding you back?",
      "When were you last surprised by something you wrote — where the writing revealed a thought you did not know you had?",
      "What do you write most naturally about, and what does that reveal about how you think?",
      "Who is the writer you most wish you could write like — and what specifically about their work appeals to you?",
      "What keeps you from writing more — and is it actually time, or is it something else?",
      "What piece of writing advice from this content contradicts your instincts — and which should you trust?",
      "If you could only write for one audience for the rest of your life, who would it be?",
      "What is the most honest thing you have written — and what made that possible?",
      "What would change about your writing if no one would ever read it?",
      "What does your revision process reveal about your insecurities as a writer?",
    ],
    whyTheseWork:
      "Writing prompts work by treating writing as a thinking practice rather than a performance skill. Most writing advice focuses on what the reader experiences. These prompts focus on what the writer experiences — because the quality of the writing depends on the quality of the thinking behind it.\n\nThe prompts about fear and audience are intentionally included because the biggest barrier to good writing is usually not skill but self-consciousness.",
    relatedTopics: ["creativity", "self-improvement", "philosophy"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "entrepreneurship",
    topic: "Entrepreneurship",
    description:
      "Reflection prompts for startup books, founder stories, and entrepreneurship content. Questions that separate useful insight from survivorship bias.",
    intro:
      "Entrepreneurship content is dominated by survivorship bias. You read about the founders who succeeded and extract principles from their stories — ignoring that thousands of founders followed the same principles and failed. Most startup advice is a post-hoc narrative, not a reliable playbook.\n\nThese prompts help you engage with entrepreneurship content critically. They push you to identify what is actually applicable to your situation versus what makes a good story.",
    prompts: [
      "What about this founder's story is genuinely replicable, and what was luck or timing?",
      "What risk is the author romanticizing that would actually be irresponsible in your situation?",
      "What is the survivorship bias in this story — who followed similar paths and failed?",
      "If you started a company tomorrow using this book's advice, what would be the first thing to go wrong?",
      "What problem are you actually trying to solve — and does entrepreneurship solve it better than other paths?",
      "What assumption about your market or product have you not yet tested?",
      "Where are you confusing activity with progress on your business idea?",
      "What would you need to be true about the world for your idea to work — and is it true?",
      "What is the honest answer to 'why hasn't someone already done this?'",
      "If this venture fails, what will you have learned that is valuable regardless?",
      "What advice from this content applies to your stage, and what is meant for a later stage?",
      "Are you building something people want, or something you want people to want?",
    ],
    whyTheseWork:
      "Entrepreneurship prompts work by introducing skepticism into a culture that rewards optimism. Most startup content tells you to believe in your vision. These prompts ask whether your vision is based on evidence or enthusiasm.\n\nThe survivorship bias prompt is the most important. Once you learn to ask 'who did this and failed,' you can never read a founder story the same way again.",
    relatedTopics: ["business", "technology", "leadership"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "mental-health",
    topic: "Mental Health",
    description:
      "Reflection prompts for books and content about mental health, emotional regulation, and psychological well-being. Questions that deepen self-understanding without replacing professional support.",
    intro:
      "Mental health content has exploded in availability. Podcasts, books, Instagram infographics, and TikTok therapists offer frameworks for understanding your own psychology. Some of this content is excellent. Some of it is oversimplified to the point of being harmful.\n\nThese prompts help you engage thoughtfully with mental health content — applying what resonates to your own experience while maintaining healthy skepticism about universal claims.",
    prompts: [
      "What pattern in your own behavior does this content help explain — and does the explanation feel accurate or just convenient?",
      "What emotional reaction did this content trigger — and what does that reaction tell you?",
      "Where might you be using psychological labels to explain away behavior instead of examining it?",
      "What part of this content applies to you specifically, and what is the author generalizing too broadly?",
      "What would it actually look like to apply this insight in your daily life — not in theory, but specifically?",
      "Is this content helping you understand yourself better, or is it making you more anxious about yourself?",
      "What coping mechanism of yours is this content reframing as a problem — and is that reframe accurate?",
      "What has actually helped your mental health in practice, and does this content align with that experience?",
      "Where is this content offering a simple explanation for something that is actually complex?",
      "What boundary between self-help and professional help does this content blur?",
      "What past experience does this content surface that might be worth exploring further — with or without a professional?",
      "If you adopted this framework completely, would it make you more self-aware or more self-focused?",
    ],
    whyTheseWork:
      "Mental health prompts work by encouraging discernment in a category that often encourages identification. Not every framework fits every person. These prompts help you figure out what applies to you specifically, rather than adopting every label or diagnosis that sounds relatable.\n\nSeveral prompts intentionally ask about the difference between self-help and professional support because mental health content can sometimes delay rather than accelerate genuine healing.",
    relatedTopics: ["psychology", "self-improvement", "relationships"],
    relatedGuides: ["how-to-reflect-on-books", "how-to-reflect-on-podcasts"],
  },
  {
    slug: "career",
    topic: "Career Development",
    description:
      "Reflection prompts for career books, professional development content, and work-life design. Questions that help you make intentional career decisions instead of drifting.",
    intro:
      "Career advice is some of the most high-stakes content you consume. Unlike a book about philosophy or history, career content directly influences decisions about how you spend your working life. And yet most people consume career advice with the same passivity as everything else — absorbing tips without connecting them to their actual situation.\n\nThese prompts force that connection. They ask you to evaluate career advice against your specific circumstances, values, and constraints.",
    prompts: [
      "What career advice from this content actually applies to your current stage — and what is for someone in a different position?",
      "If you were completely honest, what do you want from your career that you have not admitted to anyone?",
      "What skill would make the biggest difference in your work right now — and why haven't you developed it?",
      "What are you tolerating in your work life that you would tell a friend to stop tolerating?",
      "Is your current career path the result of intentional choices or accumulated defaults?",
      "What would you do differently if money were not a constraint — and how far is that from what you are doing now?",
      "What professional relationship have you underinvested in that could change your trajectory?",
      "What is the gap between your job title and the work you actually find meaningful?",
      "If you cannot see yourself in this role in five years, what specific step would you take this month to change direction?",
      "What career risk are you avoiding that has a much smaller downside than you think?",
      "What would your ideal Tuesday look like — not vacation, but a regular working day?",
      "Whose career do you admire — and what sacrifices did they make that you are unwilling to make?",
    ],
    whyTheseWork:
      "Career prompts work by grounding abstract ambition in concrete reality. Most career content deals in aspirations. These prompts deal in trade-offs — what are you actually willing to do, give up, or change?\n\nThe ideal Tuesday prompt is particularly effective because it bypasses the fantasy of dream jobs and focuses on what a satisfying daily experience actually looks like. Careers are built in days, not in visions.",
    relatedTopics: ["business", "self-improvement", "leadership"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "focus",
    topic: "Focus & Attention",
    description:
      "Reflection prompts for books about deep work, attention management, digital distraction, and flow states. Questions that help you understand your own attention patterns.",
    intro:
      "Focus is the scarcest resource in modern life, and the content about it is ironic — you consume articles about attention while being distracted by notifications. Most focus advice boils down to 'eliminate distractions and do hard things,' which is correct but unhelpful without understanding your specific attention patterns.\n\nThese prompts help you map your actual relationship with focus: when it works, when it breaks, and what conditions make the difference.",
    prompts: [
      "When were you last in a state of genuine deep focus — and what conditions made it possible?",
      "What is the first thing you reach for when focus gets uncomfortable — and what need is that serving?",
      "What task do you avoid not because it is hard, but because it requires sustained attention you don't want to give?",
      "How long can you actually focus before your attention drifts — and is that longer or shorter than you assume?",
      "What environment change would have the biggest impact on your ability to concentrate?",
      "What is the real cost of your distraction habits — not in theory, but in specific work or goals delayed?",
      "When does multitasking actually work for you, and when does it just feel productive?",
      "What would your ideal focused work session look like — time, place, conditions, duration?",
      "What shallow task are you doing that could be eliminated, delegated, or batched?",
      "If you tracked your attention for a full day, what would the data actually show?",
      "What would you accomplish in the next month if you had two uninterrupted hours every morning?",
      "What is the relationship between your focus quality and your sleep, exercise, and stress?",
    ],
    whyTheseWork:
      "Focus prompts work by replacing generic advice with personal data. You do not need to read another article about deep work. You need to understand your own attention well enough to design for it.\n\nThe prompts that ask about conditions are the most useful because focus is not a character trait — it is an output of environment, energy, and task design. Understanding your personal equation is worth more than any productivity system.",
    relatedTopics: ["productivity", "technology", "self-improvement"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
  {
    slug: "memoir",
    topic: "Memoir & Biography",
    description:
      "Reflection prompts for memoirs, biographies, and autobiographies. Questions that help you extract meaning from someone else's life story without idolizing or dismissing it.",
    intro:
      "Memoirs and biographies are powerful because they offer a full arc — a life examined in hindsight. But that hindsight is the problem. Every memoir has been edited, shaped, and narrativized. The author knows how the story ends, which distorts how they tell the beginning and middle.\n\nThese prompts help you read life stories critically and personally — extracting what is genuinely useful while recognizing the limits of anyone's self-narrative.",
    prompts: [
      "What about this person's story is genuinely transferable to your life, and what is unique to their circumstances?",
      "What is the author leaving out or glossing over that might change your impression?",
      "What privilege, timing, or luck contributed to this person's story that they may not fully acknowledge?",
      "What moment in this memoir reminds you of a specific experience in your own life?",
      "If you wrote your own memoir of the last five years, what would the central theme be?",
      "What decision did this person make that you admire but would not have the courage to make yourself?",
      "What part of this story are you romanticizing rather than learning from?",
      "What does this person's story reveal about the relationship between suffering and growth?",
      "What would this person's critics say about this version of events?",
      "What pattern in this person's life do you recognize in your own — and does recognizing it change anything?",
      "If this person gave you advice based on their experience, what would you want to ask them?",
      "What does this story teach about regret, and does it change how you think about your own choices?",
    ],
    whyTheseWork:
      "Memoir prompts work by treating a life story as material for your own thinking rather than a model to follow. The danger of biography is idolization — absorbing someone else's narrative as a template. These prompts break that pattern by asking what applies to you and what does not.\n\nThe prompt about writing your own memoir is especially powerful. It shifts you from audience to author, which is where the deepest reflection happens.",
    relatedTopics: ["history", "psychology", "philosophy"],
    relatedGuides: ["how-to-reflect-on-books"],
  },
];

export function getPromptTopic(slug: string): PromptTopic | undefined {
  return promptTopics.find((t) => t.slug === slug);
}
