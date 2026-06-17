import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestAttempt } from '../entities/test-attempt.entity';
import { TestPackage } from '../entities/test-package.entity';
import { ScoreConversion } from '../entities/score-conversion.entity';
import { TestRequest, RequestStatus } from '../entities/test-request.entity';
import { Question } from '../entities/question.entity';

@Injectable()
export class TestEngineService {
  constructor(
    @InjectRepository(TestAttempt) private attemptRepo: Repository<TestAttempt>,
    @InjectRepository(TestPackage) private pkgRepo: Repository<TestPackage>,
    @InjectRepository(ScoreConversion) private scoreRepo: Repository<ScoreConversion>,
    @InjectRepository(TestRequest) private reqRepo: Repository<TestRequest>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
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
    
    const allQuestions = await this.questionRepo.find();
    
    // Group all questions by ID
    const questionsMap = new Map<string, Question>();
    allQuestions.forEach(q => {
      questionsMap.set(q.id, q);
    });

    const answers = attempt.answers || {};
    
    let correctListening = 0;
    let correctStructure = 0;
    let correctReading = 0;

    let totalListening = 0;
    let totalStructure = 0;
    let totalReading = 0;

    // Count total questions in each section from database
    allQuestions.forEach(q => {
      const sec = q.section.toLowerCase();
      if (sec === 'listening') totalListening++;
      else if (sec === 'structure') totalStructure++;
      else if (sec === 'reading') totalReading++;
    });

    // Check student's answers
    Object.entries(answers).forEach(([qId, val]: [string, any]) => {
      const question = questionsMap.get(qId);
      if (question) {
        const isCorrect = val && question.answerKey && val.toString().trim().toLowerCase() === question.answerKey.toString().trim().toLowerCase();
        
        const sec = question.section.toLowerCase();
        if (sec === 'listening') {
          if (isCorrect) correctListening++;
        } else if (sec === 'structure') {
          if (isCorrect) correctStructure++;
        } else if (sec === 'reading') {
          if (isCorrect) correctReading++;
        }
      }
    });

    // Save raw scores
    attempt.rawScores = {
      listening: correctListening,
      structure: correctStructure,
      reading: correctReading,
    };

    // Calculate scaled scores
    const getScaled = async (sectionName: string, rawScore: number, totalQuestions: number, isReading: boolean): Promise<number> => {
      const dbConversion = await this.scoreRepo.findOne({
        where: { section: sectionName, rawScore: rawScore }
      });
      if (dbConversion) {
        return dbConversion.scaledScore;
      }
      
      // Fallback calculation:
      if (totalQuestions <= 0) return 31;
      const maxScaled = isReading ? 67 : 68;
      const minScaled = 31;
      return Math.round(minScaled + (rawScore / totalQuestions) * (maxScaled - minScaled));
    };

    const scaledListening = await getScaled('Listening', correctListening, totalListening, false);
    const scaledStructure = await getScaled('Structure', correctStructure, totalStructure, false);
    const scaledReading = await getScaled('Reading', correctReading, totalReading, true);

    attempt.scaledScores = {
      listening: scaledListening,
      structure: scaledStructure,
      reading: scaledReading,
    };

    attempt.totalScore = Math.round(((scaledListening + scaledStructure + scaledReading) / 3) * 10);
    
    await this.attemptRepo.save(attempt);
    return attempt;
  }

  async getUserAttempts(userId: string) {
    return this.attemptRepo.find({
      where: { userId },
      relations: { testPackage: true },
      order: { date: 'DESC' },
    });
  }

  async getQuestionsForPackage(packageId: string) {
    const pkg = await this.pkgRepo.findOne({ where: { id: packageId } });
    if (!pkg) throw new BadRequestException('Package not found');

    let questionsList: Question[] = [];

    // 1. Try to find questions directly associated with this package via packageId
    questionsList = await this.questionRepo.find({
      where: { packageId: packageId },
      relations: { passage: true, audio: true }
    });

    // 2. If no questions are found, check if there are specific IDs in JSON pkg.questions
    if (questionsList.length === 0 && pkg.questions && (pkg.questions.listening?.length || pkg.questions.structure?.length || pkg.questions.reading?.length)) {
      const allIds = [
        ...(pkg.questions.listening || []),
        ...(pkg.questions.structure || []),
        ...(pkg.questions.reading || []),
      ];
      if (allIds.length > 0) {
        questionsList = await this.questionRepo.createQueryBuilder('question')
          .where('question.id IN (:...allIds)', { allIds })
          .leftJoinAndSelect('question.passage', 'passage')
          .leftJoinAndSelect('question.audio', 'audio')
          .getMany();
      }
    }

    // 3. Fallback: If still no questions, get all general questions (where packageId is null)
    if (questionsList.length === 0) {
      questionsList = await this.questionRepo.find({
        where: { packageId: null },
        relations: { passage: true, audio: true }
      });
    }

    // Sort questions by TOEFL section order: Listening, Structure, Reading
    const sectionOrder: Record<string, number> = { 'Listening': 1, 'Structure': 2, 'Reading': 3 };
    questionsList.sort((a, b) => {
      const orderA = sectionOrder[a.section] || 99;
      const orderB = sectionOrder[b.section] || 99;
      return orderA - orderB;
    });

    // Process questions:
    // 1. STRIP answerKey for client security
    // 2. Shuffle choices dynamically on the backend
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    return questionsList.map(q => {
      // Create a shallow copy and remove answerKey
      const { answerKey, ...cleanQuestion } = q as any;
      
      // Shuffle choices and create shuffled entries
      const choicesEntries = Object.entries(q.choices || {});
      const shuffledEntries = shuffleArray(choicesEntries);

      return {
        ...cleanQuestion,
        shuffledEntries,
      };
    });
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
