import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestAttempt } from '../entities/test-attempt.entity';
import { TestPackage } from '../entities/test-package.entity';
import { ScoreConversion } from '../entities/score-conversion.entity';
import { TestRequest, RequestStatus } from '../entities/test-request.entity';

@Injectable()
export class TestEngineService {
  constructor(
    @InjectRepository(TestAttempt) private attemptRepo: Repository<TestAttempt>,
    @InjectRepository(TestPackage) private pkgRepo: Repository<TestPackage>,
    @InjectRepository(ScoreConversion) private scoreRepo: Repository<ScoreConversion>,
    @InjectRepository(TestRequest) private reqRepo: Repository<TestRequest>,
  ) {}

  async startTest(userId: string, packageId: string) {
    const pkg = await this.pkgRepo.findOne({ where: { id: packageId } });
    if (!pkg) throw new BadRequestException('Package not found');

    if (pkg.type === 'Full Test') {
      const lastAttempt = await this.attemptRepo.findOne({
        where: { userId, packageId },
        order: { date: 'DESC' },
      });
      if (lastAttempt) {
        const diffMs = Date.now() - new Date(lastAttempt.date).getTime();
        if (diffMs < 7 * 24 * 60 * 60 * 1000) {
          // Check if there's an APPROVED request
          const approvedReq = await this.reqRepo.findOne({
            where: { userId, packageId, status: RequestStatus.APPROVED },
          });

          if (approvedReq) {
            // Consume the request
            approvedReq.status = RequestStatus.USED;
            await this.reqRepo.save(approvedReq);
          } else {
            throw new BadRequestException({
              message: 'Uuups! Kesempatan kamu sudah habis, silakan mencoba minggu depan yahh 😊',
              code: 'WEEKLY_LIMIT_REACHED'
            });
          }
        }
      }
    }

    const attempt = this.attemptRepo.create({
      userId,
      packageId,
      answers: {},
      durationSeconds: 0,
    });
    return this.attemptRepo.save(attempt);
  }

  async saveAnswers(attemptId: string, answers: any, durationSeconds: number) {
    await this.attemptRepo.update(attemptId, { answers, durationSeconds });
    return { success: true };
  }

  async submitTest(attemptId: string) {
    const attempt = await this.attemptRepo.findOne({ where: { id: attemptId } });
    if (!attempt) throw new BadRequestException('Attempt not found');
    
    // TODO: implement actual scoring logic mapping questions to answerKey
    // Mock processing for MVP:
    attempt.rawScores = { listening: 30, structure: 25, reading: 40 };
    attempt.scaledScores = { listening: 50, structure: 45, reading: 55 };
    attempt.totalScore = Math.round(((50 + 45 + 55) / 3) * 10);
    
    await this.attemptRepo.save(attempt);
    return attempt;
  }

  async requestAttempt(userId: string, packageId: string) {
    const existingReq = await this.reqRepo.findOne({
      where: { userId, packageId, status: RequestStatus.PENDING },
    });
    if (existingReq) {
      throw new BadRequestException('Anda sudah memiliki permohonan yang sedang menunggu persetujuan.');
    }
    const newReq = this.reqRepo.create({ userId, packageId });
    return this.reqRepo.save(newReq);
  }

  async getRequests() {
    return this.reqRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateRequestStatus(id: string, status: RequestStatus) {
    const req = await this.reqRepo.findOne({ where: { id } });
    if (!req) throw new BadRequestException('Request not found');
    req.status = status;
    return this.reqRepo.save(req);
  }
}
