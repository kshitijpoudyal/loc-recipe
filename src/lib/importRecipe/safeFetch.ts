import {lookup} from 'node:dns/promises';
import {BlockList, isIP} from 'node:net';

// Addresses the importer must never reach: loopback, private networks,
// link-local (incl. cloud metadata at 169.254.169.254), CGNAT, multicast, etc.
const blocked = new BlockList();
blocked.addSubnet('0.0.0.0', 8, 'ipv4');
blocked.addSubnet('10.0.0.0', 8, 'ipv4');
blocked.addSubnet('100.64.0.0', 10, 'ipv4');
blocked.addSubnet('127.0.0.0', 8, 'ipv4');
blocked.addSubnet('169.254.0.0', 16, 'ipv4');
blocked.addSubnet('172.16.0.0', 12, 'ipv4');
blocked.addSubnet('192.0.0.0', 24, 'ipv4');
blocked.addSubnet('192.168.0.0', 16, 'ipv4');
blocked.addSubnet('198.18.0.0', 15, 'ipv4');
blocked.addSubnet('224.0.0.0', 3, 'ipv4');
blocked.addAddress('::', 'ipv6');
blocked.addAddress('::1', 'ipv6');
blocked.addSubnet('fc00::', 7, 'ipv6');
blocked.addSubnet('fe80::', 10, 'ipv6');
blocked.addSubnet('ff00::', 8, 'ipv6');

export class UnsafeUrlError extends Error {}

export function isBlockedAddress(address: string): boolean {
    let ip = address;
    // IPv4-mapped IPv6 (::ffff:127.0.0.1) → check the IPv4 part
    const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
    if (mapped) ip = mapped[1];
    const family = isIP(ip);
    if (family === 0) return true;
    return blocked.check(ip, family === 4 ? 'ipv4' : 'ipv6');
}

export async function assertPublicUrl(raw: string): Promise<URL> {
    let url: URL;
    try {
        url = new URL(raw);
    } catch {
        throw new UnsafeUrlError('Invalid URL');
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new UnsafeUrlError('Only http(s) URLs are allowed');
    }
    if (url.username || url.password) {
        throw new UnsafeUrlError('URLs with credentials are not allowed');
    }
    const host = url.hostname.replace(/^\[|\]$/g, '');
    const addresses = isIP(host)
        ? [{address: host}]
        : await lookup(host, {all: true}).catch(() => {
            throw new UnsafeUrlError('Could not resolve host');
        });
    if (addresses.length === 0 || addresses.some(a => isBlockedAddress(a.address))) {
        throw new UnsafeUrlError('This address is not allowed');
    }
    return url;
}

const MAX_REDIRECTS = 5;
const MAX_BYTES = 3 * 1024 * 1024;

/**
 * Fetch a public web page as text. Every hop (including redirects) is checked
 * against the blocklist, and the body is capped at MAX_BYTES.
 */
export async function fetchPublicHtml(raw: string, timeoutMs = 10000): Promise<string> {
    const signal = AbortSignal.timeout(timeoutMs);
    let current = raw;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
        const url = await assertPublicUrl(current);
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; RecipeImporter/1.0)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            redirect: 'manual',
            signal,
        });
        if (res.status >= 300 && res.status < 400) {
            const location = res.headers.get('location');
            if (!location) throw new Error('Redirect without location');
            current = new URL(location, url).toString();
            continue;
        }
        if (!res.ok) throw new Error(`Upstream responded ${res.status}`);
        return await readCapped(res, MAX_BYTES);
    }
    throw new Error('Too many redirects');
}

async function readCapped(res: Response, maxBytes: number): Promise<string> {
    if (!res.body) return '';
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > maxBytes) {
            await reader.cancel();
            break; // recipe JSON-LD is almost always in <head>; keep what we have
        }
        chunks.push(value);
    }
    return new TextDecoder().decode(Buffer.concat(chunks));
}
