export const REFLECTION_PROMPTS = [
  "What's your core takeaway from this?",
  "How has this changed your perspective on the topic?",
  "Which 20% of this content will provide 80% of the value for you?",
  "How can you apply one specific insight from this in the next 24 hours?",
  "What did you disagree with, and why?",
  "How does this relate to something else you've learned recently?",
  "What's the most high-leverage question this content leaves you with?",
  "If you had to teach this to someone else in 30 seconds, what would you say?",
  "What action will you take today as a direct result of this?",
  "What mental model does this best illustrate or challenge?",
  "\u201CHow does this confirm or challenge what you already know?\u201D",
  "\u201CWhat\u2019s the one thing from this you want to remember in 6 months?\u201D",
  "\u201CIf you had to explain this (simply) to a 10-year-old, what would you say?\u201D"
];

export function getRandomPrompt() {
  return REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
}
