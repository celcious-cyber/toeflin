import { Repository } from 'typeorm';
import { ScoreConversion } from '../entities/score-conversion.entity';
export declare class ScoreConversionsService {
    private scoreConversionRepository;
    constructor(scoreConversionRepository: Repository<ScoreConversion>);
    findAll(): Promise<ScoreConversion[]>;
    createOrUpdate(data: Partial<ScoreConversion>): Promise<ScoreConversion | null>;
    remove(id: number): Promise<void>;
}
