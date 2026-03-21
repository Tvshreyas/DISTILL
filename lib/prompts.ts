export const REFLECTION_PROMPTS = [
  "What is the core insight that survives every dismissal?",
  "How does this make your past self look wrong?",
  "What is the most high-leverage question this leaves you with?",
  "If you could only keep one sentence from this, what would it be?",
  "What did you disagree with most, and why?",
  "How does this connect to something completely unrelated in your library?",
  "What action will you take today as a direct result of this?",
  "What mental model does this best illustrate—or shatter?",
  "If you had to teach this to someone smarter than you, what would you say?",
  "What's the one thing from this you want to remember in 5 years?",
  "How does this confirm or challenge your fundamental assumptions?",
  "What's the 20% of this that will provide 80% of your future value?",
  "If you were the author, what would you have added to make this better?",
  "Strip away the jargon. What is the naked truth here?",
  "How would you explain the core of this to a 5-year-old?",
  "What if the opposite of the author's argument was true?",
  "What's the one thing in this you should ignore forever?"
];

export function getRandomPrompt() {
  return REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
}
