import { User } from './user.entity';
import { TestPackage } from './test-package.entity';
export declare class TestAttempt {
    id: string;
    user: User;
    userId: string;
    testPackage: TestPackage;
    packageId: string;
    date: Date;
    durationSeconds: number;
    answers: any;
    rawScores: any;
    scaledScores: any;
    totalScore: number;
}
