import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Passage } from '../entities/passage.entity';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Passage])],
  providers: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
