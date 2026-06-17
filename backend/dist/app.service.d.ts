import { DataSource } from 'typeorm';
export declare class AppService {
    private dataSource;
    constructor(dataSource: DataSource);
    getHello(): string;
    getAdminStats(): Promise<{
        totalStudents: number;
        totalQuestions: number;
        totalActiveAttempts: number;
        totalPendingRequests: number;
    }>;
}
