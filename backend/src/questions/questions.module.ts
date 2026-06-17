import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Passage } from '../entities/passage.entity';
import { Audio } from '../entities/audio.entity';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Passage, Audio])],
  providers: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
