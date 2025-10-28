import { UsersService } from './users.service';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    get(id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
