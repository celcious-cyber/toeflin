import { Injectable } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { User } from './entities/user.entity';
import { Question } from './entities/question.entity';
import { TestAttempt } from './entities/test-attempt.entity';
import { TestRequest } from './entities/test-request.entity';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getAdminStats() {
    let totalStudents = 0;
    let totalQuestions = 0;
    let totalActiveAttempts = 0;
    let totalPendingRequests = 0;
    const errors: string[] = [];

    try {
      totalStudents = await this.dataSource.getRepository(User).count({
        where: { role: 'student' as any }
      });
    } catch (e: any) {
      errors.push(`totalStudents error: ${e.message}`);
    }

    try {
      totalQuestions = await this.dataSource.getRepository(Question).count();
    } catch (e: any) {
      errors.push(`totalQuestions error: ${e.message}`);
    }

    try {
      totalActiveAttempts = await this.dataSource.getRepository(TestAttempt).count({
        where: { totalScore: IsNull() }
      });
    } catch (e: any) {
      errors.push(`totalActiveAttempts error: ${e.message}`);
    }

    try {
      totalPendingRequests = await this.dataSource.getRepository(TestRequest).count({
        where: { status: 'PENDING' as any }
      });
    } catch (e: any) {
      errors.push(`totalPendingRequests error: ${e.message}`);
    }

    return {
      totalStudents,
      totalQuestions,
      totalActiveAttempts,
      totalPendingRequests,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}
