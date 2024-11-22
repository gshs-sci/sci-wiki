import { NextResponse, URLPattern } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

// middleware for ip parsing
export async function middleware(request: NextRequest) {
    if (!process.env.JWT_KEY) {
        throw new Error("no JWT_KEY env provided. terminating..")
    }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", "")
    const JWT_KEY = new TextEncoder().encode(process.env.JWT_KEY)
    let auth = request.cookies.get("auth")
    if (auth) {
        try {
            const { payload } = await jose.jwtVerify(auth.value, JWT_KEY)
            const uid = payload.uid as string
            requestHeaders.set("x-user-id", uid)
        } catch (_) {
        }
    }

    let ip = requestHeaders.get("CF-Connecting-IP")
    if (!ip) {
        ip = request.ip || "127.0.0.1";
    }
    requestHeaders.set("x-forwarded-for", ip);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}