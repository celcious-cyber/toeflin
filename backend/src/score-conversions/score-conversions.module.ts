import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreConversion } from '../entities/score-conversion.entity';
import { ScoreConversionsService } from './score-conversions.service';
import { ScoreConversionsController } from './score-conversions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ScoreConversion])],
  providers: [ScoreConversionsService],
  controllers: [ScoreConversionsController],
})
export class ScoreConversionsModule {}
