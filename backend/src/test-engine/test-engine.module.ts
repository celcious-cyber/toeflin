import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestAttempt } from '../entities/test-attempt.entity';
import { TestPackage } from '../entities/test-package.entity';
import { ScoreConversion } from '../entities/score-conversion.entity';
import { TestRequest } from '../entities/test-request.entity';
import { Question } from '../entities/question.entity';
import { TestEngineService } from './test-engine.service';
import { TestEngineController } from './test-engine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestAttempt, TestPackage, ScoreConversion, TestRequest, Question])],
  providers: [TestEngineService],
  controllers: [TestEngineController],
})
export class TestEngineModule {}
