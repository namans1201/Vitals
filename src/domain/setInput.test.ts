import { describe, expect, it } from "vitest";
import { clampWholeNumber, sanitizeWholeNumberInput } from "./setInput";

describe("sanitizeWholeNumberInput", () => {
  it("passes plain digits through unchanged", () => {
    expect(sanitizeWholeNumberInput("12")).toBe("12");
  });

  it("strips a leading minus sign", () => {
    expect(sanitizeWholeNumberInput("-5")).toBe("5");
  });

  it("strips a decimal point", () => {
    expect(sanitizeWholeNumberInput("1.5")).toBe("15");
  });

  it("strips scientific-notation characters", () => {
    expect(sanitizeWholeNumberInput("1e5")).toBe("15");
  });

  it("leaves an empty string empty", () => {
    expect(sanitizeWholeNumberInput("")).toBe("");
  });
});

describe("clampWholeNumber", () => {
  it("leaves an empty string empty rather than treating it as zero", () => {
    expect(clampWholeNumber("", 1)).toBe("");
  });

  it("bumps a value below the minimum up to it", () => {
    expect(clampWholeNumber("0", 1)).toBe("1");
  });

  it("leaves a value at or above the minimum unchanged", () => {
    expect(clampWholeNumber("1", 1)).toBe("1");
    expect(clampWholeNumber("12", 1)).toBe("12");
  });

  it("allows zero when the minimum is zero (RIR: 0 = went to failure)", () => {
    expect(clampWholeNumber("0", 0)).toBe("0");
  });

  it("falls back to empty for anything that doesn't parse as a number", () => {
    expect(clampWholeNumber("abc", 1)).toBe("");
  });
});
