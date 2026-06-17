import { TestEngineService } from './test-engine.service';
import { RequestStatus } from '../entities/test-request.entity';
export declare class TestEngineController {
    private readonly testEngineService;
    constructor(testEngineService: TestEngineService);
    startTest(body: {
        userId: string;
        packageId: string;
    }): Promise<import("../entities/test-attempt.entity").TestAttempt>;
    saveAnswers(id: string, body: {
        answers: any;
        durationSeconds: number;
    }): Promise<{
        success: boolean;
    }>;
    submitTest(id: string): Promise<import("../entities/test-attempt.entity").TestAttempt>;
    requestAttempt(body: {
        userId: string;
        packageId: string;
    }): Promise<import("../entities/test-request.entity").TestRequest>;
    getUserAttempts(userId: string): Promise<import("../entities/test-attempt.entity").TestAttempt[]>;
    getQuestionsForPackage(packageId: string): Promise<any[]>;
    getRequests(): Promise<import("../entities/test-request.entity").TestRequest[]>;
    updateRequestStatus(id: string, status: RequestStatus): Promise<import("../entities/test-request.entity").TestRequest>;
}
