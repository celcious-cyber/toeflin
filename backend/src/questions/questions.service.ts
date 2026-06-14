import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { Passage } from '../entities/passage.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Passage)
    private passageRepository: Repository<Passage>,
  ) {}

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find({ relations: { passage: true, audio: true } });
  }

  async findOne(id: string): Promise<Question | null> {
    return this.questionRepository.findOne({ where: { id }, relations: { passage: true, audio: true } });
  }

  async create(data: Partial<Question>): Promise<Question> {
    const question = this.questionRepository.create(data);
    return this.questionRepository.save(question);
  }

  async update(id: string, data: Partial<Question>): Promise<Question | null> {
    await this.questionRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.questionRepository.delete(id);
  }

  async importFromExcel(buffer: Buffer): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.worksheets[0];
    
    const questionsToSave: Question[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      
      const question = this.questionRepository.create({
        section: row.getCell(1).value?.toString() || '',
        skillCategory: row.getCell(2).value?.toString(),
        content: row.getCell(3).value?.toString() || '',
        choices: {
          a: row.getCell(4).value?.toString(),
          b: row.getCell(5).value?.toString(),
          c: row.getCell(6).value?.toString(),
          d: row.getCell(7).value?.toString(),
        },
        answerKey: row.getCell(8).value?.toString() || '',
        explanation: row.getCell(9).value?.toString(),
      });
      questionsToSave.push(question);
    });

    await this.questionRepository.save(questionsToSave);
    return { importedCount: questionsToSave.length };
  }

  async seed(): Promise<any> {
    const passage = this.passageRepository.create({
      title: 'The History of TOEFL',
      content: 'The Test of English as a Foreign Language (TOEFL) is a standardized test to measure the English language ability of non-native speakers wishing to enroll in English-speaking universities. The test is accepted by many English-speaking academic and professional institutions. TOEFL is one of the two major English-language tests in the world, the other being the IELTS.\n\nThe TOEFL test was originally developed at the Center for Applied Linguistics under the direction of applied linguist Dr. Charles A. Ferguson.'
    });
    const savedPassage = await this.passageRepository.save(passage);

    const questions = [
      {
        section: 'Reading',
        content: 'What is the main purpose of the TOEFL test?',
        choices: {
          a: 'To test native speakers',
          b: 'To measure English ability of non-native speakers',
          c: 'To teach linguistics',
          d: 'To enroll in any university'
        },
        answerKey: 'B',
        passage: savedPassage
      },
      {
        section: 'Reading',
        content: 'Who directed the original development of the TOEFL test?',
        choices: {
          a: 'Dr. Charles A. Ferguson',
          b: 'A non-native speaker',
          c: 'The IELTS committee',
          d: 'An anonymous linguist'
        },
        answerKey: 'A',
        passage: savedPassage
      },
      {
        section: 'Listening',
        content: 'Which of the following is NOT a major English test mentioned?',
        choices: {
          a: 'TOEFL',
          b: 'IELTS',
          c: 'TOEIC',
          d: 'None of the above'
        },
        answerKey: 'C'
      }
    ];

    for (const q of questions) {
      await this.questionRepository.save(this.questionRepository.create(q));
    }
    return { message: 'Database seeded with dummy Reading passage and questions' };
  }
}
