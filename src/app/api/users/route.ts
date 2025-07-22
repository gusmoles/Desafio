import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ users });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        console.error('Database query error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            },
        });

        return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        console.error('Database create error:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
} 