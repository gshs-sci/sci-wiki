import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// middleware for ip parsing
export function middleware(request: NextRequest) {

    const requestHeaders = new Headers(request.headers);

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