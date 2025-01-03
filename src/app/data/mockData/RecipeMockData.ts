import {Recipe} from "@/app/data/DataInterface";
import {addRecipeToFirebase} from "@/app/utils/firebaseUtils/Recipe";

const mockRecipe: Recipe[] = [
    {
        name: "Banana Bread",
        prepTime: 15,
        cookTime: 30,
        servings: 4,
        mealType: ["breakfast"],
        ingredients: [
            {name: "banana", quantity: 3, unit: "count"},
            {name: "sugar", quantity: 1, unit: "cup"},
            {name: "eggs", quantity: 0.5, unit: "cup"},
            {name: "ghee/butter", quantity: 0.5, unit: "cup"},
            {name: "vinegar/lime", quantity: 1, unit: "tbsp"},
            {name: "olive oil", quantity: 1, unit: "tbsp"},
            {name: "vanilla", quantity: 1, unit: "tbsp"},
            {name: "milk", quantity: 1, unit: "cup"},
            {name: "flour", quantity: 1.5, unit: "cup"},
            {name: "cinnamon", quantity: 1, unit: "tbsp"},
            {name: "salt", quantity: 1, unit: "pinch"},
            {name: "baking powder", quantity: 1, unit: "tbsp"},
            {name: "baking soda", quantity: 0.75, unit: "tbsp"},
        ],
        steps: [
            "Preheat the oven to 350°F (175°C).",
            "Mash the bananas until smooth.",
            "In a bowl, mix together the wet ingredients: banana, eggs, ghee/butter, vinegar/lime, olive oil, vanilla, and milk.",
            "In another bowl, mix together the dry ingredients: flour, cinnamon, salt, baking powder, and baking soda.",
            "Combine the wet and dry mixtures and stir until just combined.",
            "Pour the batter into a greased loaf pan.",
            "Bake for 1 hour and 15 minutes or until a toothpick comes out clean.",
            "Let the banana bread cool before slicing and serving."
        ],
        ageGroup: ["adult", "kids"],
        createdAt: new Date(),
        nutrition: {
            calories: 150,       // Updated calories per serving
            protein: 3,          // Updated protein per serving (grams)
            carbohydrates: 30,   // Updated carbohydrates per serving (grams)
            fats: 7              // Updated fats per serving (grams)
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fbanana_bread.webp?alt=media&token=c34a5d85-3994-40cf-9d23-38b8aa45cb56",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        name: "Mac & Cheese",
        prepTime: 2,
        cookTime: 15,
        servings: 2,
        mealType: ["breakfast", "lunch"],
        ingredients: [
            {name: "macaroni", quantity: 1, unit: "cup"},
            {name: "water", quantity: 2, unit: "cup"},
            {name: "milk", quantity: 1, unit: "cup"},
            {name: "cheese", quantity: 1, unit: "cup"},
            {name: "basil", quantity: 1, unit: "tsp"},
            {name: "oregano", quantity: 1, unit: "tsp"},
            {name: "garlic salt", quantity: 0.5, unit: "tsp"},
        ],
        steps: [
            "Boil water in a large pot, then add macaroni.",
            "While the pasta is cooking, heat the milk in a saucepan over medium heat.",
            "Add cheese to the warm milk, stirring constantly until melted and smooth.",
            "Add the cooked macaroni to the cheese sauce, stirring to combine.",
            "Season with basil, oregano, and garlic salt to taste.",
            "Stir well and cook for another 2-3 minutes until everything is heated through.",
            "Serve hot and enjoy!"
        ],
        ageGroup: ["adult", "kids"],
        createdAt: new Date(),
        nutrition: {
            calories: 220,        // Updated calories per serving
            protein: 8,           // Updated protein per serving (grams)
            carbohydrates: 30,    // Updated carbohydrates per serving (grams)
            fats: 10              // Updated fats per serving (grams)
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fmac_and_cheese.webp?alt=media&token=541598b0-8368-4e54-8be6-07ce64f9d8d7",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1003",
        name: "Chicken Curry",
        prepTime: 20,
        cookTime: 40,
        servings: 6,
        mealType: ["lunch", "dinner"],
        ingredients: [
            {name: "chicken", quantity: 500, unit: "grams"},
            {name: "onion", quantity: 1, unit: "large"},
            {name: "garlic", quantity: 3, unit: "cloves"},
            {name: "ginger", quantity: 1, unit: "inch"},
            {name: "tomatoes", quantity: 2, unit: "pieces"},
            {name: "yogurt", quantity: 100, unit: "grams"},
            {name: "curry powder", quantity: 2, unit: "tbsp"},
            {name: "coconut milk", quantity: 200, unit: "ml"},
        ],
        steps: [
            "Heat oil in a large pan and sauté onions, garlic, and ginger until fragrant.",
            "Add the chicken pieces and cook until browned.",
            "Add tomatoes, curry powder, and cook for 5 minutes.",
            "Pour in the coconut milk and yogurt, and simmer for 20 minutes.",
            "Serve with rice or bread.",
        ],
        ageGroup: ["adult", "kids"],
        createdAt: new Date,
        nutrition: {
            calories: 250,
            protein: 30,
            carbohydrates: 10,
            fats: 15
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fchicken_curry.webp?alt=media&token=87a6d7fe-d860-4da7-9392-65381d89fa56",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1004",
        name: "Vegetable Stir Fry",
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        mealType: ["lunch", "dinner"],
        ingredients: [
            {name: "carrot", quantity: 2, unit: "pieces"},
            {name: "broccoli", quantity: 1, unit: "head"},
            {name: "bell pepper", quantity: 1, unit: "pieces"},
            {name: "soy sauce", quantity: 3, unit: "tbsp"},
            {name: "garlic", quantity: 2, unit: "cloves"},
            {name: "sesame oil", quantity: 1, unit: "tbsp"},
            {name: "tofu", quantity: 200, unit: "grams"},
        ],
        steps: [
            "Chop all the vegetables into small pieces.",
            "Heat sesame oil in a pan, add garlic and sauté until fragrant.",
            "Add the tofu and cook until golden.",
            "Add vegetables and stir-fry for 5-7 minutes.",
            "Pour in soy sauce and stir well.",
            "Serve hot with rice or noodles.",
        ],
        ageGroup: ["adult", "kids"],
        createdAt: new Date,
        nutrition: {
            calories: 180,
            protein: 12,
            carbohydrates: 15,
            fats: 8
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fvegetable_stir_fry.webp?alt=media&token=80d302f6-4a4d-4b32-8cd8-8e434085875c",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1005",
        name: "Spaghetti Aglio e Olio",
        prepTime: 10,
        cookTime: 15,
        servings: 2,
        mealType: ["lunch", "dinner"],
        ingredients: [
            {name: "spaghetti", quantity: 200, unit: "grams"},
            {name: "garlic", quantity: 4, unit: "cloves"},
            {name: "red pepper flakes", quantity: 1, unit: "tsp"},
            {name: "olive oil", quantity: 3, unit: "tbsp"},
            {name: "parsley", quantity: 2, unit: "tbsp"},
            {name: "parmesan cheese", quantity: 50, unit: "grams"},
        ],
        steps: [
            "Cook the spaghetti according to package instructions.",
            "In a pan, heat olive oil and sauté garlic until golden.",
            "Add red pepper flakes and cook for 1 minute.",
            "Drain the pasta and add it to the pan with garlic oil.",
            "Toss with parsley and grated parmesan cheese.",
            "Serve immediately.",
        ],
        ageGroup: ["adult"],
        createdAt: new Date,
        nutrition: {
            calories: 300,
            protein: 8,
            carbohydrates: 45,
            fats: 10
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fspaghetti_aglio_e_olio.webp?alt=media&token=bf3ac16c-4244-4e5b-8501-b200e9a7c7ea",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1006",
        name: "Chocolate Chip Cookies",
        prepTime: 15,
        cookTime: 10,
        servings: 12,
        mealType: ["snacks"],
        ingredients: [
            {name: "flour", quantity: 250, unit: "grams"},
            {name: "butter", quantity: 100, unit: "grams"},
            {name: "sugar", quantity: 150, unit: "grams"},
            {name: "chocolate chips", quantity: 100, unit: "grams"},
            {name: "eggs", quantity: 1, unit: "pieces"},
            {name: "baking soda", quantity: 1, unit: "tsp"},
        ],
        steps: [
            "Preheat the oven to 180°C (350°F).",
            "Cream butter and sugar together in a bowl.",
            "Add the egg and mix well.",
            "Stir in flour and baking soda.",
            "Fold in chocolate chips.",
            "Scoop dough onto a baking sheet and bake for 10-12 minutes.",
        ],
        ageGroup: ["kids", "adult"],
        createdAt: new Date,
        nutrition: {
            calories: 200,
            protein: 3,
            carbohydrates: 25,
            fats: 10
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fchocolate_chips_cookie.jpeg?alt=media&token=b9f3f53d-37e0-433e-bf41-3227765accd3",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1007",
        name: "Caesar Salad",
        prepTime: 15,
        cookTime: 0,
        servings: 2,
        mealType: ["lunch", "dinner"],
        ingredients: [
            {name: "romaine lettuce", quantity: 1, unit: "head"},
            {name: "croutons", quantity: 50, unit: "grams"},
            {name: "parmesan cheese", quantity: 30, unit: "grams"},
            {name: "Caesar dressing", quantity: 60, unit: "ml"},
        ],
        steps: [
            "Wash and chop the lettuce.",
            "Toss the lettuce with Caesar dressing.",
            "Add croutons and sprinkle parmesan cheese on top.",
            "Serve immediately.",
        ],
        ageGroup: ["adult"],
        createdAt: new Date,
        nutrition: {
            calories: 200,
            protein: 6,
            carbohydrates: 15,
            fats: 12,
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fcaesar_salad.webp?alt=media&token=26f96a84-c132-4caf-88ca-7ab27c3efff2"
    },
    {
        recipeId: "1008",
        name: "Grilled Cheese Sandwich",
        prepTime: 5,
        cookTime: 10,
        servings: 1,
        mealType: ["breakfast", "lunch"],
        ingredients: [
            {name: "bread slices", quantity: 2, unit: "pieces"},
            {name: "cheese slices", quantity: 2, unit: "pieces"},
            {name: "butter", quantity: 10, unit: "grams"},
        ],
        steps: [
            "Spread butter on one side of each bread slice.",
            "Place cheese between the unbuttered sides of the bread.",
            "Heat a pan and grill the sandwich until golden on both sides.",
            "Serve hot.",
        ],
        ageGroup: ["kids", "adult"],
        createdAt: new Date,
        nutrition: {
            calories: 300,
            protein: 10,
            carbohydrates: 25,
            fats: 15,
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fgrilled_cheese.jpeg?alt=media&token=d01a1138-5869-4b86-990b-951a428942ae",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1009",
        name: "Tomato Soup",
        prepTime: 10,
        cookTime: 20,
        servings: 3,
        mealType: ["lunch", "dinner"],
        ingredients: [
            {name: "tomatoes", quantity: 500, unit: "grams"},
            {name: "onion", quantity: 1, unit: "medium"},
            {name: "garlic", quantity: 2, unit: "cloves"},
            {name: "vegetable stock", quantity: 500, unit: "ml"},
            {name: "olive oil", quantity: 1, unit: "tbsp"},
        ],
        steps: [
            "Heat olive oil in a pan and sauté onions and garlic until fragrant.",
            "Add chopped tomatoes and cook for 10 minutes.",
            "Pour in the vegetable stock and simmer for another 10 minutes.",
            "Blend the soup until smooth and serve hot.",
        ],
        ageGroup: ["adult", "kids"],
        createdAt: new Date,
        nutrition: {
            calories: 120,
            protein: 3,
            carbohydrates: 15,
            fats: 4,
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Ftomato_soup.jpeg?alt=media&token=c832aed8-894a-4ade-ad04-65e6559570c0",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1010",
        name: "Scrambled Eggs",
        prepTime: 5,
        cookTime: 5,
        servings: 1,
        mealType: ["breakfast"],
        ingredients: [
            {name: "eggs", quantity: 2, unit: "pieces"},
            {name: "milk", quantity: 30, unit: "ml"},
            {name: "butter", quantity: 10, unit: "grams"},
            {name: "salt", quantity: 1, unit: "pinch"},
        ],
        steps: [
            "Whisk eggs, milk, and salt in a bowl.",
            "Melt butter in a pan over medium heat.",
            "Pour the egg mixture into the pan and stir gently until cooked.",
            "Serve immediately.",
        ],
        ageGroup: ["adult", "kids"],
        createdAt: new Date(),
        nutrition: {
            calories: 180,
            protein: 12,
            carbohydrates: 2,
            fats: 14,
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fscrambled_egg.jpeg?alt=media&token=480a6494-79cd-49dc-94c3-5f5695825b28",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1011",
        name: "Veggie Wrap",
        prepTime: 10,
        cookTime: 0,
        servings: 1,
        mealType: ["lunch"],
        ingredients: [
            {name: "tortilla", quantity: 1, unit: "piece"},
            {name: "hummus", quantity: 50, unit: "grams"},
            {name: "carrot", quantity: 1, unit: "piece"},
            {name: "lettuce", quantity: 2, unit: "leaves"},
            {name: "bell pepper", quantity: 1, unit: "small"},
        ],
        steps: [
            "Spread hummus on the tortilla.",
            "Add thinly sliced carrot, bell pepper, and lettuce leaves.",
            "Roll the tortilla tightly and serve immediately.",
        ],
        ageGroup: ["adult", "kids"],
        createdAt: new Date,
        nutrition: {
            calories: 220,
            protein: 6,
            carbohydrates: 30,
            fats: 8,
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Fveggie_wrap.jpeg?alt=media&token=cbf13c0d-7657-42b1-9921-08720541a6f9",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
    {
        recipeId: "1012",
        name: "Fruit Salad",
        prepTime: 10,
        cookTime: 0,
        servings: 2,
        mealType: ["breakfast"],
        ingredients: [
            {name: "apple", quantity: 1, unit: "medium"},
            {name: "banana", quantity: 1, unit: "medium"},
            {name: "grapes", quantity: 100, unit: "grams"},
            {name: "orange", quantity: 1, unit: "medium"},
            {name: "honey", quantity: 1, unit: "tbsp"},
        ],
        steps: [
            "Chop all fruits into small pieces.",
            "Mix the fruits in a large bowl.",
            "Drizzle honey on top and toss gently.",
            "Serve chilled.",
        ],
        ageGroup: ["adult", "kids"],
        createdAt: new Date,
        nutrition: {
            calories: 150,
            protein: 2,
            carbohydrates: 35,
            fats: 1,
        },
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/loc-recipe.firebasestorage.app/o/recipe%2Ffruit_salad.jpeg?alt=media&token=1546d00c-f4ae-40e6-94f7-ace3964afb88",
        createdBy: "lFUQ3s8NTdbOnjlwJ2P7RYMmTyE3"
    },
];


// Function to save recipes to Firebase
export const addMockRecipesToFirebase = async () => {
    try {
        // Loop through mockRecipe array and save each recipe to Firestore
        for (const recipe of mockRecipe) {
            await addRecipeToFirebase(recipe)
        }
        console.log('Mock recipes saved successfully!');
    } catch (error) {
        console.error('Error saving recipes to Firebase:', error);
    }
};
