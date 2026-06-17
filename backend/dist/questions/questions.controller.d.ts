import { QuestionsService } from './questions.service';
import { Question } from '../entities/question.entity';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    findAll(): Promise<Question[]>;
    findAllPassages(): Promise<import("../entities/passage.entity").Passage[]>;
    downloadTemplate(res: any): Promise<void>;
    findOne(id: string): Promise<Question | null>;
    create(data: Partial<Question>): Promise<Question>;
    update(id: string, data: Partial<Question>): Promise<Question | null>;
    remove(id: string): Promise<void>;
    importExcel(file: any, packageId?: string): Promise<any>;
    seed(): Promise<any>;
}
