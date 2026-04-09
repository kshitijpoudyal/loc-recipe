import {NextResponse} from 'next/server';

function parseDuration(iso?: string): number | undefined {
    if (!iso) return undefined;
    const h = Number(iso.match(/(\d+)H/)?.[1] ?? 0);
    const m = Number(iso.match(/(\d+)M/)?.[1] ?? 0);
    const total = h * 60 + m;
    return total > 0 ? total : undefined;
}

function parseNumber(val?: unknown): number | undefined {
    if (val == null) return undefined;
    const n = parseFloat(String(val).replace(/[^\d.]/g, ''));
    return isNaN(n) ? undefined : n;
}

function parseIngredient(str: string): {qty: string; name: string} {
    const match = str.match(/^([\d\s./½¼¾⅓⅔⅛]+(?:\s+[a-zA-Z]+)?)\s+(.+)$/);
    if (match) return {qty: match[1].trim(), name: match[2].trim()};
    return {qty: '', name: str.trim()};
}

function extractSteps(instructions: unknown): string[] {
    if (!instructions) return [];
    if (typeof instructions === 'string') return instructions ? [instructions] : [];
    if (Array.isArray(instructions)) {
        return instructions.flatMap((item): string[] => {
            if (typeof item === 'string') return item ? [item] : [];
            const obj = item as Record<string, unknown>;
            if (obj['@type'] === 'HowToStep') return [String(obj.text ?? obj.name ?? '')].filter(Boolean);
            if (obj['@type'] === 'HowToSection') return extractSteps(obj.itemListElement);
            return [];
        });
    }
    return [];
}

function extractImageUrl(image: unknown): string | undefined {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (Array.isArray(image)) {
        const first = image[0];
        if (typeof first === 'string') return first;
        if (first && typeof first === 'object') return (first as Record<string, string>).url;
    }
    if (typeof image === 'object') return (image as Record<string, string>).url;
    return undefined;
}

function findRecipeJsonLd(html: string): Record<string, unknown> | null {
    const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
        try {
            const data = JSON.parse(match[1]) as Record<string, unknown>;
            const isRecipe = (t: unknown) =>
                t === 'Recipe' || (Array.isArray(t) && t.includes('Recipe'));

            if (isRecipe(data['@type'])) return data;

            if (Array.isArray(data['@graph'])) {
                const recipe = (data['@graph'] as Record<string, unknown>[]).find(item => isRecipe(item['@type']));
                if (recipe) return recipe;
            }
        } catch { /* skip invalid JSON */ }
    }
    return null;
}

export async function POST(req: Request) {
    try {
        const {url} = await req.json() as {url?: string};
        if (!url) return NextResponse.json({error: 'URL is required'}, {status: 400});

        const html = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; RecipeImporter/1.0)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            signal: AbortSignal.timeout(10000),
        }).then(r => r.text());

        const ld = findRecipeJsonLd(html);
        if (!ld) return NextResponse.json({error: 'No recipe found at this URL'}, {status: 422});

        const nutrition = ld.nutrition as Record<string, unknown> | undefined;
        const rawCategory = ld.recipeCategory;
        const categories = (Array.isArray(rawCategory) ? rawCategory : [rawCategory])
            .map(c => String(c ?? '').toLowerCase())
            .filter(c => ['breakfast', 'lunch', 'dinner'].includes(c));

        const recipe = {
            name: String(ld.name ?? ''),
            prepTime: parseDuration(ld.prepTime as string),
            cookTime: parseDuration(ld.cookTime as string),
            servings: parseNumber(Array.isArray(ld.recipeYield) ? (ld.recipeYield as unknown[])[0] : ld.recipeYield),
            mealType: categories,
            ingredients: Array.isArray(ld.recipeIngredient)
                ? (ld.recipeIngredient as string[]).map(parseIngredient)
                : [],
            steps: extractSteps(ld.recipeInstructions),
            nutrition: {
                calories: parseNumber(nutrition?.calories) ?? 0,
                protein: parseNumber(nutrition?.proteinContent) ?? 0,
                carbohydrates: parseNumber(nutrition?.carbohydrateContent) ?? 0,
                fats: parseNumber(nutrition?.fatContent) ?? 0,
            },
            imageUrl: extractImageUrl(ld.image),
        };

        return NextResponse.json(recipe);
    } catch (e) {
        console.error('Import error:', e);
        return NextResponse.json({error: 'Failed to fetch recipe'}, {status: 500});
    }
}
