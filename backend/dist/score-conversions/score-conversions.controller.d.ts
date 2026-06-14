import { ScoreConversionsService } from './score-conversions.service';
import { ScoreConversion } from '../entities/score-conversion.entity';
export declare class ScoreConversionsController {
    private readonly scoreConversionsService;
    constructor(scoreConversionsService: ScoreConversionsService);
    findAll(): Promise<ScoreConversion[]>;
    createOrUpdate(data: Partial<ScoreConversion>): Promise<ScoreConversion | null>;
    remove(id: string): Promise<void>;
}
