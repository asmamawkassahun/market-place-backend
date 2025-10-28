import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(email: string, name?: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    findAll(): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    update(id: string, data: {
        name?: string;
        email?: string;
    }): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
