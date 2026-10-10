import {NextResponse} from 'next/server';
import {findRecipeJsonLd, mapJsonLd, parseMicrodata} from '@/lib/importRecipe/parse';
import {fetchPublicHtml, UnsafeUrlError} from '@/lib/importRecipe/safeFetch';
import {bearerToken, verifyIdToken} from '@/lib/verifyIdToken';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    const uid = await verifyIdToken(bearerToken(req));
    if (!uid) return NextResponse.json({error: 'Please sign in to import recipes'}, {status: 401});

    let url: string | undefined;
    try {
        ({url} = await req.json() as {url?: string});
    } catch {
        return NextResponse.json({error: 'Invalid request body'}, {status: 400});
    }
    if (!url || typeof url !== 'string') {
        return NextResponse.json({error: 'URL is required'}, {status: 400});
    }

    try {
        const html = await fetchPublicHtml(url);

        // Try JSON-LD first, then microdata
        const ld = findRecipeJsonLd(html);
        if (ld) return NextResponse.json(mapJsonLd(ld));

        const microdata = parseMicrodata(html);
        if (microdata) return NextResponse.json(microdata);

        return NextResponse.json({error: 'No recipe found at this URL'}, {status: 422});
    } catch (e) {
        if (e instanceof UnsafeUrlError) {
            return NextResponse.json({error: e.message}, {status: 400});
        }
        console.error('Import error:', e);
        return NextResponse.json({error: 'Failed to fetch recipe'}, {status: 502});
    }
}
