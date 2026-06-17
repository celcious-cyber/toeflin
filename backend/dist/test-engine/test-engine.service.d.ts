import { Repository } from 'typeorm';
import { TestAttempt } from '../entities/test-attempt.entity';
import { TestPackage } from '../entities/test-package.entity';
import { ScoreConversion } from '../entities/score-conversion.entity';
import { TestRequest, RequestStatus } from '../entities/test-request.entity';
import { Question } from '../entities/question.entity';
export declare class TestEngineService {
    private attemptRepo;
    private pkgRepo;
    private scoreRepo;
    private reqRepo;
    private questionRepo;
    constructor(attemptRepo: Repository<TestAttempt>, pkgRepo: Repository<TestPackage>, scoreRepo: Repository<ScoreConversion>, reqRepo: Repository<TestRequest>, questionRepo: Repository<Question>);
    startTest(userId: string, packageId: string): Promise<TestAttempt>;
    saveAnswers(attemptId: string, answers: any, durationSeconds: number): Promise<{
        success: boolean;
    }>;
    submitTest(attemptId: string): Promise<TestAttempt>;
    requestAttempt(userId: string, packageId: string): Promise<TestRequest>;
    getRequests(): Promise<TestRequest[]>;
    updateRequestStatus(id: string, status: RequestStatus): Promise<TestRequest>;
}
