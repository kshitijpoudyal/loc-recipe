import {describe, expect, it} from "vitest";
import {assertPublicUrl, isBlockedAddress, UnsafeUrlError} from "./safeFetch";

describe("isBlockedAddress", () => {
    it.each([
        "127.0.0.1", "10.1.2.3", "172.16.0.1", "192.168.1.10", "169.254.169.254",
        "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1",
    ])("blocks %s", (ip) => {
        expect(isBlockedAddress(ip)).toBe(true);
    });

    it.each(["8.8.8.8", "151.101.1.69", "2606:4700::1111"])("allows %s", (ip) => {
        expect(isBlockedAddress(ip)).toBe(false);
    });
});

describe("assertPublicUrl", () => {
    it.each([
        "file:///etc/passwd",
        "ftp://example.com/x",
        "http://127.0.0.1:3000/",
        "http://169.254.169.254/latest/meta-data/",
        "http://[::1]/",
        "http://user:pass@example.com/",
        "not a url",
    ])("rejects %s", async (url) => {
        await expect(assertPublicUrl(url)).rejects.toBeInstanceOf(UnsafeUrlError);
    });

    it("accepts a public IP literal", async () => {
        await expect(assertPublicUrl("https://8.8.8.8/")).resolves.toBeInstanceOf(URL);
    });
});
