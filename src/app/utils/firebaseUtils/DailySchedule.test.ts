import {describe, expect, it, vi} from "vitest";

vi.mock("@/app/config/firebase", () => ({db: {}, userScheduleCol: (uid: string) => `users/${uid}/dailySchedule`}));

import {mapAllRecipesToSchedule} from "./DailySchedule";

describe("mapAllRecipesToSchedule", () => {
    const recipes = [
        {recipeId: "a", name: "Oats"},
        {recipeId: "b", name: "Curry"},
    ];

    it("joins recipe ids to recipes and skips unknown ids", () => {
        const map = mapAllRecipesToSchedule(recipes, [
            {weekday: "monday", breakfast: ["a", "missing"], lunch: [], dinner: ["b"]},
        ]);
        expect(map.monday.breakfast.map(r => r.name)).toEqual(["Oats"]);
        expect(map.monday.dinner.map(r => r.name)).toEqual(["Curry"]);
        expect(map.sunday).toEqual({breakfast: [], lunch: [], dinner: []});
    });

    it("drops duplicate ids within a slot", () => {
        const map = mapAllRecipesToSchedule(recipes, [
            {weekday: "tuesday", breakfast: ["a", "a"], lunch: [], dinner: []},
        ]);
        expect(map.tuesday.breakfast).toHaveLength(1);
    });
});
