// lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcryptjs from "bcryptjs";
import { prisma } from './prisma';

const secretKey = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(username: string, password: string) {
    const admin = await prisma.admin.findUnique({
        where: { username }
    });

    if (!admin) return null;

    const validPassword = await bcryptjs.compare(password, admin.password);
    if (!validPassword) return null;

    const token = await encrypt({ userId: admin.id, username: admin.username });

    // FIX: await cookies() first
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    });

    return admin;
}

export async function logout() {
    // FIX: await cookies() first
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export async function getSession() {
    // FIX: await cookies() first
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}