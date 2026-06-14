export declare enum UserRole {
    ADMIN = "admin",
    STUDENT = "student"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
