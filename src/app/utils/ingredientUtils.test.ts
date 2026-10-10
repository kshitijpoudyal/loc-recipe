import {describe, expect, it} from "vitest";
import {joinAmount, rowsToIngredients, splitAmount} from "./ingredientUtils";

describe("splitAmount", () => {
    it("pulls a leading number into quantity", () => {
        expect(splitAmount("1.5 cups")).toEqual({quantity: 1.5, unit: "cups"});
        expect(splitAmount("2")).toEqual({quantity: 2, unit: ""});
        expect(splitAmount(" 500 g ")).toEqual({quantity: 500, unit: "g"});
    });

    it("keeps fractions and words exactly as typed", () => {
        expect(splitAmount("½ tsp")).toEqual({quantity: 0, unit: "½ tsp"});
        expect(splitAmount("1/2 cup")).toEqual({quantity: 0, unit: "1/2 cup"});
        expect(splitAmount("a pinch")).toEqual({quantity: 0, unit: "a pinch"});
        expect(splitAmount("")).toEqual({quantity: 0, unit: ""});
    });

    it("round-trips through joinAmount", () => {
        for (const text of ["1.5 cups", "2", "½ tsp", "a pinch", "3 large"]) {
            expect(joinAmount(splitAmount(text))).toBe(text);
        }
    });
});

describe("rowsToIngredients", () => {
    it("drops rows with no name and trims", () => {
        expect(rowsToIngredients([
            {qty: "2 cups", name: " flour "},
            {qty: "1", name: ""},
        ])).toEqual([{name: "flour", quantity: 2, unit: "cups"}]);
    });
});
