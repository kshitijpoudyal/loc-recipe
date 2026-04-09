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

function stripTags(html: string): string {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseIngredient(str: string): {qty: string; name: string} {
    const match = str.match(/^([\d\s./½¼¾⅓⅔⅛]+(?:\s+[a-zA-Z]+)?)\s+(.+)$/);
    if (match) return {qty: match[1].trim(), name: match[2].trim()};
    return {qty: '', name: str.trim()};
}

// ── JSON-LD helpers ──────────────────────────────────────────────────────────

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

function mapJsonLd(ld: Record<string, unknown>) {
    const nutrition = ld.nutrition as Record<string, unknown> | undefined;
    const rawCategory = ld.recipeCategory;
    const categories = (Array.isArray(rawCategory) ? rawCategory : [rawCategory])
        .map(c => String(c ?? '').toLowerCase())
        .filter(c => ['breakfast', 'lunch', 'dinner'].includes(c));

    return {
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
}

// ── Microdata fallback (itemprop="...") ──────────────────────────────────────

function parseMicrodata(html: string): ReturnType<typeof mapJsonLd> | null {
    if (!/<[^>]+itemtype=["'][^"']*schema\.org\/Recipe["']/i.test(html)) return null;

    // Name — prefer h1/h2 with itemprop="name"
    const name = stripTags(
        html.match(/itemprop=["']name["'][^>]*>([\s\S]*?)<\//i)?.[1] ?? ''
    );
    if (!name) return null;

    // Durations — look for content="PT..." attribute
    const prepTime = parseDuration(
        html.match(/itemprop=["']prepTime["'][^>]*content=["']([^"']+)["']/i)?.[1]
    );
    const cookTime = parseDuration(
        html.match(/itemprop=["']cookTime["'][^>]*content=["']([^"']+)["']/i)?.[1]
    );

    // Servings
    const servings = parseNumber(
        html.match(/itemprop=["']recipeYield["'][^>]*content=["']([^"']+)["']/i)?.[1]
        ?? html.match(/itemprop=["']recipeYield["'][^>]*>([\s\S]*?)<\//i)?.[1]
    );

    // Image
    const imageUrl =
        html.match(/itemprop=["']image["'][^>]*src=["']([^"']+)["']/i)?.[1]
        ?? html.match(/itemprop=["']image["'][^>]*content=["']([^"']+)["']/i)?.[1];

    // Ingredients — handle <dt>qty</dt><dd itemprop='ingredients'>name</dd> pattern
    const ingredients: {qty: string; name: string}[] = [];
    // Only match <dt> tags with plain text (no nested tags) to avoid picking up metadata blocks
    const dtddRegex = /<dt[^>]*>([^<]{1,60})<\/dt>\s*<dd[^>]*itemprop=['"]ingredients['"][^>]*>([\s\S]*?)<\/dd>/gi;
    let m;
    while ((m = dtddRegex.exec(html)) !== null) {
        ingredients.push({
            qty: stripTags(m[1]),
            name: stripTags(m[2]),
        });
    }
    // Fallback: bare itemprop="ingredients" without preceding dt
    if (ingredients.length === 0) {
        const bareRegex = /itemprop=['"]ingredients['"][^>]*>([\s\S]*?)<\/(?:dd|li|span|p)>/gi;
        while ((m = bareRegex.exec(html)) !== null) {
            const text = stripTags(m[1]);
            if (text) ingredients.push(parseIngredient(text));
        }
    }

    // Instructions — extract from the itemprop="recipeInstructions" container
    const steps: string[] = [];
    const instrBlock = html.match(/itemprop=["']recipeInstructions["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? '';
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    while ((m = liRegex.exec(instrBlock)) !== null) {
        const text = stripTags(m[1]);
        if (text) steps.push(text);
    }
    if (steps.length === 0 && instrBlock) {
        const text = stripTags(instrBlock);
        if (text) steps.push(text);
    }

    return {
        name,
        prepTime,
        cookTime,
        servings,
        mealType: [],
        ingredients,
        steps,
        nutrition: {calories: 0, protein: 0, carbohydrates: 0, fats: 0},
        imageUrl,
    };
}

// ── Route handler ────────────────────────────────────────────────────────────

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

        // Try JSON-LD first, then microdata
        const ld = findRecipeJsonLd(html);
        if (ld) return NextResponse.json(mapJsonLd(ld));

        const microdata = parseMicrodata(html);
        if (microdata) return NextResponse.json(microdata);

        return NextResponse.json({error: 'No recipe found at this URL'}, {status: 422});
    } catch (e) {
        console.error('Import error:', e);
        return NextResponse.json({error: 'Failed to fetch recipe'}, {status: 500});
    }
}
