export const PROMPTS_BY_TYPE: Record<string, string[]> = {
  book: [
    "What did this book make you realize you'd been wrong about?",
    "What would you argue against the author if you had five minutes with them?",
    "What's the most uncomfortable idea in this book — the one you almost skipped past?",
    "What did this change about something you've believed for years?",
    "Which idea in this book is dangerous if taken too far?",
    "What does this book reveal about the gap between who you are and who you want to be?",
    "If you could only keep one sentence from this forever, what is it — and why that one?",
    "What would this author say about a problem you're actually facing right now?",
    "What did the author get wrong that most readers won't notice?",
    "What's the question this book should have asked but didn't?",
  ],
  video: [
    "What's the gap between what they showed and what's actually true?",
    "Where do you think the speaker is wrong — and what would you need to believe to disagree with them?",
    "What question does this leave unanswered that you need to answer yourself?",
    "What's the one frame from this that will still be with you in three years?",
    "What did this change about how you'll act this week specifically?",
    "What's the difference between what they said and what they meant?",
    "What did the creator leave out — intentionally or not?",
    "What would someone who disagrees with this video say, and are they right?",
  ],
  article: [
    "What's missing from this argument that the author didn't say?",
    "Where does the logic break down — and does it matter?",
    "What's the claim you most want to challenge, and what's your counterargument?",
    "What does this article get wrong that most people reading it won't notice?",
    "If this article is right, what does that mean for you specifically?",
    "What would you add if you were the author?",
    "What assumption is this entire piece built on — and is that assumption true?",
    "What did this confirm that you already believed, and should you be suspicious of that?",
  ],
  podcast: [
    "What's the one thing from this conversation you'll still think about in a week?",
    "Where did you disagree with the guest — and what would it take to change your mind?",
    "What did the host miss asking that would have made this conversation more honest?",
    "What's the most honest thing said in this episode — the thing that felt real?",
    "What does this conversation reveal about the speaker that they didn't intend to reveal?",
    "Which idea in this episode is interesting but wrong?",
    "What did this guest say that you've heard before but finally believe now?",
    "What's the gap between the advice given and what the speaker actually does?",
  ],
  realization: [
    "What triggered this — and why now, not six months ago?",
    "How does this change something you've believed for a long time?",
    "What will you do differently because of this, starting this week?",
    "What would you have thought about this five years ago?",
    "Who needs to hear this realization, and why haven't you told them yet?",
    "What does this expose about your blind spots?",
    "What's the uncomfortable thing this realization implies about your past decisions?",
    "Is this actually new thinking, or have you thought this before and forgotten it?",
  ],
  workout: [
    "What did your body tell you today that your mind needed to hear?",
    "What were you actually thinking about during this — and what does that reveal?",
    "What did today's effort prove to you about where you are right now?",
    "What were you avoiding thinking about — and why?",
    "What's the connection between how you trained today and how you're living right now?",
    "What did you want to quit, and what made you not quit?",
    "What does your body feel like right now, and what is that telling you?",
  ],
  walk: [
    "What thought arrived during this walk that wouldn't have come at a desk?",
    "What were you actually processing — not what you planned to think about?",
    "What decision feels clearer now, and what shifted?",
    "What did you notice that you would have walked past with headphones in?",
    "What tension did this walk not resolve — and is it supposed to be unresolved?",
    "What surprised you about where your mind went?",
    "What did the change of environment make obvious that wasn't obvious before?",
  ],
  other: [
    "What's the most important thing you want to remember from this — and why that thing?",
    "What did this change about how you see something you thought you already understood?",
    "What uncomfortable truth did this bring up that you'd rather not sit with?",
    "What connection did this create to something else in your life right now?",
    "What would your future self want you to have written down about this moment?",
    "What did this make you feel, and what does that feeling mean?",
    "What's the question this experience is asking you to answer?",
  ],
};

// Fallback flat list for shuffle when contentType is unknown
export const REFLECTION_PROMPTS = Object.values(PROMPTS_BY_TYPE).flat();

/**
 * Get a deterministic prompt for a given session.
 * Same sessionId always returns the same prompt — no flicker on re-render.
 * Different sessions of the same type get different prompts.
 */
export function getPromptForSession(
  contentType: string,
  sessionId: string,
): string {
  const pool = PROMPTS_BY_TYPE[contentType] ?? PROMPTS_BY_TYPE["other"];
  let hash = 0;
  for (let i = 0; i < sessionId.length; i++) {
    hash = (hash * 31 + sessionId.charCodeAt(i)) | 0;
  }
  return pool[Math.abs(hash) % pool.length];
}

/**
 * Get the next prompt in the pool for a given contentType.
 * Used by the shuffle button to cycle within the same type.
 */
export function getNextPrompt(
  contentType: string,
  currentPrompt: string,
): string {
  const pool = PROMPTS_BY_TYPE[contentType] ?? PROMPTS_BY_TYPE["other"];
  const idx = pool.indexOf(currentPrompt);
  return pool[(idx + 1) % pool.length];
}
