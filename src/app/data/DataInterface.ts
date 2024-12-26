export type Ingredients = {
    name: string;
    quantity: number;
    unit: string
}

export type WeekDay = {
    id: number;
    name: string;
    value: string;
};

export interface Recipe {
    _id?: string; //server side id
    recipeId: number;
    name: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    mealType?: string[];
    ingredients?: Ingredients[];
    steps?: string[];
    ageGroup?: string[];
    nutrition?: {
        calories?: number;
        protein?: number; // in grams
        carbohydrates?: number; // in grams
        fats?: number; // in grams
        sugar?: number; // in grams
    };
    daysOfTheWeek?: WeekDay[],
    imageUrl?: string,
    createdAt?: Date,
}

export interface DailySchedule {
    _id?: string, //server side id
    scheduleId: number,
    weekday: WeekDay,
    breakfast: number[],
    lunch: number[],
    dinner: number[]
}
