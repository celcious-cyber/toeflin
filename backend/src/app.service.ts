import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
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
    const totalStudents = await this.dataSource.getRepository(User).count({
      where: { role: 'student' as any }
    });

    const totalQuestions = await this.dataSource.getRepository(Question).count();

    const totalActiveAttempts = await this.dataSource.getRepository(TestAttempt).count({
      where: { totalScore: null as any }
    });

    const totalPendingRequests = await this.dataSource.getRepository(TestRequest).count({
      where: { status: 'PENDING' as any }
    });

    return {
      totalStudents,
      totalQuestions,
      totalActiveAttempts,
      totalPendingRequests
    };
  }
}
