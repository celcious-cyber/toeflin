import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScoreConversion } from '../entities/score-conversion.entity';

@Injectable()
export class ScoreConversionsService {
  constructor(
    @InjectRepository(ScoreConversion)
    private scoreConversionRepository: Repository<ScoreConversion>,
  ) {}

  findAll() {
    return this.scoreConversionRepository.find();
  }

  async createOrUpdate(data: Partial<ScoreConversion>) {
    const existing = await this.scoreConversionRepository.findOne({
      where: { section: data.section, rawScore: data.rawScore }
    });
    if (existing) {
      await this.scoreConversionRepository.update(existing.id, { scaledScore: data.scaledScore });
      return this.scoreConversionRepository.findOne({ where: { id: existing.id } });
    } else {
      const conversion = this.scoreConversionRepository.create(data);
      return this.scoreConversionRepository.save(conversion);
    }
  }

  async remove(id: number) {
    await this.scoreConversionRepository.delete(id);
  }
}
