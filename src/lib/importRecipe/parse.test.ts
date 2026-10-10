import {describe, expect, it} from "vitest";
import {
    extractImageUrl,
    extractSteps,
    findRecipeJsonLd,
    mapJsonLd,
    parseDuration,
    parseIngredient,
    parseMicrodata,
    sanitizeJson,
} from "./parse";

describe("parseDuration", () => {
    it("reads ISO 8601 hours and minutes", () => {
        expect(parseDuration("PT1H30M")).toBe(90);
        expect(parseDuration("PT45M")).toBe(45);
        expect(parseDuration("PT2H")).toBe(120);
    });
    it("returns undefined for empty or zero durations", () => {
        expect(parseDuration(undefined)).toBeUndefined();
        expect(parseDuration("PT0M")).toBeUndefined();
    });
});

describe("parseIngredient", () => {
    it("splits a leading amount from the name", () => {
        expect(parseIngredient("2 cups flour")).toEqual({qty: "2 cups", name: "flour"});
        expect(parseIngredient("½ tsp salt")).toEqual({qty: "½ tsp", name: "salt"});
    });
    it("keeps lines without an amount as the name", () => {
        expect(parseIngredient("Salt to taste")).toEqual({qty: "", name: "Salt to taste"});
    });
});

describe("sanitizeJson", () => {
    it("escapes raw newlines inside strings so JSON.parse succeeds", () => {
        const raw = '{"name": "Line one\nline two"}';
        expect(JSON.parse(sanitizeJson(raw))).toEqual({name: "Line one\nline two"});
    });
});

describe("extractSteps", () => {
    it("flattens HowToStep and HowToSection", () => {
        const steps = extractSteps([
            {"@type": "HowToStep", text: "Chop"},
            {"@type": "HowToSection", itemListElement: [{"@type": "HowToStep", text: "Fry"}]},
            "Serve",
        ]);
        expect(steps).toEqual(["Chop", "Fry", "Serve"]);
    });
});

describe("extractImageUrl", () => {
    it("handles string, array and ImageObject forms", () => {
        expect(extractImageUrl("https://a/1.jpg")).toBe("https://a/1.jpg");
        expect(extractImageUrl(["https://a/2.jpg"])).toBe("https://a/2.jpg");
        expect(extractImageUrl({url: "https://a/3.jpg"})).toBe("https://a/3.jpg");
    });
});

const jsonLdPage = `<html><head>
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[
  {"@type":"WebPage","name":"ignore me"},
  {"@type":"Recipe","name":"Thai BBQ Chicken","prepTime":"PT15M","cookTime":"PT1H",
   "recipeYield":["4 servings"],"recipeCategory":["Dinner","Main"],
   "recipeIngredient":["500 g chicken thighs","2 tbsp fish sauce"],
   "recipeInstructions":[{"@type":"HowToStep","text":"Marinate."},{"@type":"HowToStep","text":"Grill."}],
   "nutrition":{"calories":"420 kcal","proteinContent":"38 g"},
   "image":{"@type":"ImageObject","url":"https://example.com/chicken.jpg"}}
]}</script></head><body></body></html>`;

describe("JSON-LD import", () => {
    it("finds the Recipe inside @graph and maps it", () => {
        const ld = findRecipeJsonLd(jsonLdPage);
        expect(ld).not.toBeNull();
        const recipe = mapJsonLd(ld!);
        expect(recipe).toMatchObject({
            name: "Thai BBQ Chicken",
            prepTime: 15,
            cookTime: 60,
            servings: 4,
            mealType: ["dinner"],
            steps: ["Marinate.", "Grill."],
            imageUrl: "https://example.com/chicken.jpg",
        });
        expect(recipe.ingredients[0]).toEqual({qty: "500 g", name: "chicken thighs"});
        expect(recipe.nutrition.calories).toBe(420);
        expect(recipe.nutrition.protein).toBe(38);
    });

    it("returns null when the page has no recipe", () => {
        expect(findRecipeJsonLd('<script type="application/ld+json">{"@type":"Article"}</script>')).toBeNull();
    });
});

describe("microdata import", () => {
    it("reads itemprop fields", () => {
        const html = `<div itemscope itemtype="https://schema.org/Recipe">
            <h1 itemprop="name">Banana Bread</h1>
            <meta itemprop="prepTime" content="PT15M">
            <meta itemprop="recipeYield" content="8">
            <dl><dt>3</dt><dd itemprop='ingredients'>bananas</dd></dl>
            <div itemprop="recipeInstructions"><ol><li>Mash.</li><li>Bake.</li></ol></div>
        </div>`;
        const recipe = parseMicrodata(html);
        expect(recipe).toMatchObject({
            name: "Banana Bread",
            prepTime: 15,
            servings: 8,
            ingredients: [{qty: "3", name: "bananas"}],
            steps: ["Mash.", "Bake."],
        });
    });
});
