import {describe, expect, it} from "vitest";
import {isOptimizableImage} from "./imageUtils";

describe("isOptimizableImage", () => {
    it("serves Firebase Storage photos directly", () => {
        expect(isOptimizableImage("https://firebasestorage.googleapis.com/v0/b/x/o/recipe%2Fa.jpg?alt=media&token=t")).toBe(false);
    });

    it("optimizes allow-listed hosts and local paths", () => {
        expect(isOptimizableImage("https://lh3.googleusercontent.com/abc")).toBe(true);
        expect(isOptimizableImage("/lochu_s_cafe.png")).toBe(true);
    });

    it("rejects other hosts, http and empty values", () => {
        expect(isOptimizableImage("https://example.com/a.jpg")).toBe(false);
        expect(isOptimizableImage("http://lh3.googleusercontent.com/abc")).toBe(false);
        expect(isOptimizableImage(undefined)).toBe(false);
    });
});
