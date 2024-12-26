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
    recipeId?: string; //autogenerate server side id
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
    scheduleId: string, //autogenerate server side id
    weekday: WeekDay,
    breakfast: string[],
    lunch: string[],
    dinner: string[]
}
