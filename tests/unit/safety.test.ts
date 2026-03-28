import { describe, it, expect } from "vitest";
import { checkContentSafety } from "@/lib/safety";

describe("Content Safety — Category A (hard block)", () => {
  it("blocks 'kill yourself'", () => {
    const result = checkContentSafety("Just kill yourself already");
    expect(result).toEqual({ safe: false, category: "A" });
  });

  it("blocks 'end your life'", () => {
    const result = checkContentSafety("You should end your life");
    expect(result).toEqual({ safe: false, category: "A" });
  });

  it("blocks 'genocide is justified'", () => {
    const result = checkContentSafety("genocide is justified in some cases");
    expect(result).toEqual({ safe: false, category: "A" });
  });

  it("blocks 'shoot up a school'", () => {
    const result = checkContentSafety("I want to shoot up a school");
    expect(result).toEqual({ safe: false, category: "A" });
  });

  it("blocks 'death to all [group]'", () => {
    const result = checkContentSafety("death to all infidels");
    expect(result).toEqual({ safe: false, category: "A" });
  });

  it("is case insensitive", () => {
    const result = checkContentSafety("KILL YOURSELF");
    expect(result).toEqual({ safe: false, category: "A" });
  });
});

describe("Content Safety — Category B (soft nudge)", () => {
  it("flags 'I will murder you'", () => {
    const result = checkContentSafety("I will murder you for this");
    expect(result).toEqual({ safe: false, category: "B" });
  });

  it("flags 'I hope you die'", () => {
    const result = checkContentSafety("I hope you die");
    expect(result).toEqual({ safe: false, category: "B" });
  });
});

describe("Content Safety — allowed content", () => {
  it("allows profanity without violence", () => {
    const result = checkContentSafety("This book was absolute shit");
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows 'kill' in normal context", () => {
    const result = checkContentSafety("This argument kills the entire premise");
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows 'die' in idioms", () => {
    const result = checkContentSafety("I would die for a coffee right now");
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows frustrated venting", () => {
    const result = checkContentSafety("I hate this so much I could scream");
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows academic discussion of suicide", () => {
    const result = checkContentSafety(
      "The author discusses suicide prevention strategies in chapter 3",
    );
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows academic discussion of genocide", () => {
    const result = checkContentSafety(
      "The documentary examined the Rwanda genocide and its aftermath",
    );
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows discussion of violence in media", () => {
    const result = checkContentSafety(
      "The violence in this film felt gratuitous but served a narrative purpose",
    );
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows empty string", () => {
    const result = checkContentSafety("");
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows normal reflections", () => {
    const result = checkContentSafety(
      "This book completely changed how I think about productivity",
    );
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows abstract death references", () => {
    const result = checkContentSafety(
      "The death of the protagonist was unexpected and moving",
    );
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows 'bomb' outside violence context", () => {
    const result = checkContentSafety("That presentation was the bomb");
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows 'murder' as noun in discussion", () => {
    const result = checkContentSafety(
      "The murder mystery kept me guessing until the end",
    );
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows strong negative emotions", () => {
    const result = checkContentSafety(
      "I am so angry at this author's terrible take on mental health",
    );
    expect(result).toEqual({ safe: true, category: null });
  });

  it("allows 'killing it' as positive slang", () => {
    const result = checkContentSafety(
      "The author is absolutely killing it with this analysis",
    );
    expect(result).toEqual({ safe: true, category: null });
  });
});
